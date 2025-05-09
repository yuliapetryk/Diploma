import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import i18n from "../../localization";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../../components/BackButton";
import axios from "axios";
import { API_BASE_URL } from "@env";

export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await SecureStore.getItemAsync("user_name");
        setUserName(name);
      } catch (err) {
        console.error("Error fetching user name from SecureStore:", err);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user_id");
    await SecureStore.deleteItemAsync("user_name");
    await SecureStore.deleteItemAsync("user_email");
    router.replace("/root/tabs/welcome");
  };

  const handleNameChange = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/update-name`, { name: newName });
      setUserName(newName);
      setNewName("");
      setShowNameInput(false);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.post(`${API_BASE_URL}/users/update-password`, { password: newPassword });
      setNewPassword("");
      setShowPasswordInput(false);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>
          {i18n.t("welcome")}, {userName ?? i18n.t("friend")}!
        </Text>

        <Text style={styles.subHeaderText}>{i18n.t("edit_your_data")}</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowNameInput((prev) => !prev);
              if (!showNameInput) setShowPasswordInput(false); 
            }}
          >
            <Text style={styles.buttonText}>{i18n.t("name")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setShowPasswordInput((prev) => !prev);
              if (!showPasswordInput) setShowNameInput(false); 
            }}
          >
            <Text style={styles.buttonText}>{i18n.t("password")}</Text>
          </TouchableOpacity>
        </View>

        {showNameInput && (
          <View style={styles.inputContainer}>
            <View style={styles.inputField}>

              <TextInput
                placeholder={i18n.t("name")}
                placeholderTextColor="#555"
                value={newName}
                onChangeText={setNewName}
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handleNameChange}>
              <Text style={styles.confirmButtonText}>{i18n.t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {showPasswordInput && (
          <View style={styles.inputContainer}>
            <View
              style={styles.inputField}>
              <TextInput
                placeholder={i18n.t("password")}
                placeholderTextColor="#555"
                value={newPassword}
                onChangeText={setNewPassword}
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
              />
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={handlePasswordChange}>
              <Text style={styles.confirmButtonText}>{i18n.t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subHeaderText}>{i18n.t("or_view")}</Text>

        <TouchableOpacity style={styles.button} onPress={() => console.log("Diary")}>
          <Text style={styles.buttonText}>{i18n.t("diary")}</Text>
        </TouchableOpacity>

        <Text style={styles.subHeaderText}>{i18n.t("change_language")}</Text>

        <View style={styles.languageContainer}>
          <TouchableOpacity style={styles.langButton} onPress={() => i18n.locale = 'en'}>
            <Text style={styles.langButtonText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langButton} onPress={() => i18n.locale = 'uk'}>
            <Text style={styles.langButtonText}>Українська</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#d9534f" />
          <Text style={styles.logoutButtonText}>{i18n.t("logout")}</Text>
        </TouchableOpacity>

      </ScrollView>
      <View
        style={{
          width: "90%",
          maxWidth: 400,
          alignSelf: "center",
          marginBottom: 30,
        }}
      >
        <BackButton />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_600SemiBold",
  },
  subHeaderText: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    marginVertical: 5,
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  button: {
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    paddingHorizontal: 30,
    marginVertical: 8,
    borderColor: "#5661b3",
    borderWidth: 1,
  },
  buttonText: {
    color: "#5661b3",
    fontSize: 14,
    textTransform: "uppercase",
    fontFamily: "Montserrat_600SemiBold",
    opacity: 1,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    maxWidth: 300,
    flexDirection: "column",
    marginVertical: 10,
    alignItems: "center",
    gap: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 10,
    paddingHorizontal: 15,
    flex: 1,
    height: 40,
  },
  inputField: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 30,
    marginVertical: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
    width: "100%",
  },
  confirmButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderColor: "green",
    borderWidth: 1,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: "60%",
    justifyContent: "center", 
  },
  confirmButtonText: {
    color: "green",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  languageContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  langButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderColor: "#5661b3",
    borderWidth: 1,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    color: "#5661b3",
    textTransform: "uppercase",
    fontFamily: "Montserrat_600SemiBold",
    opacity: 1,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderColor: "#d9534f",
    borderWidth: 1,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 30,
    alignItems: "center",
    gap: 10,
  },
  logoutButtonText: {
    color: "#d9534f",
    fontSize: 12,
    fontWeight: "300",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
});
