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
import { useRouter } from "expo-router";
import axios from "axios";
import i18n from "../../localization";
import BackButton from "../../../components/BackButton";
import { images } from "../../../constants/assets";
import GoogleSignInButton from "../../../components/GoogleSignInButton";


export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleContinue = async () => {
    if (!validateEmail(email)) {
      setError(i18n.t("invalid_email"));
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/check-email`, {
        params: { email },
      });

      if (response.data.exists) {
        router.push({ pathname: "/root/tabs/enter-password", params: { email } });
      } else {
        router.push({ pathname: "/root/tabs/register", params: { email } });
      }
    } catch (err) {
      console.error("Check email error:", err);
      setError(i18n.t("error_checking_email"));
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
          <View style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 30,
            padding: 20,
            alignItems: "center",
          }}>

            <Image
              source={images.penguin_sign}
              style={{
                width: 100,
                height: 100,
                marginBottom: 20,
                resizeMode: "contain",
              }}
            />

            <Text style={{
              fontSize: 20,
              fontFamily: "Montserrat_700Bold",
              marginBottom: 20,
              textAlign: "center",
              color: "#000",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {i18n.t("we_are_happy")}
            </Text>

            <Text style={{
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
              textAlign: "center",
              color: "#000",
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {i18n.t("enter_email")}
            </Text>

            <View style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 30,
              paddingHorizontal: 15,
              width: "100%",
              marginBottom: 15,
            }}>
              <TextInput
                placeholder={i18n.t("email")}
                placeholderTextColor="#555"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
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

            <Text style={{
              fontSize: 12,
              fontFamily: "Montserrat_400Regular",
              textAlign: "center",
              color: "#000",
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {i18n.t("google")}
            </Text>

            <GoogleSignInButton />

            {error ? (
              <Text style={{
                color: "red",
                fontSize: 14,
                fontFamily: "Montserrat_400Regular",
                marginBottom: 10,
              }}>
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={handleContinue}
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
                  opacity: validateEmail(email) ? 1 : 0.5,
                }}
              >
                {i18n.t("continue")}
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
