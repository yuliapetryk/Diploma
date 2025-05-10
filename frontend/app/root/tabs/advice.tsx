import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../../components/BackButton";

export default function AdviceScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const [advice, setAdvice] = useState<any[]>([]);

  // Parse JSON from parameters
  useEffect(() => {
    if (result) {
      const parsedData = JSON.parse(result as string);
      setAdvice(parsedData);
    }
  }, [result]);

  /**
   * 🔥 Render Tips and Breathing Exercises
   */
  const renderAdvice = () => {
    if (advice.length === 0) return <Text>No advice available.</Text>;

    return advice.map((item, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.emotion}>{item.emotion.toUpperCase()}</Text>

        {item.type === "tips" ? (
          item.data.map((tip: any, idx: number) => (
            <View key={idx} style={styles.tipContainer}>
              <Text style={styles.title}>{tip.title}</Text>
              <Text style={styles.description}>{tip.description}</Text>
            </View>
          ))
        ) : (
          item.data.map((exercise: any, idx: number) => (
            <View key={idx} style={styles.tipContainer}>
              <Text style={styles.title}>{exercise.title}</Text>
              <Text style={styles.description}>{exercise.description}</Text>
              <Text style={styles.duration}>Inhale: {exercise.inhale_duration} sec, Hold: {exercise.hold_duration} sec, Exhale: {exercise.exhale_duration} sec, Cycles: {exercise.cycles}</Text>
            </View>
          ))
        )}
      </View>
    ));
  };

  /**
   * 🔥 Main Render
   */
  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Advice and Exercises</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 70,
        }}
      >
        {renderAdvice()}
      </ScrollView>
      <BackButton></BackButton>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#000",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  emotion: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4A4A4A",
  },
  tipContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
  duration: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  }
});
