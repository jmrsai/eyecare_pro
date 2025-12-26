
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import appTheme from '../../styles/theme';
import { getFunctions, httpsCallable, HttpsCallableResult } from 'firebase/functions';

interface SymptomResult {
  condition: string;
  probability: number;
}

interface ChatResponse {
    results: SymptomResult[];
}

export default function AISymptomChecker() {
  const { COLORS, SIZES, FONTS, SHADOWS } = appTheme;
  const [symptoms, setSymptoms] = useState('');
  const [results, setResults] = useState<SymptomResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCheckSymptoms = async () => {
    if (symptoms.trim() === '') return;

    setLoading(true);
    setResults([]);
    const functions = getFunctions();
    const chat = httpsCallable< { message: string }, ChatResponse>(functions, 'chat');
    
    try {
      const response: HttpsCallableResult<ChatResponse> = await chat({ message: symptoms });
      if (response.data && response.data.results) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error("Firebase callable function error:", error);
      // You might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const renderResult = ({ item, index }: { item: SymptomResult, index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100, type: 'timing' }}
      style={styles.resultItem}
    >
      <Text style={styles.conditionText}>{item.condition}</Text>
      <Text style={styles.probabilityText}>{(item.probability * 100).toFixed(0)}% Probability</Text>
    </MotiView>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.padding },
    title: { ...FONTS.h1, color: COLORS.text, marginBottom: SIZES.padding },
    input: { 
        backgroundColor: COLORS.surface, 
        borderRadius: SIZES.radius, 
        padding: SIZES.padding, 
        ...FONTS.body, 
        color: COLORS.text, 
        marginBottom: SIZES.padding, 
        minHeight: 100, 
        textAlignVertical: 'top' 
    },
    button: { backgroundColor: COLORS.primary, padding: SIZES.padding, borderRadius: SIZES.radius, alignItems: 'center', ...SHADOWS.light },
    buttonText: { ...FONTS.h3, color: COLORS.surface },
    resultsContainer: { marginTop: SIZES.padding },
    resultItem: { backgroundColor: COLORS.surface, padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: SIZES.base, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    conditionText: { ...FONTS.body, flex: 1, color: COLORS.text, marginRight: SIZES.base },
    probabilityText: { ...FONTS.body, color: COLORS.primary, fontWeight: 'bold' as const },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Symptom Checker</Text>
      <TextInput
        style={styles.input}
        value={symptoms}
        onChangeText={setSymptoms}
        placeholder="Enter your symptoms (e.g., itchy eyes, blurred vision)..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
      />
      <Pressable style={styles.button} onPress={handleCheckSymptoms} disabled={loading}>
        {loading ? <ActivityIndicator color={COLORS.surface} /> : <Text style={styles.buttonText}>Check Symptoms</Text>}
      </Pressable>

      {results.length > 0 && (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={item => item.condition}
          style={styles.resultsContainer}
        />
      )}
    </View>
  );
}
