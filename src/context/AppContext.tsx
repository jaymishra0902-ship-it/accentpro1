import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AccentType, User, SkillScores, ModuleId } from '@/types';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpRequired: number;
}

const allBadges: Badge[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson', icon: 'Footprints', xpRequired: 50 },
  { id: 'phonics-master', name: 'Phonics Master', description: 'Explore all phoneme positions', icon: 'Smile', xpRequired: 150 },
  { id: 'twister-king', name: 'Tongue Twister King', description: 'Complete 10 tongue twister attempts', icon: 'Repeat', xpRequired: 200 },
  { id: 'streak-warrior', name: '7-Day Streak Warrior', description: 'Maintain a 7-day streak', icon: 'Flame', xpRequired: 350 },
  { id: 'roleplay-pro', name: 'Roleplay Pro', description: 'Complete a full roleplay scenario', icon: 'MessageSquare', xpRequired: 300 },
  { id: 'ipa-explorer', name: 'IPA Explorer', description: 'Click 20 IPA symbols', icon: 'Type', xpRequired: 250 },
  { id: 'slang-scholar', name: 'Slang Scholar', description: 'Browse 25 slang expressions', icon: 'BookOpen', xpRequired: 200 },
  { id: 'native-certified', name: 'C2 Native Certified', description: 'Generate your C2 certificate', icon: 'Award', xpRequired: 500 },
];

interface AppState {
  user: User | null;
  accent: AccentType;
  activeModule: ModuleId;
  skillScores: SkillScores;
  completedLessons: string[];
  authModalOpen: boolean;
  xp: number;
  unlockedBadges: string[];
  setAccent: (a: AccentType) => void;
  setActiveModule: (m: ModuleId) => void;
  setSkillScores: (s: SkillScores) => void;
  setCompletedLessons: (ids: string[]) => void;
  setAuthModalOpen: (open: boolean) => void;
  addXP: (amount: number) => void;
  unlockBadge: (id: string) => void;
  login: (user: User) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'accentpro-state';

interface PersistedState {
  user: User | null;
  accent: AccentType;
  skillScores: SkillScores;
  completedLessons: string[];
  xp: number;
  unlockedBadges: string[];
}

const defaultScores: SkillScores = {
  pronunciation: 45,
  intonation: 38,
  fluency: 52,
  vocabulary: 60,
  consistency: 40,
};

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadState();

  const [user, setUser] = useState<User | null>(persisted.user ?? null);
  const [accent, setAccent] = useState<AccentType>(persisted.accent ?? 'american');
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [skillScores, setSkillScores] = useState<SkillScores>(
    persisted.skillScores ?? defaultScores
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>(
    persisted.completedLessons ?? []
  );
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [xp, setXP] = useState<number>(persisted.xp ?? 0);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(
    persisted.unlockedBadges ?? []
  );

  useEffect(() => {
    const state: PersistedState = { user, accent, skillScores, completedLessons, xp, unlockedBadges };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [user, accent, skillScores, completedLessons, xp, unlockedBadges]);

  const login = useCallback((u: User) => {
    setUser(u);
    setAccent(u.targetAccent);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveModule('dashboard');
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser({
      name: 'Guest',
      email: '',
      targetAccent: 'american',
      level: 'B1',
      streak: 0,
      isGuest: true,
    });
    setAuthModalOpen(false);
  }, []);

  const addXP = useCallback((amount: number) => {
    setXP((prev) => prev + amount);
  }, []);

  const unlockBadge = useCallback((id: string) => {
    setUnlockedBadges((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        accent,
        activeModule,
        skillScores,
        completedLessons,
        authModalOpen,
        xp,
        unlockedBadges,
        setAccent,
        setActiveModule,
        setSkillScores,
        setCompletedLessons,
        setAuthModalOpen,
        addXP,
        unlockBadge,
        login,
        logout,
        continueAsGuest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { allBadges };
export type { Badge };
