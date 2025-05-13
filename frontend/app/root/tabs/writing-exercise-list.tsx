import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../../../components/BackButton";
import WritingExerciseList from "@/components/WritingExerciseList";
import { useRouter } from "expo-router";

const WritingExercise = () => {

    const router = useRouter();

    return (
        <LinearGradient colors={["#b7f5e3", "#798bd0"]} style={styles.container}>
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
        paddingTop: 50,
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
