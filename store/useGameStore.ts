import { create } from 'zustand';

export interface Vitals {
  energy: number;
  hunger: number;
  thirst: number;
  health: number;
}

export interface Inventory {
  wires: number;
  crystals: number;
  minerals: number;
  metal: number;
  food: number;
  water: number;
}

export interface GameTime {
  day: number;
  hour: number;
  minute: number;
}

interface GameState {
  vitals: Vitals;
  inventory: Inventory;
  time: GameTime;
  setVitals: (partial: Partial<Vitals>) => void;
  setInventory: (partial: Partial<Inventory>) => void;
  advanceTime: (minutes: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  vitals: { energy: 100, hunger: 0, thirst: 0, health: 100 },
  inventory: { wires: 0, crystals: 0, minerals: 0, metal: 0, food: 0, water: 0 },
  time: { day: 1, hour: 8, minute: 0 },
  setVitals: (partial) =>
    set((state) => ({ vitals: { ...state.vitals, ...partial } })),
  setInventory: (partial) =>
    set((state) => ({ inventory: { ...state.inventory, ...partial } })),
  advanceTime: (minutes) =>
    set((state) => {
      let minute = state.time.minute + minutes;
      let hour = state.time.hour + Math.floor(minute / 60);
      minute = minute % 60;
      let day = state.time.day + Math.floor(hour / 24);
      hour = hour % 24;
      return { time: { day, hour, minute } };
    }),
}));
