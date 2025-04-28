import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";

export default function RegisterScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other" | null>(null);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://192.168.1.101:5000/users/register", {
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
          <View style={{ width: "100%", maxWidth: 400, backgroundColor: "rgba(255, 255, 255, 0.3)", borderRadius: 30, padding: 20 }}>
            <Text style={{ fontSize: 24, fontFamily: "Montserrat_700Bold", marginBottom: 20, textAlign: "center", color: "#000" }}>
              {i18n.t("create_account")}
            </Text>

            <TextInput
              placeholder={i18n.t("name")}
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              style={{
                backgroundColor: "#fff",
                borderRadius: 20,
                paddingHorizontal: 15,
                height: 50,
                marginBottom: 15,
                fontFamily: "Montserrat_400Regular",
              }}
            />
            
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

            <Text style={{ fontSize: 16, fontFamily: "Montserrat_600SemiBold", marginBottom: 10, color: "#000" }}>
              {i18n.t("choose_sex")}
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
              {["male", "female", "other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSex(option as "male" | "female" | "other")}
                  style={{
                    flex: 1,
                    marginHorizontal: 5,
                    backgroundColor: sex === option ? "#5661b3" : "#fff",
                    borderRadius: 20,
                    paddingVertical: 10,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#5661b3",
                  }}
                >
                  <Text style={{
                    fontFamily: "Montserrat_500Medium",
                    fontSize: 14,
                    color: sex === option ? "#fff" : "#5661b3",
                  }}>
                    {i18n.t(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

    
            {error ? (
              <Text style={{ color: "red", fontSize: 14, fontFamily: "Montserrat_400Regular", marginBottom: 10 }}>
                {error}
              </Text>
            ) : null}

       
            <TouchableOpacity
              onPress={handleRegister}
              style={{
                backgroundColor: "#5661b3",
                borderRadius: 25,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontFamily: "Montserrat_600SemiBold" }}>
                {i18n.t("register")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

       
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
