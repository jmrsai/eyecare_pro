import { Tabs } from 'expo-router';
import { Home, Activity, BookOpen, User, ClipboardList, Gamepad2 } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.tint,
        tabBarInactiveTintColor: theme.colors.subtext,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="kids"
        options={{
          title: 'Kids',
          tabBarIcon: ({ color, size }) => <Gamepad2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="education"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: 'Results',
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}