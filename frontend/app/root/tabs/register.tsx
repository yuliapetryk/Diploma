import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";
import { images } from "../../../constants/assets";

export default function RegisterScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other" | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://192.168.1.100:5000/users/register", {
        email,
        password,
        name,
        sex,
      });

      const user = response.data;
      console.log("Registered user:", user);

      await SecureStore.setItemAsync("user_id", user.id);
      await SecureStore.setItemAsync("user_name", user.name);
      await SecureStore.setItemAsync("user_email", user.email);

      router.replace("/root/tabs/form");
    } catch (err) {
      console.error("Register error:", err);
      setError(i18n.t("error_registering"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>

        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View
            style={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 30,
              padding: 20,
              alignItems: "center",
            }}
          >

            <Image
              source={images.penguin_register}
              style={{ width: 100, height: 100, marginBottom: 20, resizeMode: "contain" }}
            />

            <Text
              style={{
                fontSize: 20,
                fontFamily: "Montserrat_700Bold",
                marginBottom: 10,
                textAlign: "center",
                color: "#000",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {i18n.t("we_are_happy_register")}
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
              {i18n.t("create_account")}
            </Text>

            <View style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 30,
              paddingHorizontal: 15,
              width: "100%",
              marginBottom: 15,
            }}>
              <TextInput
                placeholder={i18n.t("name")}
                placeholderTextColor="#555"
                value={name}
                onChangeText={setName}
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>

            <View style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 30,
              paddingHorizontal: 15,
              width: "100%",
              marginBottom: 15,
            }}>
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

            <Text
              style={{
                fontSize: 12,
                fontFamily: "Montserrat_400Regular",
                textAlign: "center",
                color: "#000",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {i18n.t("choose_sex")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                gap: 30,
              }}
            >
              {["male", "female", "other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSex(option as "male" | "female" | "other")}
                  style={{ alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: "#5661b3",
                      backgroundColor: sex === option ? "#5661b3" : "transparent",
                      marginBottom: 4,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: "Montserrat_400Regular",
                      textAlign: "center",
                      color: "#000",
                      marginBottom: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    {i18n.t(option)}
                  </Text>
                </TouchableOpacity>
              ))}
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
              onPress={handleRegister}
              disabled={!name.trim() || !password.trim()}
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
                  color: name.trim() && password.trim() ? "#5661b3" : "rgba(86, 97, 179, 0.5)",
                  fontSize: 18,
                  fontFamily: "Montserrat_600SemiBold",
                  opacity: name.trim() && password.trim() ? 1 : 0.5,
                }}
              >
                {i18n.t("register")}
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
