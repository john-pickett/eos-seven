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
  hasSeenGreetingToday: boolean;
  setVitals: (partial: Partial<Vitals>) => void;
  setInventory: (partial: Partial<Inventory>) => void;
  setHasSeenGreetingToday: (seen: boolean) => void;
  advanceTime: (minutes: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  vitals: { energy: 100, hunger: 0, thirst: 0, health: 100 },
  inventory: { wires: 0, crystals: 0, minerals: 0, metal: 0, food: 0, water: 0 },
  time: { day: 1, hour: 8, minute: 0 },
  hasSeenGreetingToday: false,
  setVitals: (partial) =>
    set((state) => ({ vitals: { ...state.vitals, ...partial } })),
  setInventory: (partial) =>
    set((state) => ({ inventory: { ...state.inventory, ...partial } })),
  setHasSeenGreetingToday: (seen) => set({ hasSeenGreetingToday: seen }),
  advanceTime: (minutes) =>
    set((state) => {
      let minute = state.time.minute + minutes;
      let hour = state.time.hour + Math.floor(minute / 60);
      minute = minute % 60;
      let day = state.time.day + Math.floor(hour / 24);
      hour = hour % 24;

      const hungerIncrease = (minutes / (4 * 60)) * 5;
      const thirstIncrease = (minutes / (4 * 60)) * 10;
      let hunger = Math.min(100, state.vitals.hunger + hungerIncrease);
      let thirst = Math.min(100, state.vitals.thirst + thirstIncrease);

      let health = state.vitals.health;
      if (hunger >= 100 || thirst >= 100) {
        health = Math.max(0, health - (minutes / 60) * 5);
      }

      const newState: Partial<GameState> = {
        time: { day, hour, minute },
        vitals: { ...state.vitals, hunger, thirst, health },
      };
      if (day !== state.time.day) {
        newState.hasSeenGreetingToday = false;
      }
      return newState;
    }),
}));
