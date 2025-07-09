import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { getBackgroundColor } from '../utils/timeOfDayColor';

export default function InventoryScreen() {
  const { inventory, time } = useGameStore();
  const backgroundColor = getBackgroundColor(time.hour);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>Wires: {inventory.wires}</Text>
      <Text>Crystals: {inventory.crystals}</Text>
      <Text>Minerals: {inventory.minerals}</Text>
      <Text>Metal: {inventory.metal}</Text>
      <Text>Food: {inventory.food}</Text>
      <Text>Water: {inventory.water}</Text>
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
