import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../../../components/BackButton";
import { format, parseISO } from 'date-fns';
import i18n from "../../localization";
import DiaryCalendar from "../../../components/DiaryCalendar";

type DiaryEntry = {
  date: string;
  emotion: string;
  description: string;
  text: string;
};

const emotionColors: { [key: string]: string } = {
  admiration: '#FFD700',       // Golden Yellow
  amusement: '#FFA500',        // Orange
  anger: '#FF4500',            // Red-Orange
  annoyance: '#FF6347',        // Tomato Red
  approval: '#32CD32',         // Lime Green
  caring: '#FFB6C1',           // Light Pink
  confusion: '#DAA520',        // Goldenrod
  curiosity: '#87CEEB',        // Sky Blue
  desire: '#FF69B4',           // Hot Pink
  disappointment: '#A9A9A9',   // Dark Gray
  disapproval: '#8B0000',      // Dark Red
  disgust: '#556B2F',          // Olive Green
  embarrassment: '#FFB5C5',    // Light Pink
  excitement: '#FF8C00',       // Dark Orange
  fear: '#4B0082',             // Indigo
  gratitude: '#7FFF00',        // Chartreuse
  grief: '#696969',            // Dim Gray
  joy: '#FFD700',              // Golden Yellow
  love: '#FF1493',             // Deep Pink
  nervousness: '#D2691E',      // Chocolate
  optimism: '#00FF7F',         // Spring Green
  pride: '#4682B4',            // Steel Blue
  realization: '#00BFFF',      // Deep Sky Blue
  relief: '#98FB98',           // Pale Green
  remorse: '#8B4513',          // Saddle Brown
  sadness: '#4169E1',          // Royal Blue
  surprise: '#FF00FF',         // Magenta
  neutral: '#808080'           // Gray
};


const DiaryScreen = () => {
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectDate = (entry: DiaryEntry | null) => {
    if (entry) {
      setSelectedEntry(entry);
      setModalVisible(true);
    }
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.container}>
      <View style={styles.title_container}>
        <Text style={styles.title}>{i18n.t("my_diary")}</Text>
        <Text style={styles.subtitle}>{i18n.t("personal_diary_space")}</Text>
      </View>

      <View style={styles.content}>
        <DiaryCalendar onSelectDate={handleSelectDate} />
      </View>

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

      {/* Back Button */}
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
    paddingTop: 50,
  },
  content: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    padding: 15
  },
  title_container: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
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
