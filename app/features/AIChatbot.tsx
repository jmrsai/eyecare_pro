
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import { MotiView } from 'moti';
import appTheme from '../../styles/theme';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function AIChatbot() {
  const { COLORS, SIZES, FONTS, SHADOWS } = appTheme;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    // Simulate a bot response
    setTimeout(() => {
      const botMessage: Message = { id: (Date.now() + 1).toString(), text: `I am a friendly AI assistant. You said: "${input}"`, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

    setInput('');
  }, [input]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing' }}
        style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.botBubble
        ]}
    >
      <Text style={item.sender === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
    </MotiView>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    messageList: { flex: 1, padding: SIZES.padding },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: SIZES.padding, borderTopWidth: 1, borderTopColor: '#E5E5EA', backgroundColor: COLORS.surface },
    textInput: { flex: 1, backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: SIZES.base, marginRight: SIZES.base, ...FONTS.body, color: COLORS.text },
    sendButton: { backgroundColor: COLORS.primary, padding: SIZES.base, borderRadius: 50, ...SHADOWS.light },
    messageBubble: { maxWidth: '80%', padding: SIZES.base, borderRadius: SIZES.radius, marginBottom: SIZES.base },
    userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.primary },
    botBubble: { alignSelf: 'flex-start', backgroundColor: COLORS.surface },
    userText: { ...FONTS.body, color: COLORS.surface },
    botText: { ...FONTS.body, color: COLORS.text },
  });

  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about eye health..."
          placeholderTextColor={COLORS.textSecondary}
        />
        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Send size={24} color={COLORS.surface} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
