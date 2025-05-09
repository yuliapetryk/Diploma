import { useState } from "react";
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
import { API_BASE_URL } from "@env";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError(i18n.t("passwords_not_match"));
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/users/reset-password`, {
        token,
        new_password: password,
      });

      if (response.data.message === "Password has been successfully reset") {
        setSuccessMessage(i18n.t("password_reset_success"));
        setTimeout(() => {
          router.replace("/root/tabs/sign-in");
        }, 2000);
      }
    } catch (err) {
      console.error("Reset Password error:", err);
      setError(i18n.t("reset_password_error"));
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
            shadowOffset: { width: 5, height: 5 },
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
              source={images.penguin_password}
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
              {i18n.t("reset_password")}
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
              {i18n.t("enter_new_password")}
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
                placeholder={i18n.t("new_password")}
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>

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
                placeholder={i18n.t("confirm_password")}
                placeholderTextColor="#555"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>

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

            {successMessage ? (
              <Text
                style={{
                  color: "green",
                  fontSize: 14,
                  fontFamily: "Montserrat_400Regular",
                  marginBottom: 10,
                }}
              >
                {successMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handlePasswordReset}
              disabled={password.trim().length === 0 || confirmPassword.trim().length === 0}
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
                  color: password.trim().length > 0 ? "#5661b3" : "rgba(86, 97, 179, 0.5)",
                  fontSize: 18,
                  fontFamily: "Montserrat_600SemiBold",
                }}
              >
                {i18n.t("reset_password")}
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
