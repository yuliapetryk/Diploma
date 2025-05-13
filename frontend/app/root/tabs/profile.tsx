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
import LanguageSwitcher from "./language_switcher";
import axios from "axios";


export default function ProfileScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

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
  const handleUpdate = async (
    endpoint: string,
    payload: object,
    resetFields: () => void
  ) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${endpoint}`, payload);
      console.log(`Successfully updated: ${response.data.message}`);
      setErrorMessage("");
      resetFields();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message;
      setErrorMessage(errorMsg);

      if (endpoint === "update-password") {
        setOldPassword("");
      }

      console.error(`Error updating ${endpoint}:`, errorMsg);
    }
  };


  const handleNameChange = async () => {
    const email = await SecureStore.getItemAsync("user_email");

    await handleUpdate("update-name", {
      email,
      new_name: newName
    }, () => {
      setUserName(newName);
      SecureStore.setItemAsync("user_name", newName);
      setNewName("");
      setShowNameInput(false);
    });
  };

  const handlePasswordChange = async () => {
    const email = await SecureStore.getItemAsync("user_email");

    await handleUpdate("update-password", {
      email,
      old_password: oldPassword,
      new_password: newPassword
    }, () => {
      setOldPassword("");
      setNewPassword("");
      setShowPasswordInput(false);
    });
  };

  return (
    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
      <View
        style={{
          width: "80%",
          maxWidth: 400,
          height: 70,
          borderRadius: 40,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingHorizontal: 15,
          alignSelf: "flex-end",
          marginTop: 20,
          marginRight: 20,
          gap: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.push("/root/tabs/form")}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
            <View style={styles.inputField}>
              <TextInput
                placeholder={i18n.t("old_password")}
                placeholderTextColor="#555"
                value={oldPassword}
                onChangeText={setOldPassword}
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
                secureTextEntry
              />
            </View>

            <View style={styles.inputField}>
              <TextInput
                placeholder={i18n.t("new_password")}
                placeholderTextColor="#555"
                value={newPassword}
                onChangeText={setNewPassword}
                style={{
                  height: 50,
                  fontSize: 14,
                  color: "#000",
                  fontFamily: "Montserrat_400Regular",
                }}
                secureTextEntry
              />
            </View>
            {errorMessage !== "" && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessageText}>{errorMessage}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.confirmButton} onPress={handlePasswordChange}>
              <Text style={styles.confirmButtonText}>{i18n.t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subHeaderText}>{i18n.t("or_view")}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push("/root/tabs/diary")}>
          <Text style={styles.buttonText}>{i18n.t("diary")}</Text>
        </TouchableOpacity>

        <Text style={styles.subHeaderText}>{i18n.t("change_language")}</Text>

        <LanguageSwitcher></LanguageSwitcher>

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
    marginTop: -80,
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
  errorMessageContainer: {
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  errorMessageText: {
    color: "#721c24",
    fontSize: 14,
    textAlign: "center",
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
