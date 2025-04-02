import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import i18n from "./localization";

export default function Index() {
  return (
    <LinearGradient
      colors={["#b7f5e3", "#7485cf"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ height: 60 }} />

      <View style={{ alignItems: "center", width: "100%", position: "relative" }}>

        <View style={{ marginBottom: -20, alignItems: "center", zIndex: 10 }}>
          <Image
            source={require("../assets/images/penguin.png")}
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

          <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 50 }}>
            <Text
              style={{
                fontSize: 32,
                fontFamily: "Montserrat_700Bold",
                color: "#000",
                lineHeight: 30,
                flex: 1,
                marginBottom: 30
              }}
            >
              {i18n.t("greeting")}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_500Medium",
              color: "#000",
              marginTop: 0,
              lineHeight: 18,
              marginBottom: 20
            }}
          >
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
              {i18n.t("next")}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </LinearGradient>
  );
}
