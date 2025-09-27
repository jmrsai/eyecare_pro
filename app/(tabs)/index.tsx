import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, Palette, Target, Grid3X3, Zap, Clock, BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';

const diagnosticTests = [
  {
    id: 'visual-acuity',
    title: 'Visual Acuity Test',
    description: 'Test your vision sharpness using digital eye charts',
    icon: Eye,
    color: '#3B82F6',
    duration: '3-5 min',
    route: '/tests/visual-acuity',
  },
  {
    id: 'color-vision',
    title: 'Color Vision Test',
    description: 'Screen for color blindness with Ishihara plates',
    icon: Palette,
    color: '#10B981',
    duration: '2-3 min',
    route: '/tests/color-vision',
  },
  {
    id: 'astigmatism',
    title: 'Astigmatism Test',
    description: 'Check for astigmatism using clock dial patterns',
    icon: Target,
    color: '#F59E0B',
    duration: '2-4 min',
    route: '/tests/astigmatism',
  },
  {
    id: 'amsler-grid',
    title: 'Amsler Grid Test',
    description: 'Screen for macular degeneration and central vision issues',
    icon: Grid3X3,
    color: '#EF4444',
    duration: '1-2 min',
    route: '/tests/amsler-grid',
  },
  {
    id: 'contrast-sensitivity',
    title: 'Contrast Sensitivity',
    description: 'Measure your ability to distinguish contrast',
    icon: Zap,
    color: '#8B5CF6',
    duration: '3-5 min',
    route: '/tests/contrast-sensitivity',
  },
  {
    id: 'visual-field',
    title: 'Visual Field Test',
    description: 'Screen for peripheral vision and glaucoma risk',
    icon: Target,
    color: '#8B5CF6',
    duration: '5-7 min',
    route: '/tests/visual-field',
  },
  {
    id: 'pupil-response',
    title: 'Pupil Response Test',
    description: 'Experimental neurological screening (camera required)',
    icon: Eye,
    color: '#EF4444',
    duration: '2-3 min',
    route: '/tests/pupil-response',
  },
  {
    id: 'reading-speed',
    title: 'Reading Speed Test',
    description: 'Assess reading performance and visual processing',
    icon: BookOpen,
    color: '#0EA5E9',
    duration: '4-6 min',
    route: '/tests/reading-speed',
  },
];

export default function TestsScreen() {
  const handleTestPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>EyeCare Pro</Text>
        <Text style={styles.headerSubtitle}>Comprehensive Eye Health Screening</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Medical Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            These tests are for screening purposes only and are NOT a substitute for professional medical examination. 
            Always consult with a qualified eye care professional for comprehensive eye examinations and medical advice.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Tests</Text>
        
        {diagnosticTests.map((test) => {
          const IconComponent = test.icon;
          return (
            <TouchableOpacity
              key={test.id}
              style={styles.testCard}
              onPress={() => handleTestPress(test.route)}
              activeOpacity={0.7}
            >
              <View style={styles.testCardContent}>
                <View style={[styles.iconContainer, { backgroundColor: `${test.color}15` }]}>
                  <IconComponent size={24} color={test.color} />
                </View>
                <View style={styles.testInfo}>
                  <Text style={styles.testTitle}>{test.title}</Text>
                  <Text style={styles.testDescription}>{test.description}</Text>
                  <View style={styles.testMeta}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.testDuration}>{test.duration}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.quickTipsCard}>
          <Text style={styles.quickTipsTitle}>💡 Quick Tips</Text>
          <Text style={styles.quickTipsText}>
            • Ensure good lighting when taking tests{'\n'}
            • Hold your device at arm's length{'\n'}
            • Take breaks between tests{'\n'}
            • Test each eye separately when instructed
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
    color: '#BFDBFE',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  disclaimerCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  testCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testCardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  testDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  testMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  quickTipsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  quickTipsText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
});