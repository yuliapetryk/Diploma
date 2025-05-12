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
import * as SecureStore from "expo-secure-store";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";
import { images } from "../../../constants/assets";
import axios from "axios";

export default function EnterPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, {
        email,
        password,
      });

      const user = response.data;
      console.log("Logged in user:", user);

      await SecureStore.setItemAsync("user_id", user.id);
      await SecureStore.setItemAsync("user_name", user.name);
      await SecureStore.setItemAsync("user_email", user.email);

      router.replace("/root/tabs/form");
    } catch (err) {
      console.error("Login error:", err);
      setError(i18n.t("wrong_password"));
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
          }}>
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
              {i18n.t("welcome_back")}
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
              {i18n.t("enter_password")}
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
                placeholder={i18n.t("password")}
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

            <TouchableOpacity
              onPress={() => router.push({ pathname: "/root/tabs/forgot-password", params: { email } })}
              style={{ marginBottom: 20 }}
            >
              <Text
                style={{
                  color: "#5661b3",
                  fontSize: 14,
                  fontFamily: "Montserrat_600SemiBold",
                  textAlign: "center",
                }}
              >
                {i18n.t("forgot_password")}
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={handleLogin}
              disabled={password.trim().length === 0}
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
                  opacity: password.trim().length > 0 ? 1 : 0.5,
                }}
              >
                {i18n.t("login")}
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
