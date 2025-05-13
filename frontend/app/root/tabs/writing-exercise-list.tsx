import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../../../components/BackButton";
import WritingExerciseList from "@/components/WritingExerciseList";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const WritingExercise = () => {

    const router = useRouter();

    return (
        <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.container}>
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
            <WritingExerciseList></WritingExerciseList>
            <View style={styles.backButtonContainer}>
                <BackButton />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    backButtonContainer: {
        position: 'absolute',
        bottom: 30,
        width: "90%",
        maxWidth: 400,
        alignSelf: "center",

    }
});

export default WritingExercise;
