
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

interface PostureCheckProps {
  onPostureCorrect: (isCorrect: boolean) => void;
}

// Correct type for a detected face in the new API
type DetectedFace = FaceDetector.FaceDetectorResult['faces'][0];

const PostureCheck: React.FC<PostureCheckProps> = ({ onPostureCorrect }) => {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('Initializing...');

  useEffect(() => {
    (async () => {
      const { status } = await FaceDetector.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFacesDetected = ({ faces }: { faces: DetectedFace[] }) => {
    if (faces.length > 0) {
      const face = faces[0];
      if (face) {
        const isLevel = face.rollAngle ? Math.abs(face.rollAngle) < 10 : false;
        // The smiling probability might not be available in all modes, default to true
        const isEngaged = face.smilingProbability ? face.smilingProbability > 0.3 : true;

        if (isLevel && isEngaged) {
          setFeedback('Posture is correct');
          onPostureCorrect(true);
        } else if (!isLevel) {
          setFeedback('Please keep your head level');
          onPostureCorrect(false);
        } else {
          setFeedback('Please look at the screen');
          onPostureCorrect(false);
        }
      }
    } else {
      setFeedback('No face detected. Please position yourself in front of the camera.');
      onPostureCorrect(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera.</Text></View>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 1000,
          tracking: true,
        }}
      />
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackText}>{feedback}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  feedbackText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PostureCheck;
