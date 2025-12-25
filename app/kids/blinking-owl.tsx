import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BlinkingOwlTherapy() {
  const [therapyPhase, setTherapyPhase] = useState<'intro' | 'therapy' | 'complete'>('intro');
  const [blinksCompleted, setBlinksCompleted] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
  const [owlBlinkAnim] = useState(new Animated.Value(1));
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (therapyPhase === 'therapy') {
      startTherapy();
    }
  }, [therapyPhase]);

  const startTherapy = () => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          completeTherapy();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start owl blinking pattern
    startOwlBlinking();
  };

  const startOwlBlinking = () => {
    const blinkPattern = () => {
      setIsBlinking(true);
      
      // Blink animation
      Animated.sequence([
        Animated.timing(owlBlinkAnim, {
          toValue: 0.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(owlBlinkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsBlinking(false);
        setBlinksCompleted(prev => prev + 1);
        
        // Wait 2 seconds before next blink
        setTimeout(() => {
          if (therapyPhase === 'therapy') {
            blinkPattern();
          }
        }, 2000);
      });
    };

    blinkPattern();
  };

  const completeTherapy = async () => {
    setTherapyPhase('complete');
    
    try {
      const stats = await AsyncStorage.getItem('kidsStats');
      const currentStats = stats ? JSON.parse(stats) : {};
      
      const updatedStats = {
        ...currentStats,
        totalStars: (currentStats.totalStars || 0) + 3,
        todayPlayTime: (currentStats.todayPlayTime || 0) + 2,
      };

      await AsyncStorage.setItem('kidsStats', JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error saving therapy stats:', error);
    }
  };

  const startTherapySession = () => {
    setTherapyPhase('therapy');
    setBlinksCompleted(0);
    setTimeRemaining(60);
  };

  const resetTherapy = () => {
    setTherapyPhase('intro');
    setBlinksCompleted(0);
    setTimeRemaining(60);
  };

  if (therapyPhase === 'complete') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Well Done! 🦉</Text>
        </LinearGradient>

        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🌟</Text>
          <Text style={styles.completeTitle}>Blinking Session Complete!</Text>
          <Text style={styles.completeText}>
            Fantastic! You completed {blinksCompleted} healthy blinks with Oliver the Owl! 
            Your eyes are now feeling fresh and moisturized! 💧
          </Text>
          
          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>🎯 What You Just Did:</Text>
            <Text style={styles.benefitsText}>
              ✨ Spread natural tears across your eyes{'\n'}
              💧 Washed away dust and irritants{'\n'}
              😌 Relaxed your eye muscles{'\n'}
              🛡️ Protected your eyes from dryness
            </Text>
          </View>

          <View style={styles.scoreCard}>
            <View style={styles.scoreItem}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.scoreNumber}>3</Text>
              <Text style={styles.scoreLabel}>Stars Earned</Text>
            </View>
            <View style={styles.scoreItem}>
              <Heart size={24} color="#FF69B4" />
              <Text style={styles.scoreNumber}>{blinksCompleted}</Text>
              <Text style={styles.scoreLabel}>Healthy Blinks</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={resetTherapy}>
              <Text style={styles.playAgainText}>🦉 Blink Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
              <Text style={styles.doneText}>🏠 Back to Calm Corner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (therapyPhase === 'intro') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blinking Owl 🦉</Text>
        </LinearGradient>

        <View style={styles.introContainer}>
          <Text style={styles.introEmoji}>🦉</Text>
          <Text style={styles.introTitle}>Meet Oliver the Wise Owl!</Text>
          <Text style={styles.introText}>
            Oliver wants to teach you the secret of healthy blinking! 
            When we look at screens too much, we forget to blink properly. 
            Let&apos;s learn from the wisest owl in the forest!
          </Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>🎯 How to Blink Like an Owl:</Text>
            <Text style={styles.instructionText}>
              • Watch Oliver blink slowly and gently{'\n'}
              • Copy his blinking pattern exactly{'\n'}
              • Close your eyes completely, then open slowly{'\n'}
              • Feel the moisture spreading across your eyes{'\n'}
              • Do this for 1 minute to refresh your eyes!
            </Text>
          </View>

          <View style={styles.benefitsPreview}>
            <Text style={styles.benefitsTitle}>🌟 Why Healthy Blinking Helps:</Text>
            <Text style={styles.benefitsText}>
              Blinking spreads natural tears across your eyes, keeping them moist and comfortable. 
              It&apos;s like giving your eyes a refreshing drink of water! 💧
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startTherapySession}>
            <Text style={styles.startButtonText}>🦉 Start Blinking Session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6D28D9', '#8B5CF6']} style={styles.therapyHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.therapyStats}>
          <Text style={styles.statText}>⏱️ {timeRemaining}s left</Text>
          <Text style={styles.statText}>👁️ {blinksCompleted} blinks</Text>
        </View>
      </LinearGradient>

      <View style={styles.therapyArea}>
        {/* Peaceful background */}
        <View style={styles.forestBackground}>
          <Text style={styles.backgroundEmoji}>🌙</Text>
          <Text style={styles.backgroundEmoji}>⭐</Text>
          <Text style={styles.backgroundEmoji}>🌲</Text>
          <Text style={styles.backgroundEmoji}>✨</Text>
        </View>

        {/* Oliver the Owl */}
        <View style={styles.owlContainer}>
          <Animated.View style={[styles.owlEyes, { opacity: owlBlinkAnim }]}>
            <Text style={styles.owlEmoji}>🦉</Text>
          </Animated.View>
          <Text style={styles.owlName}>Oliver</Text>
        </View>

        {/* Instruction bubble */}
        <View style={styles.instructionBubble}>
          <Text style={styles.instructionText}>
            {isBlinking 
              ? "💧 Close your eyes gently... hold... now open slowly!"
              : "👀 Watch me blink, then copy exactly what I do!"
            }
          </Text>
        </View>

        {/* Progress circle */}
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>{timeRemaining}</Text>
            <Text style={styles.progressLabel}>seconds</Text>
          </View>
        </View>

        {/* Breathing guide */}
        <View style={styles.breathingGuide}>
          <Text style={styles.breathingText}>
            🫁 Breathe slowly and deeply while blinking
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1B4B',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  therapyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  therapyStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  introEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#DDD6FE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#DDD6FE',
    lineHeight: 20,
  },
  benefitsPreview: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  benefitsText: {
    fontSize: 14,
    color: '#DDD6FE',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  therapyArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forestBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    opacity: 0.3,
  },
  backgroundEmoji: {
    fontSize: 30,
    margin: 20,
  },
  owlContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  owlEyes: {
    marginBottom: 10,
  },
  owlEmoji: {
    fontSize: 120,
  },
  owlName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  instructionBubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    color: '#DDD6FE',
  },
  breathingGuide: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
  },
  breathingText: {
    fontSize: 14,
    color: '#DDD6FE',
    textAlign: 'center',
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  completeEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  completeText: {
    fontSize: 16,
    color: '#DDD6FE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  benefitsCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#DDD6FE',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: '#6B7280',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});