import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import i18n from "../app/localization";
import { LinearGradient } from "expo-linear-gradient";

interface WritingExerciseEntry {
    id: string;
    text: string;
    date: string;
}

const WritingExerciseList: React.FC = () => {
    const [entries, setEntries] = useState<WritingExerciseEntry[]>([]);
    const [visibleEntries, setVisibleEntries] = useState<WritingExerciseEntry[]>([]);
    const [itemsToShow, setItemsToShow] = useState(5);
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const user_id = await SecureStore.getItemAsync("user_id");
                if (!user_id) {
                    Alert.alert("Error", "User not found");
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/api/diary/write_exercises/${user_id}`);
                setEntries(response.data);
                setVisibleEntries(response.data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching writing exercises:", error);
                Alert.alert("Error", "Could not load your notes.");
            }
        };

        fetchEntries();
    }, []);

    const handleShowMore = () => {
        const newItemsToShow = itemsToShow + 5;
        setItemsToShow(newItemsToShow);
        setVisibleEntries(entries.slice(0, newItemsToShow));
    };

    const renderItem = ({ item }: { item: WritingExerciseEntry }) => (
        <View
            style={styles.card}
        >
            <Text style={styles.date}>
                {format(parseISO(item.date), 'dd/MM/yy')}
            </Text>
            <Text style={styles.text}>
                {item.text.length > 100 ? `${item.text.substring(0, 100)}...` : item.text}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.title_container}>
                <Text style={styles.title}>{i18n.t("my_notes")}</Text>
                <Text style={styles.subtitle}>{i18n.t("my_note_desc")}</Text>
            </View>

            <FlatList
                data={visibleEntries}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>{i18n.t("no_notes_found")}</Text>
                }
            />

            {visibleEntries.length < entries.length && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleShowMore}
                    >
                        <Text style={styles.buttonText}>{i18n.t("show_more")}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        color: "#000",
        marginBottom: 10,
        textTransform: "uppercase",
        letterSpacing: 1,
        fontFamily: "Montserrat_600SemiBold",
    },
    title_container: {
        width: "90%",
        maxWidth: 400,
        borderRadius: 20,
        paddingTop: 20,
        paddingBottom:15,
        alignItems: "center",
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "300",
        textAlign: "center",
        marginVertical: 5,
        color: "#000",
        textTransform: "uppercase",
        letterSpacing: 1,
        fontFamily: "Montserrat_400Regular",
    },
    list: {
        paddingHorizontal: 15,
        marginHorizontal: 20,
    },
    card: {
        backgroundColor: "transparent",
        borderRadius: 15,
        padding: 15,
        marginBottom: 12,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderColor: "#5661b3",
        borderWidth: 1
    },
    date: {
        fontSize: 14,
        color: "#5661b3",
        fontFamily: "Montserrat_600SemiBold",
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
        fontFamily: "Montserrat_400Regular",
        color: "#333",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        color: "#555",
        fontFamily: "Montserrat_400Regular",
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 120,
    },
    button: {
        backgroundColor: "transparent",
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderColor: "#5661b3",
        borderWidth: 1,
    },
    buttonText: {
        color: "#5661b3",
        fontSize: 14,
        textTransform: "uppercase",
        fontFamily: "Montserrat_600SemiBold",
        textAlign: "center",
    },
});

export default WritingExerciseList;
