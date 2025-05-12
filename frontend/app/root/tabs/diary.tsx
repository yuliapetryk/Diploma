import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../../../components/BackButton";
import { Calendar, DateData } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";

type DiaryEntry = {
  date: string;
  emotion: string;
  description: string;
  text: string;
};

type MarkedDates = {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    activeOpacity?: number;
    customStyles?: {
      container?: object;
      text?: object;
    };
  };
};
const fetchUserId = async () => {
  try {
    const id = await SecureStore.getItemAsync("user_id");
    
    if (!id) {
      console.error("User ID not found");
    } else {
      console.log("User ID fetched:", id);  
      return id;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
  }
};
const emotionColors: { [key: string]: string } = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF4500',
  anxious: '#9370DB',
  neutral: '#808080',

};

const DiaryScreen = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
  const fetchDiaryEntries = async () => {
    try {

      const user_id = await SecureStore.getItemAsync("user_id");

      if (!user_id) {
        console.error("User ID not found in SecureStore.");
        return;
      }

      console.log("Fetched User ID:", user_id);

      const response = await axios.get(`${API_BASE_URL}/api/diary/${user_id}`);
      const entriesData = response.data.entries;

      setEntries(entriesData);
      console.log(entriesData)
      prepareMarkedDates(entriesData);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
    }
  };

  fetchDiaryEntries();
}, []);

  const prepareMarkedDates = (entries: DiaryEntry[]) => {
    const marked: MarkedDates = {};
    
    entries.forEach(entry => {
      const date = entry.date.split(' ')[0];
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: emotionColors[entry.emotion] || '#808080',
            borderRadius: 20,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          }
        }
      };
    });
    
    setMarkedDates(marked);
  };

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;
    const entryForDay = entries.find(entry => entry.date.startsWith(dateStr));
    
    if (entryForDay) {
      setSelectedEntry(entryForDay);
      setModalVisible(true);
    }
  };

  const calendarTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: '#000',
    selectedDayBackgroundColor: '#fff',
    selectedDayTextColor: '#000',
    todayTextColor: '#000',
    dayTextColor: '#000',
    textDisabledColor: '#d9d9d9',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: '#000',
    monthTextColor: '#000',
    indicatorColor: 'blue',
    textDayFontFamily: 'Montserrat_400Regular',
    textMonthFontFamily: 'Montserrat_600SemiBold',
    textDayHeaderFontFamily: 'Montserrat_600SemiBold',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.container}>
      <BackButton />
      <View style={styles.content}>
        <Text style={styles.title}>My Diary</Text>
        <Text style={styles.subtitle}>This is your personal diary space.</Text>
        
        <Calendar
          style={styles.calendar}
          theme={calendarTheme}
          markingType={'custom'}
          markedDates={markedDates}
          onDayPress={handleDayPress}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedEntry && (
              <>
                <Text style={styles.modalTitle}>
                  {format(parseISO(selectedEntry.date), 'MMMM d, yyyy')}
                </Text>
                <View style={[styles.emotionIndicator, { backgroundColor: emotionColors[selectedEntry.emotion] }]} />
                <Text style={styles.emotionText}>
                  Emotion: {selectedEntry.emotion.charAt(0).toUpperCase() + selectedEntry.emotion.slice(1)}
                </Text>
                <Text style={styles.entryText}>{selectedEntry.text}</Text>
                {selectedEntry.description && (
                  <Text style={styles.descriptionText}>{selectedEntry.description}</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    marginBottom: 10,
    fontFamily: "Montserrat_600SemiBold",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    fontFamily: "Montserrat_400Regular",
    marginBottom: 20,
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
    backgroundColor: '#798bd0',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
  },
});

export default DiaryScreen;