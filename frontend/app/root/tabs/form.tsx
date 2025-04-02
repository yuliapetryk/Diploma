import { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
import i18n from "../../localization"; 

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function FormScreen() {
  const [text, setText] = useState("");
  const router = useRouter();

  const penguinSize = useSharedValue(120);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      penguinSize.value = withTiming(60, { duration: 300 });
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      penguinSize.value = withTiming(120, { duration: 300 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const animatedPenguinStyle = useAnimatedStyle(() => ({
    width: penguinSize.value,
    height: penguinSize.value,
  }));

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert(i18n.t("alert_empty_title"), i18n.t("alert_empty_message"));
      return;
    }
    Alert.alert(i18n.t("alert_success_title"), text);
    setText("");
    Keyboard.dismiss();
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
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
                paddingBottom: 20,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.Image
                source={require("../../../assets/images/penguin_form.png")}
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
            </ScrollView>
          </KeyboardAvoidingView>

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
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

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
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}
