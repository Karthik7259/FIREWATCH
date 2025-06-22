import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SensorDisplay = () => {
  const [sensorData, setSensorData] = useState<{
    temperature: number;
    smoke: number;
    flame_detected: boolean;
    humidity: number;
    fire_alert: boolean;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [showFireAlert, setShowFireAlert] = useState(false);
  const [buzzerStatus, setBuzzerStatus] = useState(false);
  const [ledStatus, setLedStatus] = useState(false);

  const fetchData = () => {
    fetch('http://firewatch-backend-2cri.onrender.com/data')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = {
          temperature: data.temperature || 0,
          smoke: data.smoke || 0,
          flame_detected: data.flame_detected || false,
          fire_alert: data.fire_alert || false,
          humidity: data.humidity || 45,
        };
        setSensorData(updatedData);
        setShowFireAlert(updatedData.fire_alert);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sensor data:', error);
        setSensorData({
          temperature: 0,
          smoke: 0,
          flame_detected: false,
          humidity: 45,
          fire_alert: false,
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const getTemperatureColor = (temp: number) => {
    if (temp < 15) return '#4A90E2';
    if (temp < 25) return '#50C878';
    if (temp < 35) return '#FFA500';
    return '#FF6B6B';
  };

  const getSmokeColor = (smoke: number) => {
    if (smoke < 10) return '#50C878';
    if (smoke < 30) return '#FFA500';
    return '#FF6B6B';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity < 30) return '#FF6B6B';
    if (humidity < 40) return '#FFA500';
    if (humidity < 60) return '#50C878';
    if (humidity < 70) return '#FFA500';
    return '#FF6B6B';
  };

  const getFlameColor = (hasFlame: boolean) => {
    return hasFlame ? '#FF4444' : '#50C878';
  };

  // Control functions for buzzer and LED
  const handleBuzzerControl = async (turnOn: boolean) => {
    try {
      const response = await fetch('http://192.168.1.106/buzzer/off', {
        method: 'GET',
      });
      
      if (response.ok) {
        setBuzzerStatus(false);
        console.log('Buzzer turned OFF');
      }
    } catch (error) {
      console.error('Error controlling buzzer:', error);
    }
  };

  const handleLEDControl = async (turnOn: boolean) => {
    try {
      const response = await fetch('http://192.168.1.106/led/off', {
        method: 'GET',
      });
      
      if (response.ok) {
        setLedStatus(false);
        console.log('LED turned OFF');
      }
    } catch (error) {
      console.error('Error controlling LED:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading sensor data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const temperature = sensorData?.temperature ?? 0;
  const smoke = sensorData?.smoke ?? 0;
  const flame = sensorData?.flame_detected ?? false;
  const humidity = sensorData?.humidity ?? 45;
  const fireAlert = sensorData?.fire_alert ?? false;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <View style={styles.header}>
        <Text style={styles.title}>FireWatch</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsContainer}>
          {/* Temperature Card */}
          <View style={[styles.card, styles.temperatureCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🌡️</Text>
              <Text style={styles.cardTitle}>Temperature</Text>
            </View>
            <Text style={[styles.mainValue, { color: getTemperatureColor(temperature) }]}>
              {temperature}°C
            </Text>
            <Text style={styles.cardSubtext}>
              {temperature < 15 ? 'Cold' :
               temperature < 25 ? 'Normal' :
               temperature < 35 ? 'Warm' : 'Hot'}
            </Text>
          </View>

          {/* Humidity Card */}
          <View style={[styles.card, styles.humidityCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💧</Text>
              <Text style={styles.cardTitle}>Humidity</Text>
            </View>
            <Text style={[styles.mainValue, { color: getHumidityColor(humidity) }]}>
              {humidity}%
            </Text>
            <Text style={styles.cardSubtext}>
              {humidity < 30 ? 'Too Dry' :
               humidity < 40 ? 'Low' :
               humidity < 60 ? 'Optimal' :
               humidity < 70 ? 'High' : 'Too Humid'}
            </Text>
          </View>

          {/* Smoke Card */}
          <View style={[styles.card, styles.smokeCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>💨</Text>
              <Text style={styles.cardTitle}>Smoke Level</Text>
            </View>
            <Text style={[styles.mainValue, { color: getSmokeColor(smoke) }]}>
              {smoke} ppm
            </Text>
            <Text style={styles.cardSubtext}>
              {smoke < 1200 ? 'Safe' :
               smoke < 1800 ? 'Moderate' : 'Dangerous'}
            </Text>
          </View>

          {/* Flame Card */}
          <View style={[styles.card, styles.flameCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🔥</Text>
              <Text style={styles.cardTitle}>Flame Detection</Text>
            </View>
            <Text style={[styles.mainValue, { color: getFlameColor(flame) }]}>
              {flame ? 'DETECTED' : 'SAFE'}
            </Text>
            <Text style={styles.cardSubtext}>
              {flame ? 'Fire detected!' : 'No flame detected'}
            </Text>
          </View>
        </View>

        {/* Status Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>System Status</Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: (fireAlert || flame || smoke > 30) ? '#FF6B6B' : '#50C878' }
            ]} />
            <Text style={styles.statusText}>
              {(fireAlert || flame || smoke > 2000 || temperature>40) ? 'Alert: Check sensors' : 'All systems normal'}
            </Text>
          </View>
        </View>

        {/* Control Panel */}
        <View style={styles.controlPanel}>
          <Text style={styles.controlPanelTitle}>Device Controls</Text>
          
          {/* Buzzer Control */}
          <View style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlIcon}>🔊</Text>
              <Text style={styles.controlTitle}>Buzzer Control</Text>
            </View>
            <TouchableOpacity 
              style={[styles.controlButton, styles.buttonOff]}
              onPress={() => handleBuzzerControl(false)}
            >
              <Text style={styles.buttonText}>Turn OFF</Text>
            </TouchableOpacity>
          </View>

          {/* LED Control */}
          <View style={styles.controlCard}>
            <View style={styles.controlHeader}>
              <Text style={styles.controlIcon}>💡</Text>
              <Text style={styles.controlTitle}>LED Control</Text>
            </View>
            <TouchableOpacity 
              style={[styles.controlButton, styles.buttonOff]}
              onPress={() => handleLEDControl(false)}
            >
              <Text style={styles.buttonText}>Turn OFF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fire Alert Modal */}
      <Modal visible={showFireAlert} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>🚨</Text>
              <Text style={styles.alertTitle}>FIRE ALERT!</Text>
            </View>
            <Text style={styles.alertMessage}>
              Emergency fire condition detected!{'\n'}
              Please evacuate immediately and contact emergency services.
            </Text>
            <View style={styles.alertDetails}>
              <Text style={styles.alertDetailText}>• Temperature: {temperature}°C</Text>
              <Text style={styles.alertDetailText}>• Smoke Level: {smoke} ppm</Text>
              <Text style={styles.alertDetailText}>• Flame: {flame ? 'DETECTED' : 'Not detected'}</Text>
            </View>
            <TouchableOpacity style={styles.alertButton} onPress={() => setShowFireAlert(false)}>
              <Text style={styles.alertButtonText}>ACKNOWLEDGE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 20, // Increased padding for better header visibility
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80, // Increased for better positioning
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Added significant bottom padding for tab bar space
  },
  header: {
    alignItems: 'center',
    paddingTop: 20, // Increased header padding
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  cardsContainer: {
    gap: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
  },
  temperatureCard: { borderLeftColor: '#4A90E2' },
  humidityCard: { borderLeftColor: '#3498DB' },
  smokeCard: { borderLeftColor: '#9B59B6' },
  flameCard: { borderLeftColor: '#E67E22' },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  mainValue: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2C3E50',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#34495E',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertModal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: width * 0.85,
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIcon: {
    fontSize: 30,
    marginRight: 10,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E74C3C',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2C3E50',
    marginBottom: 16,
  },
  alertDetails: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  alertDetailText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  alertButton: {
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Control Panel Styles
  controlPanel: {
    marginTop: 20,
  },
  controlPanelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
    textAlign: 'center',
  },
  controlCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3498DB',
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  controlIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  controlTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonOn: {
    backgroundColor: '#27AE60',
  },
  buttonOff: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default SensorDisplay;
