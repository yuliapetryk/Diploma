import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import i18n from "../app/localization";

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
  const size = useRef(new Animated.Value(100)).current;
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };
  const getPhaseText = (phase: string) => {
  switch (phase) {
    case 'inhale':
      return i18n.t('inhale');
    case 'hold':
      return i18n.t('hold');
    case 'exhale':
      return i18n.t('exhale');
    default:
      return "";
  }
};


  const startExercise = () => {
    if (!running.current) {
      console.log("Starting Exercise...");
      setFinished(false);
      setStopped(false);
      running.current = true;
      setCycleCount(0);
      setPhase('inhale');
      size.setValue(100);
      animateShape('inhale');
    }
  };

  const stopExercise = () => {
    console.log("Stopping Exercise...");
    running.current = false;
    setStopped(true);
    clearAllTimeouts();
    size.setValue(100);
    setPhase('complete');
  };

  const animateShape = (newPhase: 'inhale' | 'hold' | 'exhale') => {
    if (!running.current) return;

    let newSize = 100;
    let duration = inhale_duration * 1000;

    if (newPhase === 'inhale') {
      newSize = 150;
      duration = inhale_duration * 1000;
    } else if (newPhase === 'exhale') {
      newSize = 80;
      duration = exhale_duration * 1000;
    } else if (newPhase === 'hold') {
      duration = hold_duration * 1000;
    }

    Animated.timing(size, {
      toValue: newSize,
      duration,
      useNativeDriver: false,
    }).start(() => {
      if (!running.current) return;

      if (newPhase === 'inhale') {
        setPhase('hold');
        const holdTimeout = setTimeout(() => {
          if (running.current) {
            animateShape('exhale');
            setPhase('exhale');
          }
        }, hold_duration * 1000);
        timeouts.current.push(holdTimeout);
      } else if (newPhase === 'exhale') {
        setCycleCount((prev) => {
          const nextCycle = prev + 1;
          if (nextCycle >= cycles) {
            setPhase('complete');
            setFinished(true);
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
    return () => clearAllTimeouts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {!stopped && (
        <Animated.View
          style={[
            styles.shape,
            {
              width: size,
              height: size,
              backgroundColor: phase === 'inhale' ? '#798bd0' : phase === 'hold' ? '#808080' : '#b7f5e3',
            },
          ]}
        />
      )}

      {!finished && !stopped ? (
        <>
          <Text style={styles.phaseText}>{`${getPhaseText(phase)}`}</Text>
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
            <Text style={styles.buttonText}> {i18n.t("start")}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopExercise}>
            <Text style={styles.buttonText}> {i18n.t("stop")}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderTopColor: "black",
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  advice: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "Montserrat_600SemiBold",
  },
  description: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  shape: {
    borderRadius: 50,
    marginBottom: 20,
  },
  phaseText: {
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  cycleText: {
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  congratulations: {
    color: "#5661b3",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#5661b3",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
});

export default BreathingExercise;
