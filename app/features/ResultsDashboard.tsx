
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { generatePdfReport } from '../../utils/pdfGenerator';
import { mockResults } from '../../data/mockResults'; // Using mock data for now

export default function ResultsDashboard() {

  const handleShareReport = () => {
    generatePdfReport(mockResults);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Results Dashboard</Text>

      <View style={styles.resultsCard}>
        <Text style={styles.cardTitle}>Amsler Grid</Text>
        <Text>Distortions Recorded: {mockResults.amslerGrid.distortions.length}</Text>
      </View>

      <View style={styles.resultsCard}>
        <Text style={styles.cardTitle}>Contrast Sensitivity</Text>
        <Text>Score: {mockResults.contrastSensitivity.score}</Text>
      </View>

      <View style={styles.resultsCard}>
        <Text style={styles.cardTitle}>Saccadic Training</Text>
        <Text>Accuracy: {mockResults.saccadicTraining.accuracy}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleShareReport}>
        <Text style={styles.buttonText}>Share Report</Text>
      </TouchableOpacity>
    </ScrollView>
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
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
