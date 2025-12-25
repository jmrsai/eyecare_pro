import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Trophy, Play, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSound } from '../../contexts/SoundContext';

const { width, height } = Dimensions.get('window');

export default function CosmicRacerGame() {
  const { playSound } = useSound();
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [raceAnim] = useState(new Animated.Value(0));
  const [starAnim] = useState(new Animated.Value(0));
  const progressRef = useRef(0);

  useEffect(() => {
    if (gamePhase === 'playing') {
      startRace();
    }
  }, [gamePhase, level]);

  const startRace = () => {
    raceAnim.setValue(0);
    progressRef.current = 0;

    const listener = raceAnim.addListener(({ value }) => {
      progressRef.current = value;
    });

    // Speed increases with level: Level 1 = 4000ms, Level 2 = 3000ms, Level 3 = 2000ms
    const duration = Math.max(1500, 5000 - (level * 1000));

    // Create figure-8 animation
    const raceLoop = () => {
      Animated.timing(raceAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          const newLaps = lapsCompleted + 1;
          setLapsCompleted(newLaps);
          setScore(prev => prev + (level * 10));
          
          if (newLaps >= 5) {
            playSound('success');
            if (level < 3) {
              setLevel(prev => prev + 1);
              setLapsCompleted(0);
              // Small pause before next level
              setTimeout(raceLoop, 1000); 
            } else {
              completeGame();
            }
          } else {
            raceAnim.setValue(0);
            raceLoop(); // Continue racing
          }
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

    return () => {
        raceAnim.removeListener(listener);
        raceAnim.stopAnimation();
    };
  };

  const completeGame = async () => {
    playSound('levelUp');
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
    playSound('click');
    setGamePhase('playing');
    setScore(0);
    setLevel(1);
    setLapsCompleted(0);
  };

  const resetGame = () => {
    playSound('click');
    setGamePhase('intro');
    setScore(0);
    setLevel(1);
    setLapsCompleted(0);
  };

  // Interpolation for smooth animation
  const moveX = raceAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [width / 2 - 20, width - 60, width / 2 - 20, 20, width / 2 - 20]
  });

  const moveY = raceAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [height / 2 - 20, height / 2 + 80, height / 2 - 20, height / 2 - 120, height / 2 - 20]
  });

  const rotateZ = raceAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg']
  });

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
          <View style={styles.trophyContainer}>
            <Trophy size={80} color="#FFD700" />
            <Animated.View style={{position: 'absolute', opacity: starAnim}}>
                <Star size={40} color="#FFFFFF" style={{top: -20, right: -20}} />
            </Animated.View>
          </View>
          
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
              <RotateCcw size={24} color="#FFFFFF" />
              <Text style={styles.playAgainText}>Race Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
              <Text style={styles.doneText}>Back to Games</Text>
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
          <View style={styles.iconCircle}>
            <Text style={styles.introEmoji}>🌌</Text>
          </View>
          <Text style={styles.introTitle}>Welcome, Space Pilot!</Text>
          <Text style={styles.introText}>
            You&apos;re the captain of a super-fast spaceship! Your mission is to follow the cosmic race track 
            through the stars without moving your head. Use only your eyes to track the spaceship!
          </Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>🎯 Mission Briefing:</Text>
            <Text style={styles.instructionText}>
              • Keep your head perfectly still{'\n'}
              • Follow the spaceship with your eyes only{'\n'}
              • Complete 5 laps to advance to the next level{'\n'}
              • The spaceship gets faster each level!
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.startButtonText}>Launch Mission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0F172A', '#1E1B4B', '#312E81']} style={styles.gameHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>⭐ {score}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>🏁 Lvl {level}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>🔄 {lapsCompleted}/5</Text>
          </View>
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

        {/* Animated spaceship */}
        <Animated.View
          style={[
            styles.spaceship,
            {
              transform: [
                { translateX: moveX },
                { translateY: moveY },
                { rotate: rotateZ }
              ]
            }
          ]}
        >
          <View style={styles.spaceshipInner}>
            <Text style={styles.spaceshipEmoji}>🚀</Text>
          </View>
        </Animated.View>

        {/* Instruction bubble */}
        <View style={styles.instructionBubble}>
          <Text style={styles.instructionText}>
            🎯 Follow the spaceship with your eyes!
          </Text>
        </View>

        {/* Level progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Speed: {level === 1 ? 'Normal' : level === 2 ? 'Fast' : 'Hyper'}</Text>
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
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 10,
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
    justifyContent: 'flex-end',
    gap: 8,
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  introEmoji: {
    fontSize: 60,
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
    width: '100%',
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
    lineHeight: 22,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameArea: {
    flex: 1,
    position: 'absolute', // Make it fill screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  spaceship: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    // Center point logic handled in translation
    top: 0,
    left: 0,
  },
  spaceshipInner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#60A5FA',
  },
  spaceshipEmoji: {
    fontSize: 30,
  },
  instructionBubble: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 50,
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
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  trophyContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTitle: {
    fontSize: 28,
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
    width: '100%',
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});
