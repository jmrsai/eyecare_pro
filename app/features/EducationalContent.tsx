
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const articles = [
  { id: '1', title: 'Understanding Glaucoma', summary: 'Learn about the causes, symptoms, and treatments for glaucoma.' },
  { id: '2', title: 'The Importance of Regular Eye Exams', summary: 'Discover why regular check-ups are crucial for maintaining eye health.' },
  { id: '3', title: 'Living with Macular Degeneration', summary: 'Tips and advice for managing life with macular degeneration.' },
];

export default function EducationalContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Educational Content</Text>
      <FlatList
        data={articles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.article}>
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text>{item.summary}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
  },
  article: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginBottom: 5,
  },
});
