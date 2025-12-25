
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const palette = {
  primary: {
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C4A6E',
  },
  secondary: {
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },
  neutral: {
    100: '#F8FAFC',
    200: '#F1F5F9',
    300: '#E2E8F0',
    400: '#CBD5E1',
    500: '#94A3B8',
    600: '#64748B',
    700: '#475569',
    800: '#334155',
    900: '#1E293B',
    1000: '#0F172A',
  },
  success: {
    100: '#D1FAE5',
    500: '#10B981',
    900: '#047857',
  },
  warning: {
    100: '#FEF3C7',
    500: '#F59E0B',
    900: '#78350F',
  },
  error: {
    100: '#FEE2E2',
    500: '#EF4444',
    900: '#7F1D1D',
  },
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: palette.primary[500],
    secondary: palette.secondary[500],
    background: palette.neutral[100],
    surface: '#FFFFFF',
    text: palette.neutral[900],
    subtext: palette.neutral[600],
    border: palette.neutral[300],
    success: palette.success[500],
    warning: palette.warning[500],
    error: palette.error[500],
    info: palette.primary[400],
    card: '#FFFFFF',
    tabBar: '#FFFFFF',
    tint: palette.primary[500],
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: palette.primary[400],
    secondary: palette.secondary[400],
    background: palette.neutral[1000],
    surface: palette.neutral[900],
    text: palette.neutral[100],
    subtext: palette.neutral[400],
    border: palette.neutral[700],
    success: palette.success[100],
    warning: palette.warning[100],
    error: palette.error[100],
    info: palette.primary[300],
    card: palette.neutral[900],
    tabBar: palette.neutral[900],
    tint: palette.primary[400],
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  h3: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export type Theme = typeof lightTheme;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Layout = typeof layout;
