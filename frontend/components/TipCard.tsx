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
      <Text style={styles.type}>{type.toUpperCase()}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderColor: '#798bd0',
    borderWidth: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default TipCard;