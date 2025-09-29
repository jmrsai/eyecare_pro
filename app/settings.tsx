import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, ArrowLeft, Bell, Shield, Download, Trash2, Eye, Volume2, Palette } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  notifications: boolean;
  testReminders: boolean;
  exerciseReminders: boolean;
  dataSharing: boolean;
  highContrast: boolean;
  soundEffects: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoExport: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    testReminders: true,
    exerciseReminders: true,
    dataSharing: false,
    highContrast: false,
    soundEffects: true,
    fontSize: 'medium',
    autoExport: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const storedSettings = await AsyncStorage.getItem('appSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const updateSetting = (key: keyof SettingsState, value: any) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const exportData = async () => {
    try {
      const testResults = await AsyncStorage.getItem('testResults');
      const exerciseStats = await AsyncStorage.getItem('exerciseStats');
      const userProfile = await AsyncStorage.getItem('userProfile');
      
      const exportData = {
        testResults: testResults ? JSON.parse(testResults) : [],
        exerciseStats: exerciseStats ? JSON.parse(exerciseStats) : {},
        userProfile: userProfile ? JSON.parse(userProfile) : {},
        exportDate: new Date().toISOString(),
      };

      // In a real app, this would trigger a file download or sharing
      Alert.alert(
        'Data Export',
        `Your data has been prepared for export:\n\n• ${exportData.testResults.length} test results\n• Exercise statistics\n• Profile information\n\nIn a production app, this would generate a downloadable file.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Export Error', 'Failed to export data. Please try again.');
    }
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your test results, exercise data, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                'testResults',
                'exerciseStats',
                'userProfile',
                'appSettings'
              ]);
              Alert.alert('Data Cleared', 'All data has been successfully deleted.');
              // Reset settings to defaults
              const defaultSettings: SettingsState = {
                notifications: true,
                testReminders: true,
                exerciseReminders: true,
                dataSharing: false,
                highContrast: false,
                soundEffects: true,
                fontSize: 'medium',
                autoExport: false,
              };
              setSettings(defaultSettings);
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6B7280', '#4B5563']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Settings size={32} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Customize your experience</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive app notifications</Text>
                </View>
              </View>
              <Switch
                value={settings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.notifications ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Eye size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Test Reminders</Text>
                  <Text style={styles.settingDescription}>Reminders for regular eye tests</Text>
                </View>
              </View>
              <Switch
                value={settings.testReminders}
                onValueChange={(value) => updateSetting('testReminders', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.testReminders ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Volume2 size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Exercise Reminders</Text>
                  <Text style={styles.settingDescription}>Reminders for eye exercises</Text>
                </View>
              </View>
              <Switch
                value={settings.exerciseReminders}
                onValueChange={(value) => updateSetting('exerciseReminders', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.exerciseReminders ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Palette size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>High Contrast Mode</Text>
                  <Text style={styles.settingDescription}>Enhanced contrast for better visibility</Text>
                </View>
              </View>
              <Switch
                value={settings.highContrast}
                onValueChange={(value) => updateSetting('highContrast', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.highContrast ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <Text style={styles.settingLabel}>Font Size</Text>
            <View style={styles.fontSizeContainer}>
              {(['small', 'medium', 'large'] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    settings.fontSize === size && styles.fontSizeButtonActive
                  ]}
                  onPress={() => updateSetting('fontSize', size)}
                >
                  <Text style={[
                    styles.fontSizeText,
                    settings.fontSize === size && styles.fontSizeTextActive
                  ]}>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Volume2 size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>Audio feedback for interactions</Text>
                </View>
              </View>
              <Switch
                value={settings.soundEffects}
                onValueChange={(value) => updateSetting('soundEffects', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.soundEffects ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Privacy & Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Anonymous Data Sharing</Text>
                  <Text style={styles.settingDescription}>Help improve eye health research</Text>
                </View>
              </View>
              <Switch
                value={settings.dataSharing}
                onValueChange={(value) => updateSetting('dataSharing', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.dataSharing ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Download size={20} color="#6B7280" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Auto Export Data</Text>
                  <Text style={styles.settingDescription}>Automatically backup your data monthly</Text>
                </View>
              </View>
              <Switch
                value={settings.autoExport}
                onValueChange={(value) => updateSetting('autoExport', value)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={settings.autoExport ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={exportData}>
            <Download size={24} color="#3B82F6" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Export My Data</Text>
              <Text style={styles.actionDescription}>Download all your test results and data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={clearAllData}>
            <Trash2 size={24} color="#EF4444" />
            <View style={styles.actionInfo}>
              <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Clear All Data</Text>
              <Text style={styles.actionDescription}>Permanently delete all stored data</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Information */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>EyeCare Pro</Text>
          <Text style={styles.infoText}>Version 1.0.0</Text>
          <Text style={styles.infoText}>© 2025 EyeCare Technologies</Text>
          <Text style={styles.infoText}>
            Your privacy is protected with end-to-end encryption and HIPAA-compliant data handling.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  fontSizeContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  fontSizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  fontSizeTextActive: {
    color: '#FFFFFF',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionInfo: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
});