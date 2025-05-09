import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import i18n, { saveLanguagePreference } from "../../localization";
import { useRouter } from "expo-router";

export default function LanguageSwitcher() {
    const [language, setLanguage] = useState(i18n.locale);
    const router = useRouter();
    const changeLanguage = async (locale: string) => {
        i18n.locale = locale;
        setLanguage(locale); 
        await saveLanguagePreference(locale); 
        router.back()
    };

    return (
        <View style={styles.languageContainer}>
            <TouchableOpacity
                style={[
                    styles.langButton,
                    language === "en" && styles.activeLangButton
                ]}
                onPress={() => changeLanguage("en")}
            >
                <Text style={styles.langButtonText}>
                    English
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.langButton,
                    language === "uk" && styles.activeLangButton
                ]}
                onPress={() => changeLanguage("uk")}
            >
                <Text style={styles.langButtonText}>
                    Українська
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    languageContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    activeLangButton: {
           backgroundColor: "transparent",
        paddingVertical: 12,
        borderColor: "rgba(86, 97, 179, 0.5)",
        borderWidth: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 10,
        opacity: 0.5
    },
    langButton: {
        backgroundColor: "transparent",
        paddingVertical: 12,
        borderColor: "#5661b3",
        borderWidth: 1,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginHorizontal: 10,
        opacity: 1
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
});
