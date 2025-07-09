import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { getBackgroundColor } from '../utils/timeOfDayColor';

export default function SleepScreen() {
  const { setVitals, advanceTime, time } = useGameStore();
  const backgroundColor = getBackgroundColor(time.hour);

  const handleSleep = () => {
    setVitals({ energy: 100 });
    advanceTime(8 * 60);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>Sleep Screen</Text>
      <Button title="Sleep 8 Hours" onPress={handleSleep} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
