import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from "../app/localization";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

interface WritingExerciseProps {
  title: string;
  description: string;
}

const WritingExerciseCard: React.FC<WritingExerciseProps> = ({ title, description }) => {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleSubmit = async () => {
    try {
      const user_id = await SecureStore.getItemAsync("user_id");
      if (!user_id) {
        console.log("Error", "User not found");
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/api/diary/write_exercise`, {
        text: text.trim(),
        user_id: user_id
      });

      if (response.status === 200) {
        console.log("Success", "Your writing exercise was saved!");
        setText("");
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error saving writing exercise:", error);
      console.log("Error", "Failed to save your entry. Please try again.");
    }
  };


  return (
    <View style={styles.card}>
      <Text style={styles.advice}>{"Напиши свої думки та почуття"}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {!submitted ? (
        <>
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: 5,
              borderRadius: 30,
              width: 300,
              height: 200,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <TextInput
              placeholder={i18n.t("placeholder_exercise")}
              placeholderTextColor="#555"
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
              style={{
                borderRadius: 30,
                padding: 15,
                height: "100%",
                fontSize: 14,
                color: "#000",
                fontFamily: "Montserrat_400Regular",
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!text.trim()}
            style={{
              backgroundColor: "transparent",
              borderRadius: 25,
              paddingVertical: 12,
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: text.trim() ? "#5661b3" : "rgba(86, 97, 179, 0.5)",
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
                opacity: text.trim() ? 1 : 0.5,
              }}
            >
              {i18n.t("submit")}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.thankYouMessage}>{i18n.t("thank_you_for_your_entry")}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  thankYouMessage: { color: "#5661b3", fontSize: 18, fontFamily: "Montserrat_600SemiBold", textTransform: "uppercase", letterSpacing: 1, marginVertical: 10, textAlign: 'center' },

});

export default WritingExerciseCard;
