import React, { useEffect } from "react";
import { TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import { images } from "../constants/assets";
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const router = useRouter();

  // 👇 Expo Proxy Redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.frontend:/oauthredirect",
  });

  console.log("Redirect URI:", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    redirectUri,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleLogin(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleLogin = async (accessToken: string | undefined) => {
    if (!accessToken) return;

    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const googleUser = await res.json();

      const apiRes = await axios.post("http://192.168.1.100:5000/users/google-auth", {
        email: googleUser.email,
        name: googleUser.name,
      });

      const user = apiRes.data;

      await SecureStore.setItemAsync("user_id", user.id);
      await SecureStore.setItemAsync("user_email", user.email);
      await SecureStore.setItemAsync("user_name", user.name);

      router.replace("/root/tabs/form");
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => promptAsync()}
      disabled={!request}    >
      <Image
        source={images.google}
        style={styles.googleLogo}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 5,
    height: 48,
    marginTop: 15,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleText: {
    color: "#555",
    fontSize: 16,
    fontFamily: "Montserrat_500Medium",
  },
});
