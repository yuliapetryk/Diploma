import { useEffect, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Platform, Keyboard } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icon for microphone button

export default function FormScreen() {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={["#b7f5e3", "#798bd0"]}
          style={{ flex: 1, alignItems: "center", paddingVertical: 40 }}
        >
          {/* Penguin Image */}
          <View style={{ alignItems: "center", marginBottom: 10 }}>
            <Image
              source={require("../../../assets/images/penguin_form.png")}
              style={{ width: 120, height: 120, resizeMode: "contain" }}
            />
          </View>

          {/* Question Text */}
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              textAlign: "center",
              color: "#000",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            HOW TO OVERCOME INTERVIEW FEAR?
          </Text>

          {/* Form Container */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              padding: 20,
              borderRadius: 30,
              width: 350,
              height: isKeyboardVisible ? "40%" : "50%",
              alignItems: "center",
              justifyContent: "center",
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
            }}
          >
            <TextInput
              placeholder="Type here..."
              multiline
              textAlignVertical="top"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                borderRadius: 10,
                paddingHorizontal: 15,
                fontSize: 16,
                color: "#000",
                elevation: 5,
              }}
            />
          </View>

          {/* Microphone & Back Button */}
          {!isKeyboardVisible && (
            <View
              style={{
                flexDirection: "row",
                width: "90%",
                justifyContent: "space-between",
                position: "absolute",
                bottom: 30,
                alignItems: "center",
              }}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#5661b3",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>

              {/* Microphone Button */}
              <TouchableOpacity
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#6cd68b",
                  borderRadius: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="mic" size={28} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
