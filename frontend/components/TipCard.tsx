import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TipCardProps {
  title: string;
  description: string;
  type: string;
}

const TipCard: React.FC<TipCardProps> = ({ title, description, type }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.advice}>{"Дозволь дати тобі невелику пораду"}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.title}>{"Щиро сподіваюсь, що це тобі допоможе!"}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 15,
    borderTopColor: "black",
    borderTopWidth: 1
  },
  advice: {
    fontSize: 12,
    fontWeight: "300",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "Montserrat_600SemiBold",
  },
  description: {
    fontSize: 16,
    fontWeight: "300",
    textAlign: "left",
    color: "#000",
    marginBottom: 10,
    letterSpacing: 1,
    fontFamily: "Montserrat_400Regular",
  },
});

export default TipCard;