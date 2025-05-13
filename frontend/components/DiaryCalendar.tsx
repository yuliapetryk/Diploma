import React, { useEffect, useState } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { Dimensions } from 'react-native';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";
import i18n from "../app/localization";

const SCREEN_WIDTH = Dimensions.get('window').width;

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

LocaleConfig.locales['uk'] = {
  monthNames: [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ],
  monthNamesShort: [
    'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
    'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'
  ],
  dayNames: [
    'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'
  ],
  dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сьогодні'
};

LocaleConfig.defaultLocale = 'uk';

interface DiaryCalendarProps {
  onSelectDate: (entry: DiaryEntry | null) => void;
}

const DiaryCalendar: React.FC<DiaryCalendarProps> = ({ onSelectDate }) => {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const user_id = await SecureStore.getItemAsync("user_id");

        if (!user_id) {
          console.error("User ID not found in SecureStore.");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/diary/${user_id}`);
        const entriesData = response.data.entries;

        setEntries(entriesData);
        prepareMarkedDates(entriesData);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
    };

    fetchDiaryEntries();
  }, []);

  const prepareMarkedDates = (entries: DiaryEntry[]) => {
    const marked: MarkedDates = {};
    const dateEmotionMap: { [date: string]: Set<string> } = {};

    entries.forEach(entry => {
      const date = entry.date.split(' ')[0];

      if (!dateEmotionMap[date]) {
        dateEmotionMap[date] = new Set();
      }
      dateEmotionMap[date].add(entry.emotion);
    });

    Object.entries(dateEmotionMap).forEach(([date, emotions]) => {
      const emotionList = Array.from(emotions);
      const mainEmotion = emotionList[0];

      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: emotionColors[mainEmotion] || '#808080',
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
    onSelectDate(entryForDay ?? null);
  };

  return (
    <Calendar
      style={{ 
        width: SCREEN_WIDTH - 60, 
        borderRadius: 10,
        alignSelf: 'center', 
        marginVertical: 10 
      }}
      markingType={'custom'}
      markedDates={markedDates}
      onDayPress={handleDayPress}
      theme={{
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
      }}
    />
  );
};

export default DiaryCalendar;
