import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type Moment = { t: number; note: string };
type Session = {
  id: string;
  fileUri: string;
  duration: number;
  moments: Moment[];
  meta?: { candidate?: string; company?: string };
};

type State = {
  sessions: Session[];
  saveSession: (s: Session) => void;
};

const persistKey = 'interview_lens_sessions';

async function persistSessions(sessions: Session[]) {
  await AsyncStorage.setItem(persistKey, JSON.stringify(sessions));
}

const useStore = create<State>((set, get) => ({
  sessions: [],
  saveSession: (s: Session) => {
    const updated = [s, ...get().sessions];
    set({ sessions: updated });
    persistSessions(updated);
  },
}));

export default useStore;
