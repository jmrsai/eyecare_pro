import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, StatusBar, ViewStyle, TextStyle } from 'react-native';
import { MotiView } from 'moti';
import { ChevronRight, Eye, ClipboardList, MessageSquare, FileSearch } from 'lucide-react-native';

const appTheme = {
    COLORS: {
        primary: '#007AFF',
        text: '#000',
        textSecondary: '#6c757d',
        background: '#f8f9fa',
        surface: '#fff',
    },
    SIZES: {
        padding: 16,
        base: 8,
        radius: 12,
    },
    FONTS: {
        h1: { fontSize: 32, fontWeight: 'bold' as const },
        h3: { fontSize: 18, fontWeight: '600' as const },
        body: { fontSize: 14, fontWeight: '400' as 'normal' },
    },
    SHADOWS: {
        light: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
        },
    },
};

const FEATURES = [
    { id: 'Comprehensive Check-up', title: 'Comprehensive Check-up', description: 'A guided 5-minute suite of core vision tests.', icon: <ClipboardList color={appTheme.COLORS.primary} size={32}/> },
    { id: 'AI Chatbot', title: 'AI Chatbot', description: 'Get answers to your eye health questions.', icon: <MessageSquare color={appTheme.COLORS.primary} size={32}/> },
    { id: 'AI Symptom Checker', title: 'AI Symptom Checker', description: 'Check your symptoms for possible conditions.', icon: <FileSearch color={appTheme.COLORS.primary} size={32}/> },
  { id: 'Amsler Grid', title: 'Amsler Grid', description: 'Test for macular degeneration.', icon: <Eye color={appTheme.COLORS.primary} size={32}/> },
  { id: 'Pupil Test', title: 'Pupil Response', description: 'Check your pupillary light reflex.', icon: <Eye color={appTheme.COLORS.primary} size={32}/> },
];

export default function Home({ navigation }: { navigation: any }) {
  const { COLORS, SIZES, FONTS, SHADOWS } = appTheme;

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 120, type: 'timing', duration: 350 }}
    >
      <Pressable 
        style={({ pressed }) => [styles.card, pressed && { transform: [{ scale: 0.98 }] }]}
        onPress={() => navigation.navigate(item.id)}
      >
        <View style={styles.cardIcon}>{item.icon}</View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
        <ChevronRight color={COLORS.textSecondary} size={28} />
      </Pressable>
    </MotiView>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: SIZES.padding, paddingTop: SIZES.padding * 2, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    title: { ...FONTS.h1, color: COLORS.text, marginBottom: SIZES.base / 2 },
    subtitle: { ...FONTS.body, color: COLORS.textSecondary },
    list: { padding: SIZES.padding },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SIZES.padding,
        borderRadius: SIZES.radius,
        marginBottom: SIZES.padding,
        ...SHADOWS.light
    } as ViewStyle,
    cardIcon: { marginRight: SIZES.padding },
    cardTextContainer: { flex: 1 },
    cardTitle: { ...FONTS.h3, color: COLORS.text } as TextStyle,
    cardDescription: { ...FONTS.body, color: COLORS.textSecondary, marginTop: 4 } as TextStyle,
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>EyeCare Pro</Text>
        <Text style={styles.subtitle}>Your personal vision screening assistant.</Text>
      </View>
      <FlatList
        data={FEATURES}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
