import React from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { MARIA_PERSONALITIES } from '../store/mariaPersonalities';
import { getBackgroundColor } from '../utils/timeOfDayColor';

export default function HomeScreen() {
  const { vitals, time, hasSeenGreetingToday, setHasSeenGreetingToday } =
    useGameStore();

  const personality =
    MARIA_PERSONALITIES[(time.day - 1) % MARIA_PERSONALITIES.length];

  const format = (n: number) => n.toString().padStart(2, '0');
  const backgroundColor = getBackgroundColor(time.hour);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Modal visible={!hasSeenGreetingToday} transparent animationType="slide">
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 10 }}>
              Good morning! I am MARIA, your {personality.acronym}.
            </Text>
            <Button
              title="Continue"
              onPress={() => setHasSeenGreetingToday(true)}
            />
          </View>
        </View>
      </Modal>
      <Text>Energy: {vitals.energy}</Text>
      <Text>Hunger: {vitals.hunger}</Text>
      <Text>Thirst: {vitals.thirst}</Text>
      <Text>Health: {vitals.health}</Text>
      <Text>
        Day {time.day} {format(time.hour)}:{format(time.minute)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
});
