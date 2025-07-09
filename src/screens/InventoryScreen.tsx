import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useGameStore } from '../store/useGameStore';
import { getBackgroundColor } from '../utils/timeOfDayColor';

export default function InventoryScreen() {
  const { inventory, vitals, setInventory, setVitals, time } = useGameStore();
  const backgroundColor = getBackgroundColor(time.hour);

  const handleEat = () => {
    if (inventory.food > 0) {
      setInventory({ food: inventory.food - 1 });
      setVitals({ hunger: Math.max(0, vitals.hunger - 10) });
    }
  };

  const handleDrink = () => {
    if (inventory.water > 0) {
      setInventory({ water: inventory.water - 1 });
      setVitals({ thirst: Math.max(0, vitals.thirst - 10) });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text>Wires: {inventory.wires}</Text>
      <Text>Crystals: {inventory.crystals}</Text>
      <Text>Minerals: {inventory.minerals}</Text>
      <Text>Metal: {inventory.metal}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Text style={{ marginRight: 10 }}>Food: {inventory.food}</Text>
        <Button title="Eat" onPress={handleEat} disabled={inventory.food <= 0} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Text style={{ marginRight: 10 }}>Water: {inventory.water}</Text>
        <Button
          title="Drink"
          onPress={handleDrink}
          disabled={inventory.water <= 0}
        />
      </View>
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
