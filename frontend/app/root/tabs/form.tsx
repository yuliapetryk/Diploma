import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import i18n from "../../localization";
import { images } from "../../../constants/assets";
import BackButton from "../../../components/BackButton";
import { API_BASE_URL } from '@env';
import * as SecureStore from "expo-secure-store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import axios from "axios";

export default function FormScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  const penguinSize = useSharedValue(120);


  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      penguinSize.value = withTiming(0, { duration: 300 });
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      penguinSize.value = withTiming(130, { duration: 300 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

 useFocusEffect(
    React.useCallback(() => {
      const fetchUserName = async () => {
        try {
          const name = await SecureStore.getItemAsync("user_name");
          setUserName(name);
        } catch (err) {
          console.error("Error fetching user name from SecureStore:", err);
        }
      };

      fetchUserName();
    }, [])
  );


  const animatedPenguinStyle = useAnimatedStyle(() => ({
    width: penguinSize.value,
    height: penguinSize.value,
  }));

  const handleSubmit = async () => {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setLoadingMessage(i18n.t("loading_message"));

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze`, {
        text: text.trim(),
      });

      const result = response.data?.result || response.data?.message || "No response.";

      setText("");
      Keyboard.dismiss();
      setLoading(false);
      setLoadingMessage("");

      router.push({
        pathname: "/root/tabs/advice",
        params: { result: JSON.stringify(result) },
      });

    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false);
      setLoadingMessage(i18n.t("loading_error_message"));
    }
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
              <Ionicons name="person-outline" size={24} color="black"  />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.push("/root/tabs/sign-in")}>
              <Ionicons name="log-in-outline" size={32} color="black" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingBottom: 70,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.Image
                source={images.penguin_form}
                style={[
                  {
                    resizeMode: "contain",
                    marginBottom: 20,
                  },
                  animatedPenguinStyle,
                ]}
              />

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                  color: "#000",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontFamily: "Montserrat_600SemiBold",
                }}
              >
                {i18n.t("welcome")}, {userName ?? i18n.t("friend")}!
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                  color: "#000",
                  marginBottom: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontFamily: "Montserrat_600SemiBold",
                }}
              >
                {i18n.t("greeting_form")}
              </Text>

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
                {i18n.t("description_form")}
              </Text>

              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  padding: 5,
                  borderRadius: 30,
                  width: "100%",
                  maxWidth: 400,
                  height: 200,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  placeholder={i18n.t("placeholder")}
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
              {loadingMessage ? (
                <Text
                  style={{
                    marginTop: 20,
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {loadingMessage}
                </Text>
              ) : null}
              
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={text.trim().length === 0}
            style={{
              flex: 2,
              height: 50,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: text.trim().length === 0 ? "transparent" : "#000",
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
              }}
            >
              {i18n.t("submit")}
            </Text>
          </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

        <View
          style={{
            width: "90%",
            maxWidth: 400,
            height: 70,
            borderRadius: 40,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            alignSelf: "center",
            marginBottom: 40,
            gap: 10,
          }}
        >


          <TouchableOpacity
            style={{
              flex: 1,
              height: 50,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => console.log("Voice pressed")}
          >
            <Ionicons name="mic" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>

  );
}
