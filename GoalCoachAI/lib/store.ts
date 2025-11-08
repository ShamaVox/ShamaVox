import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type Reflection = { feeling: string; thought: string; alternative_thought: string; };

type State = {
  connected: boolean;
  weeklyGoal: string | null;
  reflections: Reflection[];
  connectSource: () => void;
  setWeeklyGoal: (g: string) => void;
  addReflection: (r: Reflection) => void;
};

const persistKey = 'goalcoach_state';

const useStore = create<State>((set, get) => ({
  connected: false,
  weeklyGoal: null,
  reflections: [],

  connectSource: async () => {
    set({ connected: true });
    const s = get(); await AsyncStorage.setItem(persistKey, JSON.stringify(s));
  },
  setWeeklyGoal: async (g: string) => {
    set({ weeklyGoal: g });
    const s = get(); await AsyncStorage.setItem(persistKey, JSON.stringify(s));
  },
  addReflection: async (r: Reflection) => {
    set({ reflections: [...get().reflections, r] });
    const s = get(); await AsyncStorage.setItem(persistKey, JSON.stringify(s));
  },
}));

export default useStore;
