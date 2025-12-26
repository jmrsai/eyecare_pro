
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Play, Check, Camera as CameraIcon } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import { useScreenBrightness } from '../../hooks/useScreenBrightness';
import { Encryption } from '../../services/Encryption';

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
        h2: { fontSize: 24, fontWeight: 'bold' as const },
        body: { fontSize: 14, fontWeight: '400' as 'normal' },
    },
    SHADOWS: {
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    },
    TOUCH_TARGET: {
        padding: 8,
    },
};

export default function PupilResponseTest() {
  const { COLORS, SIZES, FONTS, SHADOWS, TOUCH_TARGET } = appTheme;
  const cameraRef = useRef<CameraView>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [testState, setTestState] = useState('idle'); // idle, testing, done
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [flashMode, setFlashMode] = useState(false);

  const { setBrightness, restoreSystemBrightness } = useScreenBrightness();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const runTest = async () => {
    if (!cameraRef.current || !isCameraReady) return;

    setTestState('testing');
    await setBrightness(1.0);

    setFlashMode(false);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setFlashMode(true);
    // In a real app, you would start recording here.
    await new Promise(resolve => setTimeout(resolve, 500)); 

    setFlashMode(false);
    // In a real app, you would stop recording and process the video.
    
    const results = { pupilDiameter: [Math.random() * 2 + 4, Math.random() * 2 + 2] };
    const encryptedResults = await Encryption.encrypt(JSON.stringify(results), 'super-secret-key');
    console.log('Encrypted Results:', encryptedResults);

    setTestState('done');
    await restoreSystemBrightness();
  };

  const renderButton = () => {
    switch (testState) {
      case 'testing':
        return <LottieView source={require('../../assets/animations/loading.json')} autoPlay loop style={{ width: 80, height: 80 }} />;
      case 'done':
        return <LottieView source={require('../../assets/animations/success.json')} autoPlay loop={false} style={{ width: 100, height: 100 }} />;
      default:
        return (
          <Pressable
            style={({ pressed }) => [styles.button, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            onPress={runTest}
          >
            <Play color={COLORS.surface} size={32} />
            <Text style={styles.buttonText}>Start Test</Text>
          </Pressable>
        );
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    title: { ...FONTS.h2, color: COLORS.text, textAlign: 'center', marginBottom: SIZES.padding },
    cameraContainer: { width: 300, height: 300, borderRadius: 150, overflow: 'hidden', marginBottom: SIZES.padding, backgroundColor: COLORS.text, justifyContent: 'center', alignItems: 'center' },
    camera: { ...StyleSheet.absoluteFillObject },
    button: { ...TOUCH_TARGET, flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: SIZES.padding, borderRadius: SIZES.radius, ...SHADOWS.medium },
    buttonText: { ...FONTS.body, color: COLORS.surface, marginLeft: SIZES.base },
    permissionText: { ...FONTS.body, color: COLORS.textSecondary, textAlign: 'center', padding: SIZES.padding },
  });

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera. Please enable camera permissions in your device settings.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pupil Response Test</Text>
      <MotiView from={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1}} transition={{ type: 'timing', duration: 500 }}>
        <View style={styles.cameraContainer}>
            <CameraView 
              ref={cameraRef}
              style={styles.camera} 
              facing="front"
              enableTorch={flashMode}
              onCameraReady={() => setIsCameraReady(true)}
            />
        </View>
      </MotiView>

      <View style={{ height: 100, alignItems: 'center', justifyContent: 'center' }}>
        {renderButton()}
      </View>
    </SafeAreaView>
  );
}
