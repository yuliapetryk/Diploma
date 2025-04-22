import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  const { result } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center" }}>
        Result:
      </Text>
      <Text style={{ marginTop: 10, fontSize: 16, textAlign: "center" }}>
        {result}
      </Text>
    </View>
  );
}
