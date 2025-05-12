import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";
import { images } from "../../../constants/assets";
import axios from "axios";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { email: emailParam } = useLocalSearchParams();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (typeof emailParam === "string") {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setError(i18n.t("invalid_email"));
      setMessage("");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/forgot-password`, {
        email,
      });

      if (response.data.success) {
        setMessage(i18n.t("reset_link_sent"));
        setError("");
      } else {
        setError(i18n.t("error_sending_reset_link"));
        setMessage("");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(i18n.t("error_sending_reset_link"));
      setMessage("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 5,
              height: 5,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: 30,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Image
              source={images.penguin_forgot_password}
              style={{ width: 100, height: 100, marginBottom: 20, resizeMode: "contain" }}
            />

            <Text
              style={{
                fontSize: 19,
                fontFamily: "Montserrat_700Bold",
                marginBottom: 20,
                textAlign: "center",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {i18n.t("forgot_password_title")}
            </Text>

            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_400Regular",
                textAlign: "center",
                color: "#000",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {i18n.t("enter_your_email")}
            </Text>

            <View
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                borderRadius: 30,
                paddingHorizontal: 15,
                width: "100%",
                marginBottom: 15,
              }}
            >
              <TextInput
                placeholder={i18n.t("email")}
                placeholderTextColor="#555"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                  setMessage("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>

            {/* Display Error */}
            {error ? (
              <Text
                style={{
                  color: "red",
                  fontSize: 14,
                  fontFamily: "Montserrat_400Regular",
                  marginBottom: 10,
                }}
              >
                {error}
              </Text>
            ) : null}

            {/* Display Success Message */}
            {message ? (
              <Text
                style={{
                  color: "green",
                  fontSize: 14,
                  fontFamily: "Montserrat_400Regular",
                  marginBottom: 10,
                }}
              >
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handlePasswordReset}
              disabled={!validateEmail(email)}
              style={{
                backgroundColor: "transparent",
                borderRadius: 25,
                paddingVertical: 12,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: validateEmail(email) ? "#5661b3" : "rgba(86, 97, 179, 0.5)",
                  fontSize: 18,
                  fontFamily: "Montserrat_600SemiBold",
                }}
              >
                {i18n.t("send_reset_link")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
