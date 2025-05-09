import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function MainNavigator() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userId = await SecureStore.getItemAsync("user_id");

      if (userId) {
        router.replace("/root/tabs/form");
      } else {
        router.replace("/root/tabs/welcome");
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#798bd0" />
      </View>
    );
  }

  return null;
}
