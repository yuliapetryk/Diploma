import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface BreathingExerciseProps {
  title: string;
  description: string;
  inhale_duration: number;
  hold_duration: number;
  exhale_duration: number;
  cycles: number;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({
  title,
  description,
  inhale_duration,
  hold_duration,
  exhale_duration,
  cycles,
}) => {
  const [running, setRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const size = useState(new Animated.Value(100))[0];

  const startExercise = () => {
    if (!running) {
      setRunning(true);
      setCycleCount(0);
      setPhase('inhale');
    }
  };

  const stopExercise = () => {
    setRunning(false);
    setCycleCount(0);
    size.setValue(100);
  };

  const animateShape = (newPhase: 'inhale' | 'hold' | 'exhale') => {
    if (!running) return;

    let newSize = 100;
    if (newPhase === 'inhale') newSize = 150;
    if (newPhase === 'exhale') newSize = 80;

    Animated.timing(size, {
      toValue: newSize,
      duration: newPhase === 'hold' ? hold_duration * 1000 : inhale_duration * 1000,
      useNativeDriver: false,
    }).start(() => {
      if (!running) return;

      if (newPhase === 'inhale') {
        setPhase('hold');
        setTimeout(() => {
          animateShape('exhale');
          setPhase('exhale');
        }, hold_duration * 1000);
      } else if (newPhase === 'exhale') {
        setCycleCount((prev) => {
          const nextCycle = prev + 1;
          if (nextCycle >= cycles) {
            stopExercise();
          } else {
            setPhase('inhale');
            animateShape('inhale');
          }
          return nextCycle;
        });
      }
    });
  };

  useEffect(() => {
    if (running && phase === 'inhale') {
      animateShape('inhale');
    }
  }, [running]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Animated.View
        style={[
          styles.shape,
          {
            width: size,
            height: size,
            backgroundColor: phase === 'inhale' ? '#798bd0' : phase === 'hold' ? '#555' : '#b7f5e3',
          },
        ]}
      />

      <Text style={styles.phaseText}>{`Phase: ${phase}`}</Text>
      <Text style={styles.cycleText}>{`Cycle: ${cycleCount} / ${cycles}`}</Text>

      <View style={styles.buttonContainer}>
        {!running ? (
          <TouchableOpacity style={styles.button} onPress={startExercise}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopExercise}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  shape: {
    borderRadius: 50,
    marginBottom: 20,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  cycleText: {
    fontSize: 14,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: '#798bd0',
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BreathingExercise;
