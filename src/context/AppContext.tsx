import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AccentType, User, SkillScores, ModuleId } from '@/types';

interface AppState {
  user: User | null;
  accent: AccentType;
  activeModule: ModuleId;
  skillScores: SkillScores;
  completedLessons: string[];
  authModalOpen: boolean;
  setAccent: (a: AccentType) => void;
  setActiveModule: (m: ModuleId) => void;
  setSkillScores: (s: SkillScores) => void;
  setCompletedLessons: (ids: string[]) => void;
  setAuthModalOpen: (open: boolean) => void;
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

  useEffect(() => {
    const state: PersistedState = { user, accent, skillScores, completedLessons };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [user, accent, skillScores, completedLessons]);

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

  return (
    <AppContext.Provider
      value={{
        user,
        accent,
        activeModule,
        skillScores,
        completedLessons,
        authModalOpen,
        setAccent,
        setActiveModule,
        setSkillScores,
        setCompletedLessons,
        setAuthModalOpen,
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
