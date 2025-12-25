import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SoundProvider } from '@/contexts/SoundContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <SoundProvider>
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
        <StatusBar style="auto" />
      </SoundProvider>
    </ThemeProvider>
  );
}
