import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Linking,
    Alert,
} from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../../components/BackButton";
import * as SecureStore from "expo-secure-store";
import BreathingExerciseCard from "../../../components/BreathingExerciseCard";
import i18n from "../../localization";

export default function SOSScreen() {
    const router = useRouter();

    const { result } = useLocalSearchParams();
    const [userName, setUserName] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);



    const showContacts = () => setModalVisible(true);
    const hideContacts = () => setModalVisible(false);

    const handlePress = (number: string) => {
        // Видаляємо пробіли, щоб формат був валідний для tel:
        const telUrl = `tel:${number.replace(/\s+/g, "")}`;
        Linking.canOpenURL(telUrl).then((supported) => {
            if (supported) {
                Linking.openURL(telUrl);
            } else {
                Alert.alert("Помилка", "Неможливо відкрити дзвінок на цей номер.");
            }
        });
    };

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
    const contacts = [
        { title: "Контакт-центр МОЗ", number: "0 800 60 20 19" },
        { title: "Лінія допомоги для ветеранів", number: "0 800 33 20 29" },
        {
            title: "Лінія Національної психологічної асоціації",
            number: "0 800 100 102",
        },
        { title: "Лінія запобігання самогубствам Lifeline Ukraine", number: "7333" },
    ];
    const mainAdvice = {
        data: [
            {
                title: "Дихання для заземлення",
                description: "Ця дихальна практика допоможе у стресовій ситуації",
                inhale_duration: 5,
                hold_duration: 2,
                exhale_duration: 5,
                cycles: 10,
            },
        ],
    };
    return (
        <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
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
                    {userName ? (
                        <TouchableOpacity onPress={() => router.push("/root/tabs/profile")}>
                            <Ionicons name="person-outline" size={24} color="black" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => router.push("/root/tabs/sign-in")}>
                            <Ionicons name="log-in-outline" size={32} color="black" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    contentContainerStyle={{
                        padding: 15,
                        paddingBottom: 70,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "600",
                            textAlign: "center",
                            color: "#000",
                            marginBottom: 10,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            fontFamily: "Montserrat_600SemiBold",
                        }}
                    >
                        Ви у кризовій ситуації?
                    </Text>

                    <Text
                        style={styles.title}
                    >
                        Ви не одні, дозвольте вам допомогти
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: "transparent",
                            borderRadius: 25,
                            paddingVertical: 12,
                            alignItems: "center",
                            paddingHorizontal: 30,
                            marginVertical: 8,
                            borderColor: "red",
                            borderWidth: 1,
                        }}
                        onPress={showContacts}
                    >
                        <Text style={{
                            color: "red",
                            fontSize: 14,
                            textTransform: "uppercase",
                            fontFamily: "Montserrat_600SemiBold",
                            opacity: 1,
                            textAlign: "center",
                        }}>Контакти гарячих лінії</Text>
                    </TouchableOpacity>
                    <Text
                        style={styles.title_margin}
                    >
                        Або ви можете виконати дихальну вправу для негайної допомоги
                    </Text>
                    <BreathingExerciseCard
                        title={mainAdvice.data[0].title}
                        description={mainAdvice.data[0].description}
                        inhale_duration={mainAdvice.data[0].inhale_duration}
                        hold_duration={mainAdvice.data[0].hold_duration}
                        exhale_duration={mainAdvice.data[0].exhale_duration}
                        cycles={mainAdvice.data[0].cycles}
                    />
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
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Контакти гарячих ліній</Text>

                        <View
                            style={{
                                padding: 10,
                                justifyContent: "center",
                            }}
                        >
                            {contacts.map((item, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    onPress={() => handlePress(item.number)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.entryText}>
                                        {item.title}:
                                        {"\n"}
                                        {"\n"}
                                        <Text style={styles.numberText}>{item.number}</Text>
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>{i18n.t("close")}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Modal>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({

    numberText: {
        fontStyle: "italic",
        fontFamily: "Montserrat_600SemiBold",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Montserrat_600SemiBold',
        alignItems: 'center',
    },
    title: {
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
        color: "#000",
        marginVertical: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontFamily: "Montserrat_400Regular",
    },
    title_margin: {
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
        color: "#000",
        marginVertical: 10,
        marginBottom: 30,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontFamily: "Montserrat_400Regular",
    },
    entryText: {
        fontSize: 16,
        marginVertical: 8,
        fontFamily: 'Montserrat_400Regular',
        textAlign: 'left',
    },
    button: {
        backgroundColor: "transparent",
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: "center",
        paddingHorizontal: 30,
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
    closeButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: "#5661b3",
        fontSize: 18,
        fontFamily: "Montserrat_600SemiBold",
    },

});
