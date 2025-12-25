import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = {
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    subtext: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    card: string;
    tabBar: string;
    tint: string;
  };
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: '#3B82F6', // Blue 500
    secondary: '#8B5CF6', // Violet 500
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    text: '#1F2937', // Gray 800
    subtext: '#6B7280', // Gray 500
    border: '#E5E7EB', // Gray 200
    success: '#10B981', // Emerald 500
    warning: '#F59E0B', // Amber 500
    error: '#EF4444', // Red 500
    info: '#06B6D4', // Cyan 500
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tint: '#3B82F6',
  },
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: '#60A5FA', // Blue 400
    secondary: '#A78BFA', // Violet 400
    background: '#0F172A', // Slate 900
    surface: '#1E293B', // Slate 800
    text: '#F1F5F9', // Slate 100
    subtext: '#94A3B8', // Slate 400
    border: '#334155', // Slate 700
    success: '#34D399', // Emerald 400
    warning: '#FBBF24', // Amber 400
    error: '#F87171', // Red 400
    info: '#22D3EE', // Cyan 400
    card: '#1E293B',
    tabBar: '#1E293B',
    tint: '#60A5FA',
  },
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('userTheme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newMode = !isDark;
    setIsDark(newMode);
    try {
      await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

