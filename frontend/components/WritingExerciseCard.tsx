import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import i18n from "../app/localization";

interface WritingExerciseProps {
  title: string;
  description: string;
}

const WritingExerciseCard: React.FC<WritingExerciseProps> = ({ title, description }) => {
  const [inputText, setInputText] = useState('');
  const [text, setText] = useState("");

  const handleSubmit = () => {
    console.log('User entered:', inputText);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.advice}>{"Напиши свої думки та почуття"}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

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
  input: {
    height: 120,
    borderColor: '#798bd0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: "Montserrat_400Regular",
    color: "#333"
  },

});

export default WritingExerciseCard;
