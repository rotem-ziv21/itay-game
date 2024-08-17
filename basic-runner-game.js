import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [playerPosition, setPlayerPosition] = useState(height - 100);
  const [obstaclePosition, setObstaclePosition] = useState(width);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setObstaclePosition((prevPosition) => {
          if (prevPosition < -50) {
            setScore((prevScore) => prevScore + 1);
            return width;
          }
          return prevPosition - 5;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [gameOver]);

  useEffect(() => {
    if (
      obstaclePosition < 50 &&
      obstaclePosition > 0 &&
      playerPosition > height - 150
    ) {
      setGameOver(true);
    }
  }, [playerPosition, obstaclePosition]);

  const jump = () => {
    if (!gameOver) {
      setPlayerPosition(height - 150);
      setTimeout(() => setPlayerPosition(height - 100), 300);
    }
  };

  const restartGame = () => {
    setPlayerPosition(height - 100);
    setObstaclePosition(width);
    setScore(0);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={[styles.player, { bottom: playerPosition }]} />
      <View style={[styles.obstacle, { left: obstaclePosition }]} />
      <TouchableOpacity style={styles.jumpButton} onPress={jump}>
        <Text>Jump</Text>
      </TouchableOpacity>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
            <Text>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  player: {
    position: 'absolute',
    left: 50,
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
  obstacle: {
    position: 'absolute',
    bottom: 0,
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
  score: {
    position: 'absolute',
    top: 40,
    left: 20,
    fontSize: 24,
  },
  jumpButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'green',
    padding: 10,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gameOverText: {
    fontSize: 48,
    color: 'white',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: 'green',
    padding: 10,
  },
});
