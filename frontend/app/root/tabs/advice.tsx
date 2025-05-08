import { useLocalSearchParams, useRouter } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '@env';

export default function AdviceScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams();
  const [parsedResult, setParsedResult] = useState<
  { label: string; score: number }[]
>([]);

  useEffect(() => {
    try {
      const singleResult = Array.isArray(result) ? result[0] : result;
      const parsed = JSON.parse(singleResult);
      setParsedResult(parsed);
    } catch {
      setParsedResult([]);
    }
  }, [result]);
  
  return (
    <LinearGradient
      colors={["#b7f5e3", "#798bd0"]}
      style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 40 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            fontFamily: "Montserrat_700Bold",
            color: "#000",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          Результат аналізу емоцій:
        </Text>

        {parsedResult.length > 0 ? (
          parsedResult.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                padding: 15,
                borderRadius: 20,
                width: "100%",
                marginBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Montserrat_600SemiBold",
                  color: "#000",
                }}
              >
                {item.label.toUpperCase()}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Montserrat_400Regular",
                  color: "#000",
                  marginTop: 5,
                }}
              >
                Вірогідність: {(item.score * 100).toFixed(1)}%
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Montserrat_400Regular",
              fontStyle: "italic",
              color: "#555",
              textAlign: "center",
            }}
          >
            Немає даних для відображення.
          </Text>
        )}
      </ScrollView>

      <View
        style={{
          width: "90%",
          maxWidth: 400,
          height: 70,
          borderRadius: 40,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 15,
          alignSelf: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
