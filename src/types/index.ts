export type AccentType = 'american' | 'british';

export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type ModuleId =
  | 'dashboard'
  | 'phonics'
  | 'curriculum'
  | 'youtube'
  | 'evaluator'
  | 'roleplay'
  | 'indianism'
  | 'connected'
  | 'drills'
  | 'slang'
  | 'shadowing'
  | 'ipa'
  | 'progress';

export interface User {
  name: string;
  email: string;
  targetAccent: AccentType;
  level: Level;
  streak: number;
  isGuest: boolean;
}

export interface SkillScores {
  pronunciation: number;
  intonation: number;
  fluency: number;
  vocabulary: number;
  consistency: number;
}

export interface IndianismItem {
  id: string;
  indianism: string;
  native: string;
  explanation: string;
  accent: AccentType;
}

export interface SlangItem {
  id: string;
  phrase: string;
  meaning: string;
  accent: AccentType;
  category: string;
  example: string;
}

export interface CurriculumLesson {
  id: string;
  level: Level;
  title: string;
  description: string;
  topics: string[];
  completed: boolean;
}

export interface RoleplayScenario {
  id: string;
  title: string;
  setting: string;
  accent: AccentType;
  difficulty: string;
  prompts: string[];
  feedback: string[];
}

export interface ConnectedSpeechItem {
  id: string;
  type: 'linking' | 'elision' | 'contraction' | 'silent';
  title: string;
  description: string;
  examples: string[];
  accent: AccentType;
}

export interface TongueTwister {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  focusSound: string;
}

export interface MouthPosition {
  id: string;
  sound: string;
  ipa: string;
  description: string;
  tonguePosition: string;
  lipShape: string;
  tip: string;
  accent: AccentType;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  videoId: string;
  category: string;
  accent: AccentType;
}

export interface ShadowingTrack {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  accent: AccentType;
  segments: { text: string; start: number; end: number }[];
}

export interface IPASymbol {
  id: string;
  symbol: string;
  type: 'vowel' | 'consonant' | 'diphthong';
  description: string;
  example: string;
  exampleWord: string;
  voiced: boolean;
}
