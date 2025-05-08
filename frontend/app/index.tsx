import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import i18n from "./localization";
import { images } from "./../constants/assets";

export default function Index() {
  return (
    <LinearGradient
      colors={["#b7f5e3", "#7485cf"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ height: 60 }} />

      <View
        style={{
          alignItems: "center",
          width: "100%",
          position: "relative",
          shadowColor: "#000", 
          shadowOffset: {
            width: 5,
            height: 5,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>

        <View style={{ marginBottom: -20, alignItems: "center", zIndex: 10 }}>
          <Image
            source={images.penguin}
            style={{
              width: 150,
              height: 150,
              resizeMode: "contain",
            }}
          />
        </View>

        <View
          style={{
            width: "90%",
            backgroundColor: "rgba(255,255,255,0.25)",
            borderRadius: 30,
            paddingVertical: 40,
            paddingHorizontal: 25,
            alignItems: "flex-start",
          }}
        >

          <View style={{ flexDirection: "column", alignItems: "flex-start", marginTop: 30 }}>
            <Text style={{
              fontSize: 30,
              fontFamily: "Montserrat_700Bold",
              marginBottom: 5,
              textAlign: "center",
              color: "#000",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>

              {i18n.t("greeting")}
            </Text>

            <Text style={{
              fontSize: 20,
              fontFamily: "Montserrat_700Bold",
              marginBottom: 20,
              textAlign: "center",
              color: "#000",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}>
              {i18n.t("greeting_question")}
            </Text>
          </View>

          <Text style={{
            fontSize: 14,
            fontFamily: "Montserrat_400Regular",
            color: "#000",
            marginBottom: 20,
            textTransform: "uppercase",
            letterSpacing: 1,
            lineHeight: 20
          }}>
            {i18n.t("description")}
          </Text>
        </View>
      </View>

      <View style={{
        marginBottom: 40,
        width: "100%",
        alignItems: "center",
      }}>
        <Link href="/root/tabs/form" asChild>
          <TouchableOpacity
            style={{
              paddingVertical: 14,
              paddingHorizontal: 50,
              borderRadius: 30,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Montserrat_600SemiBold",
              }}
            >
              {i18n.t("continue")}
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/root/tabs/sign-in" asChild>
          <TouchableOpacity
            style={{
              paddingVertical: 14,
              paddingHorizontal: 50,
              borderRadius: 30,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Montserrat_500Medium",
              }}
            >
              {i18n.t("log_in")}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}
