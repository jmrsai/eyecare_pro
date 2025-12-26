
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TrendAnalysis() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trend Analysis</Text>
      {/* Placeholder for trend charts */}
      <Text>Your vision trends over time will be visualized here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
