import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const symptomsData = [
  { id: 'blurry_vision', name: 'Blurry Vision' },
  { id: 'eye_pain', name: 'Eye Pain' },
  { id: 'itchy_eyes', name: 'Itchy Eyes' },
  { id: 'dry_eyes', name: 'Dry Eyes' },
  { id: 'watery_eyes', name: 'Watery Eyes' },
  { id: 'redness', name: 'Redness' },
  { id: 'light_flashes', name: 'Flashes of Light' },
  { id: 'floaters', name: 'Floaters' },
  { id: 'double_vision', name: 'Double Vision' },
  { id: 'light_sensitivity', name: 'Light Sensitivity' },
  { id: 'halos', name: 'Halos Around Lights' },
  { id: 'headaches', name: 'Headaches' },
];

const conditions = {
  dry_eye_syndrome: ['dry_eyes', 'itchy_eyes', 'redness', 'blurry_vision'],
  conjunctivitis: ['redness', 'itchy_eyes', 'watery_eyes'],
  cataracts: ['blurry_vision', 'halos', 'light_sensitivity'],
  glaucoma: ['blurry_vision', 'halos', 'eye_pain', 'headaches'],
  macular_degeneration: ['blurry_vision', 'floaters'],
  retinal_detachment: ['light_flashes', 'floaters', 'blurry_vision'],
};

const SymptomCheckerScreen = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No Symptoms Selected', 'Please select at least one symptom to analyze.');
      return;
    }

    const scoredConditions = Object.entries(conditions)
      .map(([condition, conditionSymptoms]) => {
        const matchedSymptoms = selectedSymptoms.filter(symptom =>
          conditionSymptoms.includes(symptom)
        );
        return {
          name: condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          score: matchedSymptoms.length,
        };
      })
      .filter(condition => condition.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scoredConditions.length === 0) {
        const message = 'No matching conditions found based on the selected symptoms. For an accurate diagnosis, please consult an ophthalmologist.';
        Alert.alert('Analysis Results', message);
        return;
    }

    const message = `Possible conditions:\n\n• ${scoredConditions.map(c => c.name).join('\n• ')}\n\nDisclaimer: This is not a medical diagnosis. Consult an eye care professional for accurate advice.`;
    Alert.alert('Analysis Results', message);
  };


  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Symptom Checker</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.subtitle}>Select Your Symptoms</Text>
          <View style={styles.symptomsGrid}>
            {symptomsData.map(symptom => (
              <TouchableOpacity
                key={symptom.id}
                style={[
                  styles.symptomChip,
                  selectedSymptoms.includes(symptom.id) && styles.selectedSymptomChip,
                ]}
                onPress={() => toggleSymptom(symptom.id)}
              >
                <Text
                  style={[
                    styles.symptomText,
                    selectedSymptoms.includes(symptom.id) && styles.selectedSymptomText,
                  ]}
                >
                  {symptom.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.analyzeButton} onPress={analyzeSymptoms}>
            <Text style={styles.analyzeButtonText}>Analyze Symptoms</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  symptomChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 8,
  },
  selectedSymptomChip: {
    backgroundColor: '#38bdf8',
  },
  symptomText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedSymptomText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  analyzeButton: {
    backgroundColor: '#38bdf8',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SymptomCheckerScreen;