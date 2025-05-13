import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../../../components/BackButton";
import { format, parseISO } from 'date-fns';
import i18n from "../../localization";
import DiaryCalendar from "../../../components/DiaryCalendar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type DiaryEntry = {
  date: string;
  emotion: string;
  description: string;
  text: string;
};

const emotionColors: { [key: string]: string } = {
  admiration: '#FFD700',
  amusement: '#FFA500',
  anger: '#FF4500',
  annoyance: '#FF6347',
  approval: '#32CD32',
  caring: '#FFB6C1',
  confusion: '#DAA520',
  curiosity: '#87CEEB',
  desire: '#FF69B4',
  disappointment: '#A9A9A9',
  disapproval: '#8B0000',
  disgust: '#556B2F',
  embarrassment: '#FFB5C5',
  excitement: '#FF8C00',
  fear: '#4B0082',
  gratitude: '#7FFF00',
  grief: '#696969',
  joy: '#FFD700',
  love: '#FF1493',
  nervousness: '#D2691E',
  optimism: '#00FF7F',
  pride: '#4682B4',
  realization: '#00BFFF',
  relief: '#98FB98',
  remorse: '#8B4513',
  sadness: '#4169E1',
  surprise: '#FF00FF',
  neutral: '#808080'
};

const DiaryScreen = () => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleSelectDate = (entry: DiaryEntry | null) => {
    if (entry) {
      setSelectedEntry(entry);
      setModalVisible(true);
    }
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.container}>
      <View
        style={{
          width: "80%",
          maxWidth: 400,
          height: 70,
          borderRadius: 40,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingHorizontal: 15,
          alignSelf: "flex-end",
          marginTop: 20,
          marginRight: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/root/tabs/form")}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.title_container}>
        <Text style={styles.title}>{i18n.t("my_diary")}</Text>
        <Text style={styles.subtitle}>{i18n.t("personal_diary_space")}</Text>
      </View>

      <View style={styles.content}>
        <DiaryCalendar onSelectDate={handleSelectDate} />
      </View>
      <View style={styles.title_container}>
        <Text style={styles.subtitle}>{i18n.t("writing_exercises_title")}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/root/tabs/writing-exercise-list")}
      >
        <Text style={styles.buttonText}>{i18n.t("writing_exercises")}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.modalContent}>
            {selectedEntry && (
              <>
                <Text style={styles.modalTitle}>
                  {format(parseISO(selectedEntry.date), 'dd/MM/yy')}
                </Text>
                <View style={[styles.emotionIndicator, { backgroundColor: emotionColors[selectedEntry.emotion] }]} />
                <Text style={styles.emotionText}>
                  {i18n.t("emotion")} {i18n.t(selectedEntry.emotion)}
                </Text>
                <Text style={styles.entryText}> {i18n.t("your_note")} {selectedEntry.text}</Text>
                {selectedEntry.description && (
                  <Text style={styles.descriptionText}>
                    {selectedEntry.description}</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>{i18n.t("close")}</Text>
                </TouchableOpacity>
              </>
            )}
          </LinearGradient>
        </View>
      </Modal>
      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    alignItems: "center",
    padding: 15
  },
  title_container: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    marginVertical: 5,
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  calendar: {
    width: '100%',
    marginTop: 20,
    borderRadius: 10,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    fontFamily: 'Montserrat_600SemiBold',
    alignItems: 'center',
  },
  emotionIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 15,
  },
  emotionText: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: 'Montserrat_600SemiBold',
    textAlign: 'center',
  },
  entryText: {
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    paddingHorizontal: 30,
    borderColor: "#5661b3",
    borderWidth: 1,
  },
  buttonText: {
    color: "#5661b3",
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: "Montserrat_600SemiBold",
    opacity: 1,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: "#5661b3",
    fontSize: 18,
    fontFamily: "Montserrat_600SemiBold",
  },
  backButtonContainer: {
    position: 'absolute',
    bottom: 30,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",

  }
});

export default DiaryScreen;
