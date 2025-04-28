import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        width: 50,         // ✅ set width
        height: 50,        // ✅ set height
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent", // ✅ better see button
      }}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}

