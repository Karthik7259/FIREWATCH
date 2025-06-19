// import { StyleSheet, View, Dimensions, ScrollView, Text } from 'react-native';
// import { useEffect, useState } from 'react';
// import { LineChart, BarChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// // Enhanced chart configuration
// const chartConfig = {
//   backgroundGradientFrom: '#fff',
//   backgroundGradientTo: '#fff',
//   decimalPlaces: 1,
//   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   fillShadowGradient: '#FF6B35',
//   fillShadowGradientOpacity: 0.2,
//   strokeWidth: 2,
//   barPercentage: 0.6,
//   useShadowColorFromDataset: false,
//   style: {
//     borderRadius: 16,
//   },
//   propsForDots: {
//     r: '5',
//     strokeWidth: '2',
//     stroke: '#FF6B35',
//     fill: '#fff',
//   },
//   propsForBackgroundLines: {
//     strokeWidth: 0.5,
//     strokeDasharray: [5, 5],
//   },
// };

// const sensorData = [
//   { timestamp: 597552, temperature: 29.6, humidity: 58, smoke: 1180 },
//   { timestamp: 597555, temperature: 30.1, humidity: 56, smoke: 1250 },
//   { timestamp: 597558, temperature: 31.5, humidity: 54, smoke: 1420 },
//   { timestamp: 597561, temperature: 32.8, humidity: 50, smoke: 1850 },
//   { timestamp: 597564, temperature: 28.9, humidity: 62, smoke: 950 },
// ];

// export default function ExploreScreen() {
//   const [chartsLoaded, setChartsLoaded] = useState(false);

//   useEffect(() => {
//     setChartsLoaded(true);
//   }, []);

//   const renderTemperatureChart = () => {
//     const data = {
//       labels: sensorData.map(d =>
//         new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       ),
//       datasets: [
//         {
//           data: sensorData.map(d => d.temperature),
//           color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
//           strokeWidth: 3,
//         },
//       ],
//     };

//     return (
//       <LineChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         chartConfig={{
//           ...chartConfig,
//           fillShadowGradient: '#FF6B35',
//           fillShadowGradientOpacity: 0.1,
//         }}
//         bezier
//         style={styles.chartStyle}
//         withHorizontalLabels={true}
//         withVerticalLabels={true}
//         segments={5}
//         withInnerLines={true}
//         withOuterLines={true}
//       />
//     );
//   };

//   const renderSmokeChart = () => {
//     const data = {
//       labels: sensorData.map(d =>
//         new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       ),
//       datasets: [
//         {
//           data: sensorData.map(d => d.smoke),
//         },
//       ],
//     };

//     return (
//       <BarChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         chartConfig={{
//           ...chartConfig,
//           color: (opacity = 1, index) => {
//             if (index === undefined || !sensorData[index]) {
//               return `rgba(0, 0, 0, ${opacity})`; // fallback color to avoid error
//             }
//             const smokeValue = sensorData[index].smoke;
//             return smokeValue > 1500
//               ? `rgba(255, 0, 0, ${opacity})`
//               : smokeValue > 1200
//               ? `rgba(255, 165, 0, ${opacity})`
//               : `rgba(0, 200, 0, ${opacity})`;
//           },
//         }}
//         style={styles.chartStyle}
//         fromZero
//         showBarTops={false}
//         withHorizontalLabels={true}
//         withVerticalLabels={true}
//         yAxisLabel=""
//         yAxisSuffix="ppm"
//       />
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {chartsLoaded && (
//         <View style={styles.chartContainer}>
//           <View style={styles.chartTitleContainer}>
//             <Text style={styles.chartTitle}>Temperature Trend (°C)</Text>
//           </View>
//           {renderTemperatureChart()}
//         </View>
//       )}

//       {chartsLoaded && (
//         <View style={styles.chartContainer}>
//           <View style={styles.chartTitleContainer}>
//             <Text style={styles.chartTitle}>Smoke Levels (ppm)</Text>
//           </View>
//           {renderSmokeChart()}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   chartContainer: {
//     marginVertical: 16,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   chartStyle: {
//     borderRadius: 16,
//     marginTop: 10,
//   },
//   chartTitleContainer: {
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     marginBottom: 12,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
// });

//    ->   2 

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
// import { LineChart, BarChart } from 'react-native-chart-kit';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const screenWidth = Dimensions.get('window').width;

// // Enhanced chart configuration with more customization options
// const chartConfig = {
//   backgroundGradientFrom: '#fff',
//   backgroundGradientTo: '#fff',
//   decimalPlaces: 1,
//   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   fillShadowGradient: '#FF6B35',
//   fillShadowGradientOpacity: 0.2,
//   strokeWidth: 2,
//   barPercentage: 0.6,
//   useShadowColorFromDataset: false,
//   style: {
//     borderRadius: 16,
//   },
//   propsForDots: {
//     r: '5',
//     strokeWidth: '2',
//     stroke: '#FF6B35',
//     fill: '#fff',
//   },
//   propsForBackgroundLines: {
//     strokeWidth: 0.5,
//     strokeDasharray: [5, 5],
//   },
// };

// // Sample sensor data with more data points
// const sensorData = [
//   { timestamp: 597552, temperature: 29.6, humidity: 58, smoke: 1180 },
//   { timestamp: 597555, temperature: 30.1, humidity: 56, smoke: 1250 },
//   { timestamp: 597558, temperature: 31.5, humidity: 54, smoke: 1420 },
//   { timestamp: 597561, temperature: 32.8, humidity: 50, smoke: 1850 },
//   { timestamp: 597564, temperature: 28.9, humidity: 62, smoke: 950 },
//   { timestamp: 597567, temperature: 29.3, humidity: 59, smoke: 1020 },
//   { timestamp: 597570, temperature: 30.7, humidity: 53, smoke: 1360 },
// ];

// export default function ExploreScreen() {
//   const [chartsLoaded, setChartsLoaded] = useState(false);
//   const [selectedTimeRange, setSelectedTimeRange] = useState('all');
//   const [showHumidity, setShowHumidity] = useState(false);

//   useEffect(() => {
//     setChartsLoaded(true);
//   }, []);

//   // Filter data based on selected time range
//   const getFilteredData = () => {
//     const now = Date.now() / 1000;
//     const oneHourAgo = now - 3600;
//     const threeHoursAgo = now - 10800;
//     const twelveHoursAgo = now - 43200;

//     switch (selectedTimeRange) {
//       case '1h':
//         return sensorData.filter(d => d.timestamp >= oneHourAgo);
//       case '3h':
//         return sensorData.filter(d => d.timestamp >= threeHoursAgo);
//       case '12h':
//         return sensorData.filter(d => d.timestamp >= twelveHoursAgo);
//       default:
//         return sensorData;
//     }
//   };

//   const renderTemperatureChart = () => {
//     const filteredData = getFilteredData();

//     const data = {
//       labels: filteredData.map(d =>
//         new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       ),
//       datasets: [
//         {
//           data: filteredData.map(d => d.temperature),
//           color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
//           strokeWidth: 3,
//         },
//       ],
//     };

//     // Add humidity dataset if enabled
//     if (showHumidity) {
//       data.datasets.push({
//         data: filteredData.map(d => d.humidity),
//         color: (opacity = 1) => `rgba(53, 107, 255, ${opacity})`,
//         strokeWidth: 3,
//       });
//     }

//     return (
//       <LineChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         chartConfig={{
//           ...chartConfig,
//           fillShadowGradient: '#FF6B35',
//           fillShadowGradientOpacity: 0.1,
//         }}
//         bezier
//         style={styles.chartStyle}
//         withHorizontalLabels={true}
//         withVerticalLabels={true}
//         segments={5}
//         withInnerLines={true}
//         withOuterLines={true}
//       />
//     );
//   };

//   const renderSmokeChart = () => {
//     const filteredData = getFilteredData();

//     const data = {
//       labels: filteredData.map(d =>
//         new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       ),
//       datasets: [
//         {
//           data: filteredData.map(d => d.smoke),
//         },
//       ],
//     };

//     return (
//       <BarChart
//         data={data}
//         width={screenWidth - 32}
//         height={250}
//         chartConfig={{
//           ...chartConfig,
//           color: (opacity = 1, index) => {
//             if (index === undefined || !filteredData[index]) {
//               return `rgba(0, 0, 0, ${opacity})`;
//             }
//             const smokeValue = filteredData[index].smoke;
//             return smokeValue > 1500
//               ? `rgba(255, 0, 0, ${opacity})`
//               : smokeValue > 1200
//               ? `rgba(255, 165, 0, ${opacity})`
//               : `rgba(0, 200, 0, ${opacity})`;
//           },
//         }}
//         style={styles.chartStyle}
//         fromZero
//         showBarTops={false}
//         withHorizontalLabels={true}
//         withVerticalLabels={true}
//         yAxisLabel=""
//         yAxisSuffix="ppm"
//       />
//     );
//   };

//   const renderTimeRangeButtons = () => {
//     const ranges = [
//       { id: '1h', label: '1H' },
//       { id: '3h', label: '3H' },
//       { id: '12h', label: '12H' },
//       { id: 'all', label: 'ALL' },
//     ];

//     return (
//       <View style={styles.timeRangeContainer}>
//         {ranges.map(range => (
//           <TouchableOpacity
//             key={range.id}
//             style={[
//               styles.timeRangeButton,
//               selectedTimeRange === range.id && styles.selectedTimeRangeButton,
//             ]}
//             onPress={() => setSelectedTimeRange(range.id)}
//           >
//             <Text style={[
//               styles.timeRangeButtonText,
//               selectedTimeRange === range.id && styles.selectedTimeRangeButtonText,
//             ]}>
//               {range.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.headerTitle}>Environment Dashboard</Text>
//         <Text style={styles.headerSubtitle}>Real-time sensor data visualization</Text>
//       </View>

//       {renderTimeRangeButtons()}

//       {chartsLoaded && (
//         <View style={styles.chartContainer}>
//           <View style={styles.chartHeader}>
//             <Text style={styles.chartTitle}>Temperature Trend (°C)</Text>
//             <TouchableOpacity
//               style={styles.toggleButton}
//               onPress={() => setShowHumidity(!showHumidity)}
//             >
//               <Icon
//                 name={showHumidity ? 'check-box' : 'check-box-outline-blank'}
//                 size={20}
//                 color="#FF6B35"
//               />
//               <Text style={styles.toggleButtonText}>Humidity</Text>
//             </TouchableOpacity>
//           </View>
//           {renderTemperatureChart()}
//           <View style={styles.chartFooter}>
//             <Text style={styles.chartFooterText}>
//               {showHumidity ? 'Showing temperature and humidity' : 'Showing temperature only'}
//             </Text>
//           </View>
//         </View>
//       )}

//       {chartsLoaded && (
//         <View style={styles.chartContainer}>
//           <View style={styles.chartTitleContainer}>
//             <Text style={styles.chartTitle}>Smoke Levels (ppm)</Text>
//             <View style={styles.smokeLegend}>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 200, 0, 0.8)' }]} />
//                 <Text style={styles.legendText}>Normal</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 165, 0, 0.8)' }]} />
//                 <Text style={styles.legendText}>Warning</Text>
//               </View>
//               <View style={styles.legendItem}>
//                 <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.8)' }]} />
//                 <Text style={styles.legendText}>Danger</Text>
//               </View>
//             </View>
//           </View>
//           {renderSmokeChart()}
//           <View style={styles.chartFooter}>
//             <Text style={styles.chartFooterText}>
//   Smoke levels: Normal (&lt;1200ppm), Warning (1200-1500ppm), Danger (&gt;1500ppm)
// </Text>

//           </View>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//     paddingBottom: 32,
//   },
//   headerContainer: {
//     marginBottom: 24,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   timeRangeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   timeRangeButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     backgroundColor: '#eee',
//   },
//   selectedTimeRangeButton: {
//     backgroundColor: '#FF6B35',
//   },
//   timeRangeButtonText: {
//     color: '#666',
//     fontWeight: '600',
//   },
//   selectedTimeRangeButtonText: {
//     color: '#fff',
//   },
//   chartContainer: {
//     marginVertical: 8,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   chartHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     marginBottom: 12,
//   },
//   chartTitleContainer: {
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     marginBottom: 12,
//   },
//   chartTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   toggleButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   toggleButtonText: {
//     marginLeft: 4,
//     color: '#FF6B35',
//     fontSize: 14,
//   },
//   chartStyle: {
//     borderRadius: 16,
//     marginTop: 10,
//   },
//   chartFooter: {
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   chartFooterText: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//   },
//   smokeLegend: {
//     flexDirection: 'row',
//     marginTop: 8,
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   legendColor: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     marginRight: 4,
//   },
//   legendText: {
//     fontSize: 12,
//     color: '#666',
//   },
// });



import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, ScrollView, Text, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  fillShadowGradient: '#FF6B35',
  fillShadowGradientOpacity: 0.2,
  strokeWidth: 2,
  barPercentage: 0.6,
  useShadowColorFromDataset: false,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#FF6B35',
    fill: '#fff',
  },
  propsForBackgroundLines: {
    strokeWidth: 0.5,
    strokeDasharray: [5, 5],
  },
};

export default function ExploreScreen() {
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  const [showHumidity, setShowHumidity] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from MongoDB
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.84.167:8080/recent/6'); // Fetch last 20 records
      const json = await response.json();
      if (json.status === 'success') {
        // Transform data to match our expected format
        const transformedData = json.data.map(item => ({
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
      setError(err.message);
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
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={250}
        chartConfig={{
          ...chartConfig,
          fillShadowGradient: '#FF6B35',
          fillShadowGradientOpacity: 0.1,
        }}
        bezier
        style={styles.chartStyle}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        segments={5}
        withInnerLines={true}
        withOuterLines={true}
      />
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
        width={screenWidth - 32}
        height={250}
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
        fromZero
        showBarTops={false}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        yAxisLabel=""
        yAxisSuffix="ppm"
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
      <View style={styles.loadingContainer}>
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    paddingBottom: 32,
  },
  headerContainer: {
    marginBottom: 24,
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
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  selectedTimeRangeButton: {
    backgroundColor: '#FF6B35',
  },
  timeRangeButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  selectedTimeRangeButtonText: {
    color: '#fff',
  },
  chartContainer: {
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    fontSize: 18,
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
    fontSize: 14,
  },
  chartStyle: {
    borderRadius: 16,
    marginTop: 10,
  },
  chartFooter: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  chartFooterText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  smokeLegend: {
    flexDirection: 'row',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
  },
  noDataContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
  },
});