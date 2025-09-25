import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Calendar, Eye, AlertCircle, Download } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TestResult {
  id: string;
  testType: string;
  date: string;
  score: number;
  status: 'normal' | 'attention' | 'concern';
  details: string;
}

export default function ResultsScreen() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [overallScore, setOverallScore] = useState(85);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const storedResults = await AsyncStorage.getItem('testResults');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      } else {
        // Sample data for demonstration
        const sampleResults: TestResult[] = [
          {
            id: '1',
            testType: 'Visual Acuity',
            date: '2025-01-15',
            score: 90,
            status: 'normal',
            details: '20/20 vision in both eyes',
          },
          {
            id: '2',
            testType: 'Color Vision',
            date: '2025-01-14',
            score: 95,
            status: 'normal',
            details: 'No color vision deficiency detected',
          },
          {
            id: '3',
            testType: 'Astigmatism',
            date: '2025-01-13',
            score: 75,
            status: 'attention',
            details: 'Mild astigmatism detected in left eye',
          },
        ];
        setResults(sampleResults);
        await AsyncStorage.setItem('testResults', JSON.stringify(sampleResults));
      }
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10B981';
      case 'attention':
        return '#F59E0B';
      case 'concern':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Normal';
      case 'attention':
        return 'Needs Attention';
      case 'concern':
        return 'Concerning';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Your Results</Text>
        <Text style={styles.headerSubtitle}>Track your eye health progress</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Health Score */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Overall Eye Health Score</Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Download size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
          <View style={styles.scoreContent}>
            <Text style={styles.scoreNumber}>{overallScore}</Text>
            <Text style={styles.scoreOutOf}>/100</Text>
          </View>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreProgress, { width: `${overallScore}%` }]} />
          </View>
          <Text style={styles.scoreDescription}>
            Good overall eye health. Continue regular monitoring.
          </Text>
        </View>

        {/* Recent Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Test Results</Text>
          
          {results.length === 0 ? (
            <View style={styles.emptyState}>
              <Eye size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No test results yet</Text>
              <Text style={styles.emptyStateText}>
                Complete your first eye test to see results here
              </Text>
            </View>
          ) : (
            results.map((result) => (
              <TouchableOpacity key={result.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle}>{result.testType}</Text>
                    <View style={styles.resultMeta}>
                      <Calendar size={14} color="#6B7280" />
                      <Text style={styles.resultDate}>{formatDate(result.date)}</Text>
                    </View>
                  </View>
                  <View style={styles.resultScore}>
                    <Text style={styles.scoreValue}>{result.score}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(result.status)}15` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(result.status) }]}>
                        {getStatusText(result.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.resultDetails}>{result.details}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <AlertCircle size={20} color="#3B82F6" />
            <Text style={styles.recommendationsTitle}>Recommendations</Text>
          </View>
          <Text style={styles.recommendationsText}>
            • Schedule a comprehensive eye exam with an eye care professional{'\n'}
            • Continue regular eye health monitoring{'\n'}
            • Follow up on astigmatism findings{'\n'}
            • Maintain good eye hygiene and screen time habits
          </Text>
        </View>

        {/* Trends */}
        <View style={styles.trendsCard}>
          <View style={styles.trendsHeader}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.trendsTitle}>Health Trends</Text>
          </View>
          <Text style={styles.trendsText}>
            Your eye health has remained stable over the past month. 
            Continue regular testing to monitor any changes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#A7F3D0',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scoreCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  downloadButton: {
    padding: 8,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#10B981',
  },
  scoreOutOf: {
    fontSize: 24,
    color: '#6B7280',
    marginLeft: 4,
  },
  scoreBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  resultScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  recommendationsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginLeft: 8,
  },
  recommendationsText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  trendsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  trendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  trendsText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
});