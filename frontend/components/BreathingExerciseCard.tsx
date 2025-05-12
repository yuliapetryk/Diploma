import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Easing } from 'react-native';
import i18n from "../app/localization";
import { images } from "../constants/assets";

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
  const [cycleCount, setCycleCount] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'complete'>('inhale');
  const [finished, setFinished] = useState(false);
  const [stopped, setStopped] = useState(false);

  const running = useRef(false);
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  const getPhaseText = (phase: string) => {
    switch (phase) {
      case 'inhale': return i18n.t('inhale');
      case 'hold': return i18n.t('hold');
      case 'exhale': return i18n.t('exhale');
      default: return "";
    }
  };

  const startExercise = () => {
    if (!running.current) {
      setFinished(false);
      setStopped(false);
      running.current = true;
      setCycleCount(0);
      setPhase('inhale');
      scale.setValue(1);
      opacity.setValue(1);
      rotation.setValue(0);
      animatePhase('inhale');
    }
  };

  const stopExercise = () => {
    running.current = false;
    setStopped(true);
    clearAllTimeouts();
    scale.setValue(1);
    opacity.setValue(1);
    rotation.setValue(0);
    setPhase('complete');
  };

  const animatePhase = (currentPhase: 'inhale' | 'hold' | 'exhale') => {
    if (!running.current) return;
    let toScale = 1;
    let toOpacity = 1;
    let duration = inhale_duration * 1000;

    if (currentPhase === 'inhale') {
      toScale = 1.5;
      duration = inhale_duration * 1000;
    } else if (currentPhase === 'hold') {
      toScale = 1.5;
      duration = hold_duration * 1000;
    } else if (currentPhase === 'exhale') {
      toScale = 0.8;
      toOpacity = 0.7;
      duration = exhale_duration * 1000;
    }

    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(scale, { toValue: toScale, duration, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: toOpacity, duration, useNativeDriver: true }),
    ];

    if (currentPhase !== 'hold') {
      animations.push(
        Animated.timing(rotation, {
          toValue: 1,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start(() => {
      if (!running.current) return;
      if (currentPhase !== 'hold') {
        rotation.setValue(0);
      }

      if (currentPhase === 'inhale') {
        setPhase('hold');
        const timeout = setTimeout(() => animatePhase('hold'), hold_duration * 1000);
        timeouts.current.push(timeout);
      } else if (currentPhase === 'hold') {
        setPhase('exhale');
        animatePhase('exhale');
      } else if (currentPhase === 'exhale') {
        setCycleCount(prev => {
          const next = prev + 1;
          if (next >= cycles) {
            setPhase('complete');
            setFinished(true);
            stopExercise();
          } else {
            setPhase('inhale');
            animatePhase('inhale');
          }
          return next;
        });
      }
    });
  };

  useEffect(() => () => clearAllTimeouts(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {!stopped && (
        <Animated.Image
          source={images.lotusImage}
          style={[styles.lotus, {
            opacity,
            transform: [
              { scale },
              { rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }
            ],
          }]}
        />
      )}
      {!finished && !stopped ? (
        <>
          <Text style={styles.phaseText}>{getPhaseText(phase)}</Text>
          <Text style={styles.cycleText}>{`${cycleCount} / ${cycles}`}</Text>
        </>
      ) : (
        <>
          <Text style={styles.congratulations}>{i18n.t("congratulations")}</Text>
          <Text style={styles.description}>{i18n.t("congratulations2")}</Text>
        </>
      )}
      <View style={styles.buttonContainer}>
        {!running.current ? (
          <TouchableOpacity style={styles.button} onPress={startExercise}>
            <Text style={styles.buttonText}>{i18n.t("start")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopExercise}>
            <Text style={styles.buttonText}>{i18n.t("stop")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, borderTopColor: "black", borderTopWidth: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600", color: "#000", marginBottom: 10, letterSpacing: 1, fontFamily: "Montserrat_600SemiBold" },
  description: { fontSize: 16, fontWeight: "300", color: "#000", marginBottom: 30, letterSpacing: 1, fontFamily: "Montserrat_400Regular" },
  lotus: { width: 100, height: 100, marginBottom: 20, borderRadius: 50 },
  phaseText: { fontSize: 14, fontWeight: "300", textAlign: "center", color: "#000", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, fontFamily: "Montserrat_400Regular", marginTop:20 },
  cycleText: { fontSize: 14, fontWeight: "300", textAlign: "center", color: "#000", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1, fontFamily: "Montserrat_400Regular" },
  congratulations: { color: "#5661b3", fontSize: 18, fontFamily: "Montserrat_600SemiBold", textTransform: "uppercase", letterSpacing: 1, marginVertical: 10, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  button: { backgroundColor: "transparent", borderRadius: 25, paddingVertical: 12, alignItems: "center", width: "100%" },
  buttonText: { color: "#5661b3", fontSize: 18, fontFamily: "Montserrat_600SemiBold" },
});

export default BreathingExercise;
