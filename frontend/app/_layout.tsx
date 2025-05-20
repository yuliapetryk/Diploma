import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import "./globals.css";

import { Asset } from "expo-asset";
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

  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const images = [

      require("../assets/images/penguin.png"),
      require("../assets/images/penguin_form.png"),
      require("../assets/images/penguin_password.png"),
      require("../assets/images/penguin_register.png"),
      require("../assets/images/penguin_sign.png"),
      require("../assets/images/penguin_forgot_password.png"),
      require("../assets/images/google.png"),
      require("../assets/images/flower.png"),
      require("../assets/images/sunflower.png"),
      require("../assets/images/anger_annoyance.png"),
      require("../assets/images/anger_annoyance.png"),
      require("../assets/images/confusion_embarrassment_excitement.png"),
      require("../assets/images/confusion_embarrassment_excitement.png"),
      require("../assets/images/confusion_embarrassment_excitement.png"),
      require("../assets/images/love.png"),
      require("../assets/images/sadness.png"),
      require("../assets/images/sadness.png"),
      require("../assets/images/neutral.png"),
      require("../assets/images/disappointment.png"),
      require("../assets/images/optimism.png"),

    ];


    Asset.loadAsync(images)
      .then(() => setImagesLoaded(true))
      .catch((err) => {
        console.warn("Error loading images:", err);
        setImagesLoaded(true);
      });
  }, []);

  if (!fontsLoaded || !imagesLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#b7f5e3",
        }}
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
