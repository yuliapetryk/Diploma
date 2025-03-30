import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router"

export default function Index() {
  return (
    <LinearGradient
      colors={['#b7f5e3', '#798bd0']}
      style={{ flex: 1, alignItems: "center", paddingVertical: 40 }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{ zIndex: 2, marginBottom: -17 }}>
          <Image
            source={require("../../assets/images/penguin.png")}
            style={{ width: 120, height: 120, resizeMode: "contain" }}
          />
        </View>

        <View
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            padding: 20,
            paddingTop: 60,
            borderRadius: 40,
            width: "90%",
            height: "60%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "600",
              textAlign: "center",
              color: "#000",
              letterSpacing: 1,
            }}
          >  HOW ARE YOU ?
          </Text>

          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              color: "#000",
              marginTop: 15,
              textTransform: "uppercase",
              fontWeight: "500",
              lineHeight: 16,
            }}
          >
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          marginBottom: 30,
          backgroundColor: "transparent",
          padding: 10,
        }}
      >
       <Link href="/root/tabs/form"> 
  <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>NEXT</Text>
</Link>

      </TouchableOpacity>
    </LinearGradient>
  );
}