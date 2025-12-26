
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Home, AmslerGrid, PupilResponseTest, ComprehensiveCheckup, AIChatbot, AISymptomChecker } from './features';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Amsler Grid" component={AmslerGrid} />
        <Stack.Screen name="Pupil Test" component={PupilResponseTest} />
        <Stack.Screen name="Comprehensive Check-up" component={ComprehensiveCheckup} />
        <Stack.Screen name="AI Chatbot" component={AIChatbot} />
        <Stack.Screen name="AI Symptom Checker" component={AISymptomChecker} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
