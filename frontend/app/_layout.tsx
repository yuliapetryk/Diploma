import { Stack } from "expo-router";
import "./globals.css";

import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    // Show a loading spinner while fonts are loading
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#b7f5e3", // Match your background gradient start
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
