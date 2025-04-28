import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";
import axios from "axios";

export default function EnterPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://192.168.1.101:5000/users/login", {
        email,
        password,
      });
  
      const user = response.data;
      console.log("Logged in user:", user);
  
      // Save user data locally
      await SecureStore.setItemAsync("user_id", user.id);
      await SecureStore.setItemAsync("user_name", user.name);
      await SecureStore.setItemAsync("user_email", user.email);
  
      // Navigate to main app
      router.replace("/root/tabs/form");
    } catch (err) {
      console.error("Login error:", err);
      setError(i18n.t("wrong_password"));
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
        
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          {/* Card */}
          <View style={{ width: "100%", maxWidth: 400, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 30, padding: 20 }}>
            <Text style={{ fontSize: 24, fontFamily: "Montserrat_700Bold", marginBottom: 20, textAlign: "center", color: "#000" }}>
              {i18n.t("enter_password")}
            </Text>

            <TextInput
              placeholder={i18n.t("password")}
              placeholderTextColor="#555"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                paddingHorizontal: 15,
                height: 50,
                marginBottom: 15,
                fontFamily: "Montserrat_400Regular",
              }}
            />

            {error ? (
              <Text style={{ color: "red", fontSize: 14, fontFamily: "Montserrat_400Regular", marginBottom: 10 }}>
                {error}
              </Text>
            ) : null}

            {/* Forgot Password */}
            <TouchableOpacity onPress={() => console.log("Forgot Password pressed")} style={{ marginBottom: 20 }}>
              <Text style={{ color: "#5661b3", fontSize: 14, fontFamily: "Montserrat_600SemiBold", textAlign: "center" }}>
                {i18n.t("forgot_password")}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleLogin}
              style={{
                backgroundColor: "#5661b3",
                borderRadius: 25,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontFamily: "Montserrat_600SemiBold" }}>
                {i18n.t("login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom BackButton */}
        <View style={{
          width: "90%",
          maxWidth: 400,
          alignSelf: "center",
          marginBottom: 30,
        }}>
          <BackButton />
        </View>

      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
