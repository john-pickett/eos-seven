import React, { useRef, useState } from 'react';
import { View, Text, Button, Animated, StyleSheet } from 'react-native';
import { useGameStore, Inventory } from '../store/useGameStore';
import ACTIONS from '../data/actions.json';
import { getBackgroundColor } from '../utils/timeOfDayColor';

interface ActionMetadata {
  id: string;
  name: string;
  energyCost: number;
  duration: number; // in game minutes
  yield: Partial<Inventory>;
}

const AVAILABLE_ACTIONS: ActionMetadata[] = ACTIONS as ActionMetadata[];

export default function ActionsScreen() {
  const { vitals, inventory, setVitals, setInventory, advanceTime, time } =
    useGameStore();
  const [current, setCurrent] = useState<ActionMetadata | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
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

  const performAction = (action: ActionMetadata) => {
    if (current || vitals.energy < action.energyCost) return;
    setCurrent(action);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: action.duration * 1000,
      useNativeDriver: false,
    }).start(() => {
      const updates: Partial<Inventory> = {};
      (Object.keys(action.yield) as (keyof Inventory)[]).forEach((key) => {
        updates[key] = inventory[key] + (action.yield[key] ?? 0);
      });
      setInventory(updates);
      setVitals({ energy: Math.max(0, vitals.energy - action.energyCost) });
      advanceTime(action.duration);
      setCurrent(null);
    });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={{ marginBottom: 10 }}>Actions Screen</Text>
      {AVAILABLE_ACTIONS.map((action) => (
        <View key={action.id} style={{ marginVertical: 5 }}>
          <Text>{action.name}</Text>
          <Text>
            Cost: {action.energyCost} energy, Duration: {action.duration}m
          </Text>
          <Button
            title="Perform"
            onPress={() => performAction(action)}
            disabled={!!current || vitals.energy < action.energyCost}
          />
        </View>
      ))}
      <Button title="Eat Food" onPress={handleEat} />
      <Button title="Drink Water" onPress={handleDrink} />
      {current && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text>Performing {current.name}...</Text>
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    height: 10,
    width: '80%',
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
});
