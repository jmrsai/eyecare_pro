import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function CosmicRacerGame() {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [raceAnim] = useState(new Animated.Value(0));
  const [starAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (gamePhase === 'playing') {
      startRace();
    }
  }, [gamePhase, level]);

  const startRace = () => {
    raceAnim.setValue(0);
    
    // Create figure-8 animation
    const raceLoop = () => {
      Animated.timing(raceAnim, {
        toValue: 1,
        duration: 4000 - (level * 200), // Gets faster each level
        useNativeDriver: true,
      }).start(() => {
        const newLaps = lapsCompleted + 1;
        setLapsCompleted(newLaps);
        setScore(prev => prev + (level * 10));
        
        if (newLaps >= 5) {
          if (level < 3) {
            setLevel(prev => prev + 1);
            setLapsCompleted(0);
            raceLoop(); // Continue to next level
          } else {
            completeGame();
          }
        } else {
          raceAnim.setValue(0);
          raceLoop(); // Continue racing
        }
      });
    };

    raceLoop();
    
    // Animate stars
    Animated.loop(
      Animated.sequence([
        Animated.timing(starAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(starAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const completeGame = async () => {
    setGamePhase('complete');
    
    try {
      const stats = await AsyncStorage.getItem('kidsStats');
      const currentStats = stats ? JSON.parse(stats) : {};
      
      const updatedStats = {
        ...currentStats,
        totalStars: (currentStats.totalStars || 0) + Math.floor(score / 10),
        gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
        todayPlayTime: (currentStats.todayPlayTime || 0) + 6,
      };

      await AsyncStorage.setItem('kidsStats', JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    setLevel(1);
    setLapsCompleted(0);
  };

  const resetGame = () => {
    setGamePhase('intro');
    setScore(0);
    setLevel(1);
    setLapsCompleted(0);
  };

  // Calculate spaceship position along figure-8 path
  const getSpaceshipPosition = () => {
    const progress = raceAnim._value;
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width * 0.3;
    const radiusY = height * 0.15;
    
    // Figure-8 parametric equations
    const t = progress * Math.PI * 4; // Complete figure-8
    const x = centerX + (radiusX * Math.sin(t)) / (1 + Math.cos(t) * Math.cos(t));
    const y = centerY + (radiusY * Math.sin(t) * Math.cos(t)) / (1 + Math.cos(t) * Math.cos(t));
    
    return { x, y };
  };

  if (gamePhase === 'complete') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1E40AF', '#3730A3']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cosmic Champion! 🚀</Text>
        </LinearGradient>

        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🏆</Text>
          <Text style={styles.completeTitle}>Mission Accomplished!</Text>
          <Text style={styles.completeText}>
            Amazing piloting skills! You completed all 3 levels and 15 laps through the cosmic race track!
            Your eye tracking is getting super strong! 💪
          </Text>
          
          <View style={styles.scoreCard}>
            <View style={styles.scoreItem}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.scoreNumber}>{Math.floor(score / 10)}</Text>
              <Text style={styles.scoreLabel}>Stars Earned</Text>
            </View>
            <View style={styles.scoreItem}>
              <Trophy size={24} color="#3B82F6" />
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreLabel}>Total Points</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
              <Text style={styles.playAgainText}>🚀 Race Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
              <Text style={styles.doneText}>🏠 Back to Games</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (gamePhase === 'intro') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1E40AF', '#3730A3']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cosmic Racer 🚀</Text>
        </LinearGradient>

        <View style={styles.introContainer}>
          <Text style={styles.introEmoji}>🌌</Text>
          <Text style={styles.introTitle}>Welcome, Space Pilot!</Text>
          <Text style={styles.introText}>
            You're the captain of a super-fast spaceship! Your mission is to follow the cosmic race track 
            through the stars without moving your head. Use only your eyes to track the spaceship!
          </Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>🎯 Mission Briefing:</Text>
            <Text style={styles.instructionText}>
              • Keep your head perfectly still{'\n'}
              • Follow the spaceship with your eyes only{'\n'}
              • Complete 5 laps to advance to the next level{'\n'}
              • The spaceship gets faster each level!{'\n'}
              • Complete all 3 levels to become a Cosmic Champion!
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>🚀 Launch Mission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const spaceshipPos = getSpaceshipPosition();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1E1B4B', '#312E81']} style={styles.gameHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <Text style={styles.statText}>⭐ {score} points</Text>
          <Text style={styles.statText}>🏁 Level {level}</Text>
          <Text style={styles.statText}>🔄 {lapsCompleted}/5 laps</Text>
        </View>
      </LinearGradient>

      <View style={styles.gameArea}>
        {/* Animated stars background */}
        <Animated.View style={[styles.starsContainer, { opacity: starAnim }]}>
          <Text style={[styles.star, { top: '10%', left: '20%' }]}>⭐</Text>
          <Text style={[styles.star, { top: '30%', right: '15%' }]}>✨</Text>
          <Text style={[styles.star, { top: '60%', left: '10%' }]}>🌟</Text>
          <Text style={[styles.star, { top: '80%', right: '25%' }]}>⭐</Text>
          <Text style={[styles.star, { top: '20%', left: '70%' }]}>✨</Text>
          <Text style={[styles.star, { top: '70%', right: '60%' }]}>🌟</Text>
        </Animated.View>

        {/* Race track outline (figure-8) */}
        <View style={styles.trackContainer}>
          <View style={styles.trackOutline} />
        </View>

        {/* Animated spaceship */}
        <Animated.View
          style={[
            styles.spaceship,
            {
              left: spaceshipPos.x - 20,
              top: spaceshipPos.y - 20,
            }
          ]}
        >
          <Text style={styles.spaceshipEmoji}>🚀</Text>
        </Animated.View>

        {/* Instruction bubble */}
        <View style={styles.instructionBubble}>
          <Text style={styles.instructionText}>
            🎯 Follow the spaceship with your eyes! Keep your head still and track smoothly.
          </Text>
        </View>

        {/* Level progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Level {level} - Speed: {level === 1 ? 'Slow' : level === 2 ? 'Medium' : 'Fast'}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(lapsCompleted / 5) * 100}%` }]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  gameHeader: {
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
  gameStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statText: {
    fontSize: 12,
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
    color: '#C7D2FE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
    color: '#C7D2FE',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#3B82F6',
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
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    fontSize: 20,
  },
  trackContainer: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '30%',
  },
  trackOutline: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 100,
    borderStyle: 'dashed',
  },
  spaceship: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceshipEmoji: {
    fontSize: 32,
  },
  instructionBubble: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 20,
    padding: 16,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
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
    color: '#C7D2FE',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
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
    color: '#C7D2FE',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#3B82F6',
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