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
import TipCard from "../../../components/TipCard";
import WritingExerciseCard from "../../../components/WritingExerciseCard";
import BreathingExerciseCard from "../../../components/BreathingExerciseCard";

export default function AdviceScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const [advice, setAdvice] = useState<any[]>([]);


  const [emotions, setEmotions] = useState<string[]>([]);


  useEffect(() => {
    if (result) {
      const parsedData = JSON.parse(result as string);
      setAdvice(parsedData);

      if (parsedData.length > 0) {
        const emotionList = parsedData.map((item: any) => item.emotion);
        setEmotions(emotionList);
      }
    }
  }, [result]);


  const renderMainAdvice = () => {
    if (advice.length === 0) return <Text>No advice available.</Text>;


    const mainAdvice = advice[0];

    if (mainAdvice.type === "tips") {
      return (
        <TipCard
          title={mainAdvice.data[0].title}
          description={mainAdvice.data[0].description}
          type={mainAdvice.data[0].type}
        />
      );
    } else if (mainAdvice.type === "writing_exercise") {
      return (
        <WritingExerciseCard
          title={mainAdvice.data[0].title}
          description={mainAdvice.data[0].description}
        />
      );
    } else if (mainAdvice.type === "breathing_exercises") {
      return (
        <BreathingExerciseCard
          title={mainAdvice.data[0].title}
          description={mainAdvice.data[0].description}
          inhale_duration={mainAdvice.data[0].inhale_duration}
          hold_duration={mainAdvice.data[0].hold_duration}
          exhale_duration={mainAdvice.data[0].exhale_duration}
          cycles={mainAdvice.data[0].cycles}
        />
      );
    } else {
      return <Text style={styles.description}>No data available.</Text>;
    }
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          padding: 15,
          paddingBottom: 70,
        }}
      >
        <View style={styles.emotionContainer}>
          <Text style={styles.mainEmotion}>We recognized the following emotions:</Text>
          <Text style={styles.highlight}>{emotions.join(", ")}</Text>
        </View>

        {renderMainAdvice()}
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
  emotionContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
  },
  mainEmotion: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  highlight: {
    color: "#798bd0",
    fontWeight: "600",
    marginTop: 5,
  },
  description: {
    fontSize: 13,
    color: "#666",
    marginBottom: 5,
  },
});
