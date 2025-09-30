import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Star, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Animal {
  id: string;
  emoji: string;
  name: string;
  isNear: boolean;
  position: { x: number; y: number };
  scale: number;
}

const ANIMALS = [
  { emoji: '🦋', name: 'Butterfly', near: true, far: false },
  { emoji: '🐒', name: 'Monkey', near: false, far: true },
  { emoji: '🦜', name: 'Parrot', near: true, far: false },
  { emoji: '🐅', name: 'Tiger', near: false, far: true },
  { emoji: '🦎', name: 'Lizard', near: true, far: false },
  { emoji: '🐘', name: 'Elephant', near: false, far: true },
];

export default function JungleExplorerGame() {
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [animalsFound, setAnimalsFound] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.5));

  useEffect(() => {
    if (gamePhase === 'playing' && !currentAnimal) {
      showNextAnimal();
    }
  }, [gamePhase, currentAnimal]);

  const showNextAnimal = () => {
    if (animalsFound >= 6) {
      completeGame();
      return;
    }

    const animalData = ANIMALS[animalsFound];
    const isNear = Math.random() > 0.5;
    
    const newAnimal: Animal = {
      id: Date.now().toString(),
      emoji: animalData.emoji,
      name: animalData.name,
      isNear,
      position: {
        x: Math.random() * (width - 100) + 50,
        y: Math.random() * (height * 0.4) + height * 0.3,
      },
      scale: isNear ? 1.5 : 0.8,
    };

    setCurrentAnimal(newAnimal);
    
    // Animate animal appearance
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: newAnimal.scale,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (currentAnimal?.id === newAnimal.id) {
        handleAnimalSpotted();
      }
    }, 3000);
  };

  const handleAnimalSpotted = () => {
    if (!currentAnimal) return;

    const points = currentAnimal.isNear ? 10 : 15; // Far animals are worth more
    setScore(prev => prev + points);
    setAnimalsFound(prev => prev + 1);
    
    // Animate animal disappearing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentAnimal(null);
    });
  };

  const completeGame = async () => {
    setGamePhase('complete');
    
    try {
      // Save game stats
      const stats = await AsyncStorage.getItem('kidsStats');
      const currentStats = stats ? JSON.parse(stats) : {};
      
      const updatedStats = {
        ...currentStats,
        totalStars: (currentStats.totalStars || 0) + Math.floor(score / 10),
        gamesPlayed: (currentStats.gamesPlayed || 0) + 1,
        todayPlayTime: (currentStats.todayPlayTime || 0) + 5,
      };

      await AsyncStorage.setItem('kidsStats', JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error saving game stats:', error);
    }
  };

  const startGame = () => {
    setGamePhase('playing');
    setScore(0);
    setAnimalsFound(0);
    setCurrentAnimal(null);
  };

  const resetGame = () => {
    setGamePhase('intro');
    setScore(0);
    setAnimalsFound(0);
    setCurrentAnimal(null);
  };

  if (gamePhase === 'complete') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Amazing Explorer! 🎉</Text>
        </LinearGradient>

        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🏆</Text>
          <Text style={styles.completeTitle}>Jungle Mission Complete!</Text>
          <Text style={styles.completeText}>
            Wow! You found all {animalsFound} animals in Kambalakonda Sanctuary!
            Your eyes are getting stronger every day!
          </Text>
          
          <View style={styles.scoreCard}>
            <View style={styles.scoreItem}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.scoreNumber}>{Math.floor(score / 10)}</Text>
              <Text style={styles.scoreLabel}>Stars Earned</Text>
            </View>
            <View style={styles.scoreItem}>
              <Trophy size={24} color="#FF6B9D" />
              <Text style={styles.scoreNumber}>{score}</Text>
              <Text style={styles.scoreLabel}>Total Points</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.playAgainButton} onPress={resetGame}>
              <Text style={styles.playAgainText}>🎮 Play Again</Text>
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
        <LinearGradient colors={['#10B981', '#059669']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jungle Explorer 🦋</Text>
        </LinearGradient>

        <View style={styles.introContainer}>
          <Text style={styles.introEmoji}>🌿</Text>
          <Text style={styles.introTitle}>Welcome to Kambalakonda!</Text>
          <Text style={styles.introText}>
            You're a brave jungle explorer! Your mission is to spot all the amazing animals 
            hiding in our beautiful sanctuary near Visakhapatnam.
          </Text>
          
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>🎯 How to Play:</Text>
            <Text style={styles.instructionText}>
              • Look carefully at each animal that appears{'\n'}
              • Some animals are close (BIG), others are far (small){'\n'}
              • Tap when you see them clearly{'\n'}
              • Find all 6 animals to complete your mission!
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>🚀 Start Adventure</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#10B981', '#059669']} style={styles.gameHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.gameStats}>
          <Text style={styles.statText}>🌟 {score} points</Text>
          <Text style={styles.statText}>🔍 {animalsFound}/6 found</Text>
        </View>
      </LinearGradient>

      <View style={styles.gameArea}>
        <View style={styles.jungleBackground}>
          <Text style={styles.backgroundEmoji}>🌳</Text>
          <Text style={styles.backgroundEmoji}>🌿</Text>
          <Text style={styles.backgroundEmoji}>🍃</Text>
          <Text style={styles.backgroundEmoji}>🌺</Text>
        </View>

        {currentAnimal && (
          <TouchableOpacity
            style={[
              styles.animalContainer,
              {
                left: currentAnimal.position.x,
                top: currentAnimal.position.y,
              }
            ]}
            onPress={handleAnimalSpotted}
            activeOpacity={0.8}
          >
            <Animated.Text
              style={[
                styles.animalEmoji,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }
              ]}
            >
              {currentAnimal.emoji}
            </Animated.Text>
          </TouchableOpacity>
        )}

        <View style={styles.instructionBubble}>
          <Text style={styles.instructionText}>
            {currentAnimal?.isNear 
              ? `🔍 Look! A ${currentAnimal.name} right in front of you!`
              : `👀 Quick! Spot the ${currentAnimal?.name} way over there!`
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
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
    color: '#065F46',
    marginBottom: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
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
  jungleBackground: {
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
    fontSize: 40,
    margin: 20,
  },
  animalContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalEmoji: {
    fontSize: 60,
  },
  instructionBubble: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#065F46',
    marginBottom: 16,
    textAlign: 'center',
  },
  completeText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  scoreCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
    marginTop: 8,
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: '#10B981',
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