
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from '@/hooks/useFonts';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SoundProvider } from '@/contexts/SoundContext';
import AnimatedStack from '../components/AnimatedStack';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <SoundProvider>
        <AnimatedStack>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
            <Stack.Screen name="medications/index" />
            <Stack.Screen name="reminders/index" />
            <Stack.Screen name="tests/accommodation" />
            <Stack.Screen name="tests/symptoms" />
            <Stack.Screen name="tests/visual-acuity" />
            <Stack.Screen name="tests/pupil-response" />
            <Stack.Screen name="kids/cosmic-racer" />
            <Stack.Screen name="kids/jungle-explorer" />
            <Stack.Screen name="kids/blinking-owl" />
            <Stack.Screen name="exercises/index" />
            <Stack.Screen name="exercises/digital-detox" />
            <Stack.Screen name="exercises/quick-break" />
          </Stack>
        </AnimatedStack>
        <StatusBar style="auto" />
      </SoundProvider>
    </ThemeProvider>
  );
}
