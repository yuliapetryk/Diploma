import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface BreathingExerciseProps {
  title: string;
  description: string;
  inhale_duration: number;
  hold_duration: number;
  exhale_duration: number;
  cycles: number;
}

const BreathingExerciseCard: React.FC<BreathingExerciseProps> = ({
  title,
  description,
  inhale_duration,
  hold_duration,
  exhale_duration,
  cycles
}) => {
  const [phase, setPhase] = useState('Inhale');
  const [cycleCount, setCycleCount] = useState(1);
  const scale = new Animated.Value(1);

  useEffect(() => {
    const totalDuration = inhale_duration + hold_duration + exhale_duration;

    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.5,
          duration: inhale_duration * 1000,
          useNativeDriver: true,
        }),
        Animated.delay(hold_duration * 1000),
        Animated.timing(scale, {
          toValue: 1,
          duration: exhale_duration * 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (cycleCount < cycles) {
          setCycleCount((prev) => prev + 1);
          loopAnimation();
        }
      });
    };

    loopAnimation();
  }, [cycleCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) =>
        prev === 'Inhale' ? 'Hold' : prev === 'Hold' ? 'Exhale' : 'Inhale'
      );
    }, inhale_duration * 1000);
    return () => clearInterval(interval);
  }, [inhale_duration, hold_duration, exhale_duration]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />

      <Text style={styles.phase}>{phase}</Text>
      <Text style={styles.counter}>Cycle {cycleCount} of {cycles}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#798bd0',
    marginBottom: 15,
  },
  phase: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  counter: {
    fontSize: 14,
    color: '#888',
  },
});

export default BreathingExerciseCard;
