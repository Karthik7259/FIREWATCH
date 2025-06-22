import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const OverviewScreen = () => {
  const [sensorData, setSensorData] = useState<{
    temperature: number;
    smoke: number;
    flame_detected: boolean;
    humidity: number;
    fire_alert: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  // Array of background images
  const backgroundImages = [
    require('../../assets/images/overview-1.jpg'),
    require('../../assets/images/overview-2.jpg'),
    
  ]
 const fetchData = () => {
    fetch('http://firewatch-backend-2cri.onrender.com/data')
      .then((response) => response.json())
      .then((data) => {
        const updatedData = {
          temperature: data.temperature || 25,
          smoke: data.smoke || 8,
          flame_detected: data.flame_detected || false,
          fire_alert: data.fire_alert || false,
          humidity: data.humidity || 45,
        };
        setSensorData(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching sensor data:', error);
        setSensorData({
          temperature: 25,
          smoke: 8,
          flame_detected: false,
          humidity: 45,
          fire_alert: false,
        });        setLoading(false);
      });
  };
  
  
  useEffect(() => {
    fetchData();
    const dataInterval = setInterval(fetchData, 5000);
    
    // Background image cycling every 5 seconds with fade effect
    const imageInterval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Change image
        setCurrentImageIndex((prevIndex) => 
          prevIndex === 0 ? 1 : 0
        );
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(imageInterval);
    };
  }, [fadeAnim]);

  const getOverallStatus = () => {
    if (!sensorData) return { status: 'Loading...', color: '#95A5A6', emoji: '⏳' };
    
    const { temperature, smoke, flame_detected, fire_alert } = sensorData;
    
    if (fire_alert || flame_detected) {
      return { status: 'FIRE ALERT', color: '#E74C3C', emoji: '🚨' };
    }
    if (temperature > 40 || smoke > 2000) {
      return { status: 'HIGH RISK', color: '#F39C12', emoji: '⚠️' };
    }
    if (temperature > 35 || smoke > 1200) {
      return { status: 'MODERATE RISK', color: '#F39C12', emoji: '⚠️' };
    }
    return { status: 'SAFE', color: '#27AE60', emoji: '✅' };
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
      return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim }]}>
          <ImageBackground
            source={backgroundImages[currentImageIndex]}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading system status...</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const status = getOverallStatus();  const temperature = sensorData?.temperature ?? 25;
  const humidity = sensorData?.humidity ?? 45;
  const smoke = sensorData?.smoke ?? 8;
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.backgroundContainer, { opacity: fadeAnim }]}>
        <ImageBackground
          source={backgroundImages[currentImageIndex]}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.content}            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>📍 Building A - Floor 3</Text>
            </View>
            <Text style={styles.timeText}>{getCurrentTime()}</Text>
          </View>

          {/* Main Status Display */}
          <View style={styles.mainStatusContainer}>
            <Text style={styles.statusEmoji}>{status.emoji}</Text>
            <Text style={[styles.mainStatusText, { color: status.color }]}>
              {status.status}
            </Text>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
            <Text style={styles.lastUpdateText}>Last updated: {getCurrentTime()}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStatsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🌡️</Text>
              <Text style={styles.statValue}>{temperature}°</Text>
              <Text style={styles.statLabel}>Temperature</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💧</Text>
              <Text style={styles.statValue}>{humidity}%</Text>
              <Text style={styles.statLabel}>Humidity</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💨</Text>
              <Text style={styles.statValue}>{smoke}</Text>
              <Text style={styles.statLabel}>Smoke PPM</Text>
            </View>
          </View>

          {/* Status Cards */}
          <View style={styles.statusCardsContainer}>
            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <Text style={styles.statusCardIcon}>🔍</Text>
                <Text style={styles.statusCardTitle}>Sensors</Text>
              </View>
              <Text style={styles.statusCardValue}>3 Active</Text>
              <Text style={styles.statusCardSubtext}>All sensors online</Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusCardHeader}>
                <Text style={styles.statusCardIcon}>🛡️</Text>
                <Text style={styles.statusCardTitle}>Protection</Text>
              </View>
              <Text style={[styles.statusCardValue, { color: status.color }]}>
                {status.status === 'SAFE' ? 'Active' : 'Alert'}
              </Text>
              <Text style={styles.statusCardSubtext}>{status.status === 'SAFE' ? 'System monitoring' : 'Check required'}</Text>
            </View>
          </View>

          {/* System Info */}
          <View style={styles.systemInfo}>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoIcon}>🔄</Text>
              <Text style={styles.systemInfoText}>Auto-refresh: 2s</Text>
            </View>
            <View style={styles.systemInfoRow}>
              <Text style={styles.systemInfoIcon}>📡</Text>              <Text style={styles.systemInfoText}>Connection: Online</Text>
            </View>
          </View>
        </ScrollView>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',    paddingTop: 100, // Increased for better positioning with safe area
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60, // Increased significantly for better header visibility
    paddingBottom: 120, // Increased bottom padding for tab bar space
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  locationContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  mainStatusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  mainStatusText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  dateText: {
    fontSize: 18,
    color: '#E0E0E0',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#B0B0B0',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#D0D0D0',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCardIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statusCardSubtext: {
    fontSize: 12,
    color: '#D0D0D0',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  systemInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  systemInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  systemInfoIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  systemInfoText: {
    fontSize: 14,
    color: '#E0E0E0',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default OverviewScreen;
