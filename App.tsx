import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  Animated,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useGameStore, Inventory } from './src/store/useGameStore';
import { MARIA_PERSONALITIES } from './src/store/mariaPersonalities';
import ACTIONS from './src/data/actions.json';

const AVAILABLE_ACTIONS: ActionMetadata[] = ACTIONS as ActionMetadata[];

interface ActionMetadata {
  id: string;
  name: string;
  energyCost: number;
  duration: number; // in game minutes
  yield: Partial<Inventory>;
}

function HomeScreen() {
  const { vitals, time, hasSeenGreetingToday, setHasSeenGreetingToday } =
    useGameStore();
  const format = (n: number) => n.toString().padStart(2, '0');
  const personality =
    MARIA_PERSONALITIES[(time.day - 1) % MARIA_PERSONALITIES.length];
  return (
    <View style={styles.container}>
      <Modal visible={!hasSeenGreetingToday} transparent animationType="slide">
        <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
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

function ActionsScreen() {
  const { vitals, inventory, setVitals, setInventory, advanceTime } =
    useGameStore();
  const [current, setCurrent] = useState<ActionMetadata | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

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
    <View style={styles.container}>
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

function InventoryScreen() {
  const { inventory } = useGameStore();
  return (
    <View style={styles.container}>
      <Text>Wires: {inventory.wires}</Text>
      <Text>Crystals: {inventory.crystals}</Text>
      <Text>Minerals: {inventory.minerals}</Text>
      <Text>Metal: {inventory.metal}</Text>
      <Text>Food: {inventory.food}</Text>
      <Text>Water: {inventory.water}</Text>
    </View>
  );
}

function SleepScreen() {
  const { setVitals, advanceTime } = useGameStore();

  const handleSleep = () => {
    setVitals({ energy: 100 });
    advanceTime(8 * 60);
  };

  return (
    <View style={styles.container}>
      <Text>Sleep Screen</Text>
      <Button title="Sleep 8 Hours" onPress={handleSleep} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Actions" component={ActionsScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="Sleep" component={SleepScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
