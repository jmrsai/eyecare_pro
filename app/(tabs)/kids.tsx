import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Baby, Star, Heart, Gamepad2, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

export default function KidsTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B9D', '#C084FC']} style={styles.header}>
        <Text style={styles.headerTitle}>PediaVision Pals</Text>
        <Text style={styles.headerSubtitle}>Fun eye adventures for kids! 🌟</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeEmoji}>👋</Text>
          <Text style={styles.welcomeTitle}>Welcome to the Kids Zone!</Text>
          <Text style={styles.welcomeText}>
            A magical place where eye exercises become exciting adventures! 
            Perfect for children aged 4-12 years old.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.enterButton}
          onPress={() => router.push('/kids/index')}
        >
          <View style={styles.enterButtonContent}>
            <View style={styles.enterIcon}>
              <Sparkles size={32} color="#FFFFFF" />
            </View>
            <View style={styles.enterInfo}>
              <Text style={styles.enterTitle}>Enter Kids Zone</Text>
              <Text style={styles.enterSubtitle}>Start your eye adventure!</Text>
            </View>
            <Text style={styles.enterArrow}>🚀</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>What&apos;s Inside? 🎮</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🦋</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Jungle Explorer</Text>
              <Text style={styles.featureDescription}>
                Spot animals in Kambalakonda Sanctuary while training focus skills
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🚀</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Cosmic Racer</Text>
              <Text style={styles.featureDescription}>
                Follow spaceships through the stars to improve eye tracking
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🐸</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Lily Pad Leap</Text>
              <Text style={styles.featureDescription}>
                Help the frog jump across the pond with quick eye movements
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🦎</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Hungry Chameleon</Text>
              <Text style={styles.featureDescription}>
                Catch flying insects while practicing eye teamwork
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.therapySection}>
          <Text style={styles.sectionTitle}>Calm Corner 🧘</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🤗</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Magic Eye Hug</Text>
              <Text style={styles.featureDescription}>
                Soothing warm compress therapy with magical stories
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureEmoji}>🦉</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>Blinking Owl</Text>
              <Text style={styles.featureDescription}>
                Learn healthy blinking habits from Oliver the Wise Owl
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.safetyCard}>
          <Text style={styles.safetyTitle}>👨‍👩‍👧‍👦 For Parents</Text>
          <Text style={styles.safetyText}>
            • Daily playtime limit: 15 minutes maximum{'\n'}
            • Games designed by pediatric eye care professionals{'\n'}
            • Progress tracking and parental dashboard available{'\n'}
            • Safe, educational, and therapeutic content only
          </Text>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>🎯 Educational Benefits</Text>
          <Text style={styles.benefitsText}>
            ✨ Improves focus and concentration{'\n'}
            👀 Strengthens eye coordination{'\n'}
            🎮 Makes therapy fun and engaging{'\n'}
            📚 Supports reading readiness{'\n'}
            🏆 Builds confidence and achievement
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
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
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  enterButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  enterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  enterIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  enterInfo: {
    flex: 1,
  },
  enterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  enterSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  enterArrow: {
    fontSize: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  therapySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
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
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
    alignSelf: 'center',
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  safetyText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  benefitsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
});