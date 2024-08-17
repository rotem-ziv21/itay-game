import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [playerPosition, setPlayerPosition] = useState(new Animated.Value(height - 150));
  const [obstaclePosition, setObstaclePosition] = useState(new Animated.Value(width));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const gravity = Animated.timing(playerPosition, {
        toValue: height - 150,
        duration: 1000,
        useNativeDriver: false,
      });
      
      gravity.start();

      const obstacleAnimation = Animated.timing(obstaclePosition, {
        toValue: -100,
        duration: 2000,
        useNativeDriver: false,
      });

      const moveObstacle = () => {
        obstaclePosition.setValue(width);
        obstacleAnimation.start(({ finished }) => {
          if (finished) {
            setScore((prevScore) => prevScore + 1);
            moveObstacle();
          }
        });
      };

      moveObstacle();

      const scoreInterval = setInterval(() => {
        setScore((prevScore) => prevScore + 1);
      }, 1000);

      return () => {
        gravity.stop();
        obstacleAnimation.stop();
        clearInterval(scoreInterval);
      };
    }
  }, [gameOver]);

  useEffect(() => {
    const checkCollision = () => {
      const playerY = playerPosition.__getValue();
      const obstacleX = obstaclePosition.__getValue();

      if (
        obstacleX < 100 && obstacleX > 0 &&
        playerY > height - 200
      ) {
        setGameOver(true);
      }
    };

    const collisionInterval = setInterval(checkCollision, 100);
    return () => clearInterval(collisionInterval);
  }, []);

  const handleJump = () => {
    if (!gameOver) {
      Animated.sequence([
        Animated.timing(playerPosition, {
          toValue: height - 300,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(playerPosition, {
          toValue: height - 150,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const restartGame = () => {
    setPlayerPosition(new Animated.Value(height - 150));
    setObstaclePosition(new Animated.Value(width));
    setScore(0);
    setGameOver(false);
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
    >
      <Text style={styles.score}>Score: {score}</Text>
      <Animated.View
        style={[
          styles.player,
          { bottom: playerPosition },
        ]}
      >
        <Ionicons name="rocket" size={50} color="#00ffff" />
      </Animated.View>
      <Animated.View
        style={[
          styles.obstacle,
          { left: obstaclePosition },
        ]}
      >
        <Ionicons name="planet" size={50} color="#ff00ff" />
      </Animated.View>
      <TouchableOpacity style={styles.jumpButton} onPress={handleJump}>
        <Text style={styles.jumpButtonText}>Boost</Text>
      </TouchableOpacity>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text style={styles.restartButtonText}>Restart Mission</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  player: {
    position: 'absolute',
    left: 50,
  },
  obstacle: {
    position: 'absolute',
    bottom: 0,
  },
  score: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  jumpButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(0, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#00ffff',
  },
  jumpButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  gameOverText: {
    fontSize: 48,
    color: '#ff00ff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: 'rgba(255, 0, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ff00ff',
  },
  restartButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
