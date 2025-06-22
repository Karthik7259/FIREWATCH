import React, { useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

interface SensorData {
  timestamp: number;
  temperature: number;
  humidity: number;
  smoke: number;
}

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  fillShadowGradient: '#FF6B35',
  fillShadowGradientOpacity: 0.2,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#FF6B35',
    fill: '#fff',
  },
  propsForBackgroundLines: {
    strokeWidth: 0.5,
    strokeDasharray: [5, 5],
  },
  propsForVerticalLabels: {
    fontSize: 10,
  },
  propsForHorizontalLabels: {
    fontSize: 10,
  },
};

export default function ExploreScreen() {
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [showHumidity, setShowHumidity] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: '', label: '' });

  // Fetch data from MongoDB
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.104:8080/recent/4'); // Fetch last 20 records
      const json = await response.json();
      if (json.status === 'success') {
        // Transform data to match our expected format
        const transformedData = json.data.map((item: any) => ({
          timestamp: item.timestamp,
          temperature: item.temperature,
          humidity: item.humidity,
          smoke: item.smoke
        }));
        setSensorData(transformedData.reverse()); // Reverse to show newest last
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setChartsLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up polling for real-time updates (every 5 seconds)
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const getFilteredData = () => {
    if (sensorData.length === 0) return [];
    
    const now = Date.now() / 1000;
    const oneHourAgo = now - 3600;
    const threeHoursAgo = now - 10800;
    const twelveHoursAgo = now - 43200;

    switch (selectedTimeRange) {
      case '1h':
        return sensorData.filter(d => d.timestamp >= oneHourAgo);
      case '3h':
        return sensorData.filter(d => d.timestamp >= threeHoursAgo);
      case '12h':
        return sensorData.filter(d => d.timestamp >= twelveHoursAgo);
      default:
        return sensorData;
    }
  };

  const renderTemperatureChart = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return renderNoData();

    const data = {
      labels: filteredData.map(d =>
        new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      ),
      datasets: [
        {
          data: filteredData.map(d => d.temperature),
          color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };

    if (showHumidity) {
      data.datasets.push({
        data: filteredData.map(d => d.humidity),
        color: (opacity = 1) => `rgba(53, 107, 255, ${opacity})`,
        strokeWidth: 3,
      });
    }

    return (
      <View>
        <LineChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={{
            ...chartConfig,
            fillShadowGradient: '#FF6B35',
            fillShadowGradientOpacity: 0.1,
          }}
          bezier
          style={styles.chartStyle}
          withHorizontalLabels={true}
          withVerticalLabels={true}
          segments={4}
          withInnerLines={true}
          withOuterLines={true}
          onDataPointClick={(data) => {
            const index = data.index;
            const value = `${filteredData[index].temperature}°C`;
            const label = 'Temperature';
            
            setTooltipPos({
              x: data.x,
              y: data.y - 40,
              visible: true,
              value: value,
              label: label
            });
            
            // Hide tooltip after 3 seconds
            setTimeout(() => {
              setTooltipPos(prev => ({ ...prev, visible: false }));
            }, 3000);
          }}
        />
        {tooltipPos.visible && (
          <View style={[styles.tooltip, { left: tooltipPos.x - 40, top: tooltipPos.y }]}>
            <Text style={styles.tooltipText}>{tooltipPos.label}</Text>
            <Text style={styles.tooltipValue}>{tooltipPos.value}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSmokeChart = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return renderNoData();

    const data = {
      labels: filteredData.map(d =>
        new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      ),
      datasets: [
        {
          data: filteredData.map(d => d.smoke),
        },
      ],
    };

    return (
      <BarChart
        data={data}
        width={screenWidth - 64}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1, index) => {
            if (index === undefined || !filteredData[index]) {
              return `rgba(0, 0, 0, ${opacity})`;
            }
            const smokeValue = filteredData[index].smoke;
            return smokeValue > 1500
              ? `rgba(255, 0, 0, ${opacity})`
              : smokeValue > 1200
              ? `rgba(255, 165, 0, ${opacity})`
              : `rgba(0, 200, 0, ${opacity})`;
          },
        }}
        style={styles.chartStyle}
        fromZero={false}
        showBarTops={true}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        yAxisLabel=""
        yAxisSuffix=" ppm"
        segments={4}
      />
    );
  };

  const renderNoData = () => (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataText}>No data available for selected time range</Text>
    </View>
  );

  const renderTimeRangeButtons = () => {
    const ranges = [
      { id: '1h', label: '1H' },
      { id: '3h', label: '3H' },
      { id: '12h', label: '12H' },
      { id: 'all', label: 'ALL' },
    ];

    return (
      <View style={styles.timeRangeContainer}>
        {ranges.map(range => (
          <TouchableOpacity
            key={range.id}
            style={[
              styles.timeRangeButton,
              selectedTimeRange === range.id && styles.selectedTimeRangeButton,
            ]}
            onPress={() => setSelectedTimeRange(range.id)}
          >
            <Text style={[
              styles.timeRangeButtonText,
              selectedTimeRange === range.id && styles.selectedTimeRangeButtonText,
            ]}>
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <View style={styles.loadingContainer}>
          <Text>Loading data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f8f8" />
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Environment Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time sensor data visualization</Text>
      </View>

      {renderTimeRangeButtons()}

      {chartsLoaded && (
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Temperature Trend (°C)</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowHumidity(!showHumidity)}
            >
              <Icon
                name={showHumidity ? 'check-box' : 'check-box-outline-blank'}
                size={20}
                color="#FF6B35"
              />
              <Text style={styles.toggleButtonText}>Humidity</Text>
            </TouchableOpacity>
          </View>
          {renderTemperatureChart()}
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>
              {showHumidity ? 'Showing temperature and humidity' : 'Showing temperature only'}
            </Text>
          </View>
        </View>
      )}

      {chartsLoaded && (
        <View style={styles.chartContainer}>
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>Smoke Levels (ppm)</Text>
            <View style={styles.smokeLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 200, 0, 0.8)' }]} />
                <Text style={styles.legendText}>Normal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]} />
                <Text style={styles.legendText}>Warning</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.8)' }]} />
                <Text style={styles.legendText}>Danger</Text>
              </View>
            </View>
          </View>
          {renderSmokeChart()}
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>
              Smoke levels: Normal (&lt;1200ppm), Warning (1200-1500ppm), Danger (&gt;1500ppm)
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20, // Add extra padding for better visibility
  },
  container: {
    padding: 12,
    backgroundColor: '#f8f8f8',
    paddingBottom: 32,
    paddingTop: 10, // Reduced since we have SafeAreaView padding
  },
  headerContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
    minWidth: 50,
    alignItems: 'center',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#FF6B35',
  },
  timeRangeButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 12,
  },
  selectedTimeRangeButtonText: {
    color: '#fff',
  },
  chartContainer: {
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  chartTitleContainer: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButtonText: {
    marginLeft: 4,
    color: '#FF6B35',
    fontSize: 12,
  },
  chartStyle: {
    borderRadius: 16,
    marginTop: 10,
    alignSelf: 'center',
  },
  chartFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chartFooterText: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  smokeLegend: {
    flexDirection: 'row',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 4,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    paddingTop: 50,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  noDataText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  tooltipValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
});