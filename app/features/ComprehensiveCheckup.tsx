
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import appTheme from '../../styles/theme';
import PostureCheck from './common/PostureCheck';

const TESTS = [
  { id: 'Visual Acuity', title: 'Visual Acuity' },
  { id: 'Macular Health', title: 'Macular Health' },
  { id: 'Color Vision', title: 'Color Vision' },
  { id: 'Peripheral Vision', title: 'Peripheral Vision' },
  { id: 'Accommodation', title: 'Accommodation' },
];

export default function ComprehensiveCheckup({ navigation }: { navigation: any }) {
  const { COLORS, SIZES, FONTS } = appTheme;
  const [isPostureCorrect, setIsPostureCorrect] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.padding },
    title: { ...FONTS.h1, color: COLORS.text, marginBottom: SIZES.padding },
    testItem: { backgroundColor: COLORS.surface, padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: SIZES.base, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    testTitle: { ...FONTS.h3, color: COLORS.text },
  });

  if (!isPostureCorrect) {
    return <PostureCheck onPostureCorrect={setIsPostureCorrect} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comprehensive Check-up</Text>
      {TESTS.map((test, index) => (
        <MotiView
          key={test.id}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: index * 100, type: 'timing' }}
        >
          <Pressable style={styles.testItem} onPress={() => navigation.navigate(test.id)}>
            <Text style={styles.testTitle}>{test.title}</Text>
          </Pressable>
        </MotiView>
      ))}
    </View>
  );
}
