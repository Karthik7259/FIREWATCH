# 🔥 FireWatch Arduino ESP32 Sensor Code

<div align="center">
  
  ## 📟 ESP32 Fire Detection System
  
  *Complete Arduino code for IoT fire detection hardware*
  
  ![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino&logoColor=white)
  ![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white)
  ![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)
  
</div>

---

## 🔧 Hardware Components

| Component | Pin | Description |
|-----------|-----|-------------|
| **DHT11** | Pin 4 | Temperature & Humidity Sensor |
| **MQ2** | Pin 34 (Analog) | Gas/Smoke Sensor |
| **Flame Sensor** | Pin 23 | Infrared Flame Detection |
| **LED** | Pin 22 | Visual Fire Alert Indicator |
| **Buzzer** | Pin 2 | Audio Fire Alert |
| **ESP32** | - | Main Microcontroller |

---

## 📦 Required Libraries

Install these libraries through Arduino IDE Library Manager:

```
- DHT sensor library by Adafruit
- ArduinoJson by Benoit Blanchon
- WiFiClientSecure (ESP32 built-in)
- Base64 by Densaugeo
- HTTPClient (ESP32 built-in)
- WebServer (ESP32 built-in)
```

## ⚙️ Configuration

### 📡 WiFi Settings
```cpp
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
```

### 🌐 Backend API
```cpp
const char* serverName = "https://firewatch-backend-2cri.onrender.com/sensor";
```

### 📱 Twilio SMS Settings
```cpp
const char* account_sid = "YOUR_TWILIO_ACCOUNT_SID";
const char* auth_token = "YOUR_TWILIO_AUTH_TOKEN";
const char* from_number = "+1234567890";  // Your Twilio number
const char* to_number = "+1234567890";    // Recipient number
```

---

## 🚨 Fire Detection Logic

### 🌡️ Temperature Alert
- **Threshold**: > 35°C
- **Action**: LED turns ON
- **Override**: Available via `/led/off`

### 💨 Smoke Alert
- **Threshold**: > 1280 (analog reading)
- **Action**: Buzzer turns ON
- **Override**: Available via `/buzzer/off`

### 🔥 Flame Detection
- **Type**: Digital (LOW = fire detected)
- **Action**: Immediate LED activation
- **Priority**: High priority alert

---

## 🌐 Web Server Endpoints

The ESP32 runs a web server on port 80 with the following endpoints:

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/status` | GET | Current sensor readings | JSON data |
| `/led/off` | GET | Turn off LED manually | `{"status":"led_off"}` |
| `/buzzer/off` | GET | Turn off buzzer manually | `{"status":"buzzer_off"}` |

### Example Usage:
```
http://192.168.1.100/status        # Get sensor data
http://192.168.1.100/led/off       # Turn off LED
http://192.168.1.100/buzzer/off    # Turn off buzzer
```

---

## 📊 Data Format

### Sensor Data Sent to Backend:
```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "smoke": 1150,
  "flame_detected": false,
  "fire_alert": false,
  "timestamp": 123456789
}
```

### Web Status Response:
```json
{
  "temperature": 25.5,
  "humidity": 60.2,
  "smoke": 1150,
  "flame_detected": false,
  "fire_alert": false
}
```

---

## 🔄 Operation Flow

1. **🔌 Startup**: ESP32 connects to WiFi and starts web server
2. **📊 Sensor Reading**: Reads DHT11, MQ2, and flame sensor every 2 seconds
3. **🚨 Fire Detection**: Analyzes sensor data for fire conditions
4. **💡 Local Alerts**: Controls LED and buzzer based on conditions
5. **📡 Data Transmission**: Sends data to Flask backend API
6. **📱 SMS Alerts**: Sends Twilio SMS if fire detected (15-second cooldown)
7. **🌐 Web Interface**: Provides status and manual control endpoints

---

## 🛠️ Installation Steps

### 1. **🔧 Hardware Setup**
- Connect sensors according to pin diagram
- Power ESP32 via USB or external supply
- Ensure proper grounding for all components

### 2. **📚 Library Installation**
```bash
# Open Arduino IDE
# Go to Sketch > Include Library > Manage Libraries
# Search and install each required library
```

### 3. **⚙️ Code Configuration**
- Open `FireWatch_Sensor.ino` in Arduino IDE
- Update WiFi credentials
- Configure Twilio settings
- Verify backend API URL

### 4. **📤 Upload Code**
- Select "ESP32 Dev Module" as board
- Choose correct COM port
- Upload the sketch

### 5. **🔍 Monitor Output**
```
🌡️ Temp: 25.50°C | 💧 Hum: 60.20% | 💨 Smoke: 1150 | 🔥 Flame: None | 🚨 Fire: Normal
✅ Data sent to backend successfully
📡 Response: {"status":"inserted","inserted_id":"..."}
```

---

## 🚨 Alert System Features

### 🔴 Visual Alerts
- **LED ON**: Fire detected (temperature > 35°C OR flame detected)
- **LED OFF**: Normal conditions
- **Manual Override**: Available via web endpoint

### 🔊 Audio Alerts
- **Buzzer ON**: High smoke levels (> 1280)
- **Buzzer OFF**: Normal smoke levels
- **Manual Override**: Available via web endpoint

### 📱 SMS Notifications
- **Trigger**: Fire detected OR high smoke
- **Cooldown**: 15 seconds between messages
- **Message Format**: "🚨 FIRE ALERT! Temp: XX°C, Smoke: XXXX"

---

## 🧪 Testing

### 🔧 Hardware Testing
```cpp
// Test individual sensors
float temp = dht.readTemperature();    // Should read room temperature
int smoke = analogRead(MQ2_PIN);       // Should read ~100-500 normally
bool flame = digitalRead(FLAME_PIN);   // Should be HIGH normally
```

### 🌐 Web Testing
```bash
# Test web endpoints
curl http://ESP32_IP_ADDRESS/status
curl http://ESP32_IP_ADDRESS/led/off
curl http://ESP32_IP_ADDRESS/buzzer/off
```

### 📡 Backend Testing
- Monitor Serial output for successful API calls
- Check Flask backend logs for received data
- Verify data appears in MongoDB

---

## 🐛 Troubleshooting

### ❌ Common Issues

#### **WiFi Connection Failed**
```
- Check SSID and password
- Ensure 2.4GHz network (ESP32 doesn't support 5GHz)
- Verify network allows new device connections
```

#### **Sensor Reading Errors**
```
- Check wiring connections
- Verify power supply (3.3V/5V as required)
- Test sensors individually
```

#### **Backend Connection Failed**
```
- Verify internet connectivity
- Check API endpoint URL
- Monitor serial output for HTTP error codes
```

#### **SMS Not Sending**
```
- Verify Twilio account credentials
- Check account balance
- Ensure phone numbers are in correct format (+1234567890)
```

---

## 📈 Performance Specifications

| Metric | Value |
|--------|-------|
| **Sensor Reading Frequency** | Every 2 seconds |
| **Backend Update Rate** | Every 2 seconds |
| **SMS Cooldown** | 15 seconds |
| **Web Server Response** | < 100ms |
| **WiFi Connection Time** | ~10-30 seconds |
| **Power Consumption** | ~150mA (active) |

---

## 🔒 Security Considerations

### ⚠️ Current Implementation
- **Unencrypted WiFi credentials** in code
- **Plain Twilio credentials** in code
- **No HTTPS certificate validation**

### 🛡️ Production Recommendations
- Store credentials in EEPROM or external config
- Use certificate pinning for HTTPS
- Implement OTA update capability
- Add device authentication tokens

---

## 🔄 Future Enhancements

### 📊 Potential Improvements
- **Battery backup** for power outages
- **Local data storage** on SD card
- **Multiple sensor support** for larger areas
- **Mesh networking** for multi-device setup
- **Advanced filtering** for false positive reduction

---

## 📞 Support

### 🆘 For Arduino-specific issues:
- **📧 Email**: arduino-support@firewatch.com
- **📖 Documentation**: [Main Project README](../README.md)
- **🔧 Hardware Issues**: Check wiring diagrams
- **💻 Code Issues**: Review serial monitor output

---

<div align="center">

**🔥 ESP32 Fire Detection System 🔥**

*Part of the FireWatch IoT Project*

**© 2025 FireWatch Team. All rights reserved.**

</div>
