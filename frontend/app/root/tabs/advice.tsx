import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../../components/BackButton";
import TipCard from "../../../components/TipCard";
import WritingExerciseCard from "../../../components/WritingExerciseCard";
import BreathingExerciseCard from "../../../components/BreathingExerciseCard";
import { penguinImages } from "../../../constants/penguinImages";
import * as SecureStore from "expo-secure-store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import i18n from "../../localization";

export default function AdviceScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const [advice, setAdvice] = useState<any[]>([]);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [userName, setUserName] = useState<string | null>(null);

  const penguinSize = useSharedValue(120);

  useEffect(() => {
    if (result) {
      const parsedData = JSON.parse(result as string);
      setAdvice(parsedData);

      if (parsedData.length > 0) {
        const emotionList = parsedData.map((item: any) =>
          i18n.t(item.emotion)
        );
        setEmotions(emotionList);
      }
    }
  }, [result]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await SecureStore.getItemAsync("user_name");
        setUserName(name);
      } catch (err) {
        console.error("Error fetching user name from SecureStore:", err);
      }
    };
    fetchUserName();
  }, []);

  const renderMainAdvice = () => {
    if (advice.length === 0)
      return (
        <Text style={{ fontSize: 16, fontFamily: "Montserrat_400Regular" }}>
          {i18n.t("no_advice_available")}
        </Text>
      );

    const mainAdvice = advice[0];
    console.log(mainAdvice.data[0].type)

    if (mainAdvice.data[0].type === "tip") {
      return (
        <TipCard
          title={mainAdvice.data[0].title}
          description={mainAdvice.data[0].description}
          type={mainAdvice.data[0].type}
        />
      );
    } else if (mainAdvice.data[0].type === "writing_exercise") {
      return (
        <WritingExerciseCard
          title={mainAdvice.data[0].title}
          description={mainAdvice.data[0].description}
        />
      );
    } else if (mainAdvice.data[0].type === "breathing_exercise") {
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
      return (
        <Text style={{ fontSize: 14, fontFamily: "Montserrat_400Regular" }}>
          {i18n.t("no_data_available")}
        </Text>
      );
    }
  };

  const renderPenguinImage = () => {
    if (emotions.length > 0) {
      const mainEmotion = emotions[0];
      const penguinImage = penguinImages[mainEmotion as keyof typeof penguinImages];
      if (penguinImage) {
        return (
          <Image
            source={penguinImage}
            style={{ width: 150, height: 150, marginBottom: 15 }}
          />
        );
      }
    }
    return null;
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
          {userName ? (
            <TouchableOpacity onPress={() => router.push("/root/tabs/profile")}>
              <Ionicons name="person-outline" size={24} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.push("/root/tabs/sign-in")}>
              <Ionicons name="log-in-outline" size={32} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: 15,
            paddingBottom: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderPenguinImage()}

          <View style={{ marginBottom: 15, alignItems: "center" }}>

            {emotions.length > 0 && (
              <>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    textAlign: "center",
                    color: "#000",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    fontFamily: "Montserrat_600SemiBold",
                  }}
                >
                  {i18n.t("the_main_emotion_we_recognized", {
                    mainEmotion: emotions[0],
                  })}
                </Text>

                {emotions.length > 1 && (
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "300",
                      textAlign: "center",
                      color: "#000",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      fontFamily: "Montserrat_400Regular",
                    }}
                  >
                    {i18n.t("we_also_found_notes_of", {
                      secondEmotion: emotions[1] ?? "-",
                      thirdEmotion: emotions[2] ?? "-",
                    })}
                  </Text>
                )}
              </>
            )}
          </View>
          {renderMainAdvice()}
        </ScrollView>

        <View
          style={{
            width: "90%",
            maxWidth: 400,
            alignSelf: "center",
            marginBottom: 30,
          }}
        >
          <BackButton />
        </View>
      </View>
    </LinearGradient>
  );
}
