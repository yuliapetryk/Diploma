import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

interface WritingExerciseProps {
  title: string;
  description: string;
}

const WritingExerciseCard: React.FC<WritingExerciseProps> = ({ title, description }) => {
  const [inputText, setInputText] = useState('');

  const handleSave = () => {
    console.log('User entered:', inputText);
    // Here you can handle saving the text or sending it to backend
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder='Write your thoughts here...'
        value={inputText}
        onChangeText={setInputText}
      />

      <Button title='Save' onPress={handleSave} />
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
  }
});

export default WritingExerciseCard;
