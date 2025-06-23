/*
 * FireWatch IoT Fire Detection System
 * ESP32-based sensor node for real-time fire monitoring
 * 
 * Features:
 * - Temperature and humidity monitoring (DHT11)
 * - Smoke detection (MQ2)
 * - Flame detection (IR sensor)
 * - WiFi connectivity
 * - Backend API integration
 * - Twilio SMS alerts
 * - Web server for manual control
 * 
 * Author: FireWatch Team
 * Date: June 2025
 */

#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>
#include <Base64.h>
#include <WebServer.h>

WebServer server(80);

// === Pin Definitions ===
#define DHTPIN 4
#define DHTTYPE DHT11
#define MQ2_PIN 34
#define FLAME_PIN 23
#define LED_PIN 22
#define BUZZER 2

DHT dht(DHTPIN, DHTTYPE);

// === WiFi Configuration ===
// TODO: Update with your WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Backend API endpoint
const char* serverName = "https://firewatch-backend-2cri.onrender.com/sensor";

// === Twilio SMS Configuration ===
// TODO: Update with your Twilio credentials
const char* account_sid = "YOUR_TWILIO_ACCOUNT_SID";
const char* auth_token = "YOUR_TWILIO_AUTH_TOKEN";
const char* from_number = "+1234567890";  // Your Twilio phone number
const char* to_number = "+1234567890";    // Recipient phone number
const char* twilio_host = "api.twilio.com";
const int httpsPort = 443;

// === System Variables ===
unsigned long lastSMSSent = 0;
const unsigned long smsCooldown = 15000; // 15 seconds cooldown between SMS

bool manualOverrideBuzzer = false;
bool manualOverrideLight = false;

// === Sensor Thresholds ===
const float TEMP_THRESHOLD = 35.0;    // °C
const int SMOKE_THRESHOLD = 1280;     // Analog value

void setup() {
  Serial.begin(115200);
  Serial.println("🔥 FireWatch IoT Sensor Starting...");
  
  // Initialize pins
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(FLAME_PIN, INPUT);
  
  // Initialize sensors
  dht.begin();
  
  // Connect to WiFi
  connectToWiFi();
  
  // Setup web server endpoints
  setupWebServer();
  
  Serial.println("✅ FireWatch System Ready!");
  Serial.println("📊 Starting sensor monitoring...");
}

void loop() {
  server.handleClient();

  // Read sensor data
  SensorData data = readSensors();
  
  // Check for valid readings
  if (!data.valid) {
    Serial.println("❌ Invalid sensor readings, skipping cycle");
    delay(2000);
    return;
  }

  // Display sensor readings
  displaySensorData(data);

  // Control alert systems
  controlAlerts(data);

  // Send data to backend
  sendToBackend(data);

  // Check for SMS alerts
  checkSMSAlerts(data);

  delay(2000); // Wait 2 seconds before next reading
}

// === Data Structure ===
struct SensorData {
  float temperature;
  float humidity;
  int smoke;
  bool flame;
  bool fireDetected;
  bool valid;
};

// === Sensor Reading Function ===
SensorData readSensors() {
  SensorData data;
  
  data.temperature = dht.readTemperature();
  data.humidity = dht.readHumidity();
  data.smoke = analogRead(MQ2_PIN);
  data.flame = digitalRead(FLAME_PIN) == LOW; // LOW = fire detected
  
  // Check for valid DHT readings
  if (isnan(data.temperature) || isnan(data.humidity)) {
    data.valid = false;
    return data;
  }
  
  // Determine fire detection status
  data.fireDetected = (data.temperature > TEMP_THRESHOLD || data.flame);
  data.valid = true;
  
  return data;
}

// === WiFi Connection ===
void connectToWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✅ WiFi Connected!");
    Serial.println("📡 IP Address: " + WiFi.localIP().toString());
  } else {
    Serial.println("\n❌ WiFi Connection Failed!");
  }
}

// === Web Server Setup ===
void setupWebServer() {
  // Manual LED control
  server.on("/led/off", []() {
    manualOverrideLight = true;
    digitalWrite(LED_PIN, LOW);
    Serial.println("💡 LED turned OFF via WebServer");
    server.send(200, "application/json", "{\"status\":\"led_off\",\"message\":\"LED turned off\"}");
  });

  // Manual buzzer control
  server.on("/buzzer/off", []() {
    manualOverrideBuzzer = true;
    digitalWrite(BUZZER, LOW);
    Serial.println("🔇 Buzzer turned OFF via WebServer");
    server.send(200, "application/json", "{\"status\":\"buzzer_off\",\"message\":\"Buzzer turned off\"}");
  });

  // Status endpoint
  server.on("/status", []() {
    SensorData data = readSensors();
    
    String json = "{";
    json += "\"temperature\":" + String(data.temperature) + ",";
    json += "\"humidity\":" + String(data.humidity) + ",";
    json += "\"smoke\":" + String(data.smoke) + ",";
    json += "\"flame_detected\":" + String(data.flame ? "true" : "false") + ",";
    json += "\"fire_alert\":" + String(data.fireDetected ? "true" : "false") + ",";
    json += "\"wifi_status\":\"" + String(WiFi.status() == WL_CONNECTED ? "connected" : "disconnected") + "\",";
    json += "\"ip_address\":\"" + WiFi.localIP().toString() + "\"";
    json += "}";
    
    server.send(200, "application/json", json);
  });

  // Root endpoint
  server.on("/", []() {
    String html = "<!DOCTYPE html><html><head><title>FireWatch Sensor</title></head><body>";
    html += "<h1>🔥 FireWatch IoT Sensor</h1>";
    html += "<p><a href='/status'>📊 View Status</a></p>";
    html += "<p><a href='/led/off'>💡 Turn OFF LED</a></p>";
    html += "<p><a href='/buzzer/off'>🔇 Turn OFF Buzzer</a></p>";
    html += "</body></html>";
    server.send(200, "text/html", html);
  });

  server.begin();
  Serial.println("🌐 Web server started on port 80");
}

// === Display Sensor Data ===
void displaySensorData(SensorData data) {
  Serial.printf("🌡️ Temp: %.2f°C | 💧 Hum: %.2f%% | 💨 Smoke: %d | 🔥 Flame: %s | 🚨 Fire: %s\n",
                data.temperature, data.humidity, data.smoke, 
                data.flame ? "DETECTED" : "None", 
                data.fireDetected ? "ALERT" : "Normal");
}

// === Alert Control System ===
void controlAlerts(SensorData data) {
  // LED Control for fire detection
  if (data.fireDetected && !manualOverrideLight) {
    digitalWrite(LED_PIN, HIGH);
  } else if (!data.fireDetected && !manualOverrideLight) {
    digitalWrite(LED_PIN, LOW);
  }

  // Reset LED manual override when conditions are normal
  if (!data.fireDetected && manualOverrideLight) {
    manualOverrideLight = false;
    Serial.println("💡 Light override cleared - conditions normal");
  }

  // Buzzer Control for smoke detection
  if (data.smoke > SMOKE_THRESHOLD && !manualOverrideBuzzer) {
    digitalWrite(BUZZER, HIGH);
  } else if (data.smoke <= SMOKE_THRESHOLD && !manualOverrideBuzzer) {
    digitalWrite(BUZZER, LOW);
  }

  // Reset buzzer manual override when smoke levels are normal
  if (data.smoke <= SMOKE_THRESHOLD && manualOverrideBuzzer) {
    manualOverrideBuzzer = false;
    Serial.println("🔇 Buzzer override cleared - smoke levels normal");
  }
}

// === Backend Communication ===
void sendToBackend(SensorData data) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ WiFi not connected - cannot send data");
    return;
  }

  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(10000); // 10 second timeout

  // Create JSON payload
  StaticJsonDocument<300> doc;
  doc["temperature"] = data.temperature;
  doc["humidity"] = data.humidity;
  doc["smoke"] = data.smoke;
  doc["flame_detected"] = data.flame;
  doc["fire_alert"] = (data.fireDetected || data.smoke > SMOKE_THRESHOLD);
  doc["timestamp"] = millis();
  doc["device_id"] = WiFi.macAddress();

  String payload;
  serializeJson(doc, payload);

  // Send POST request
  int httpResponseCode = http.POST(payload);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("✅ Data sent to backend successfully");
    if (httpResponseCode != 200) {
      Serial.println("⚠️ Response code: " + String(httpResponseCode));
    }
  } else {
    Serial.println("❌ Failed to send data to backend");
    Serial.println("🔍 Error code: " + String(httpResponseCode));
  }

  http.end();
}

// === SMS Alert System ===
void checkSMSAlerts(SensorData data) {
  bool alertCondition = (data.fireDetected || data.smoke > SMOKE_THRESHOLD);
  bool cooldownExpired = (millis() - lastSMSSent > smsCooldown);
  
  if (alertCondition && cooldownExpired) {
    String alertMessage = "🚨 FIREWATCH ALERT!\n";
    alertMessage += "Temp: " + String(data.temperature) + "°C\n";
    alertMessage += "Smoke: " + String(data.smoke) + "\n";
    
    if (data.flame) {
      alertMessage += "🔥 FLAME DETECTED!\n";
    }
    if (data.temperature > TEMP_THRESHOLD) {
      alertMessage += "🌡️ HIGH TEMPERATURE!\n";
    }
    if (data.smoke > SMOKE_THRESHOLD) {
      alertMessage += "💨 HIGH SMOKE LEVELS!\n";
    }
    
    alertMessage += "Location: " + WiFi.localIP().toString();
    
    sendTwilioSMS(alertMessage);
    lastSMSSent = millis();
  }
}

// === Twilio SMS Function ===
void sendTwilioSMS(String message) {
  WiFiClientSecure client;
  client.setInsecure(); // For development only - use proper certificates in production

  Serial.println("📱 Sending SMS alert...");
  
  if (!client.connect(twilio_host, httpsPort)) {
    Serial.println("❌ Failed to connect to Twilio");
    return;
  }

  // Prepare POST data
  String postData = "To=" + String(to_number) +
                    "&From=" + String(from_number) +
                    "&Body=" + message;

  // Create authorization header
  String auth = String(account_sid) + ":" + String(auth_token);
  String encoded = base64::encode(auth);

  // Send HTTP request
  client.println("POST /2010-04-01/Accounts/" + String(account_sid) + "/Messages.json HTTP/1.1");
  client.println("Host: api.twilio.com");
  client.println("Authorization: Basic " + encoded);
  client.println("Content-Type: application/x-www-form-urlencoded");
  client.println("Content-Length: " + String(postData.length()));
  client.println("Connection: close");
  client.println();
  client.print(postData);

  // Read response headers
  while (client.connected()) {
    String line = client.readStringUntil('\n');
    if (line == "\r") break;
  }

  // Read response body
  String response = "";
  while (client.available()) {
    response += client.readString();
  }
  
  Serial.println("📱 SMS sent successfully!");
  Serial.println("📋 Response received from Twilio");
  
  client.stop();
}

// === Utility Functions ===
void printSystemInfo() {
  Serial.println("=== FireWatch System Info ===");
  Serial.println("Device MAC: " + WiFi.macAddress());
  Serial.println("WiFi SSID: " + String(ssid));
  Serial.println("IP Address: " + WiFi.localIP().toString());
  Serial.println("Backend URL: " + String(serverName));
  Serial.println("Temperature Threshold: " + String(TEMP_THRESHOLD) + "°C");
  Serial.println("Smoke Threshold: " + String(SMOKE_THRESHOLD));
  Serial.println("SMS Cooldown: " + String(smsCooldown/1000) + " seconds");
  Serial.println("============================");
}
