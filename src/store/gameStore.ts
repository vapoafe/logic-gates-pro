import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyActivity } from '../types';
import { playSound } from '../utils/sound';

interface GameState {
  // User Profile
  userId: string | null;
  username: string;
  avatar: string;
  language: 'el' | 'en';
  theme: 'dark' | 'light';
  soundEnabled: boolean;

  // Progression
  totalXP: number;
  level: number;
  currentLevelXP: number;
  totalPoints: number;

  // Streaks & Achievements
  streak: number;
  maxStreak: number;
  badges: string[];
  completedLessons: string[];

  // Counters for Badges
  totalAttempts: number;
  correctAnswers: number;
  hardExercisesSolved: number;
  demorganSolved: number;
  truthTablesSolved: number;
  circuitsBuiltCount: number;

  // Activity History for Progress Chart
  progressHistory: DailyActivity[];

  // Actions
  initializeUser: (username?: string) => void;
  setUsername: (name: string) => void;
  setAvatar: (avatar: string) => void;
  setLanguage: (lang: 'el' | 'en') => void;
  toggleSound: () => void;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  addXP: (amount: number, multiplier?: number) => { leveledUp: boolean; newLevel: number };
  addCorrectAnswer: (exerciseType?: string, difficulty?: string, moduleId?: string) => void;
  resetStreak: () => void;
  addBadge: (badgeId: string) => boolean;
  completeLesson: (lessonId: string) => void;
  recordCircuitBuilt: () => void;
  resetProgress: () => void;
}

const XP_PER_LEVEL = 500;

const defaultHistory: DailyActivity[] = [
  { day: 'Mon', dayEl: 'Δευ', xp: 60, exercisesSolved: 4 },
  { day: 'Tue', dayEl: 'Τρί', xp: 140, exercisesSolved: 8 },
  { day: 'Wed', dayEl: 'Τετ', xp: 220, exercisesSolved: 12 },
  { day: 'Thu', dayEl: 'Πέμ', xp: 380, exercisesSolved: 19 },
  { day: 'Fri', dayEl: 'Παρ', xp: 520, exercisesSolved: 26 },
  { day: 'Sat', dayEl: 'Σάβ', xp: 740, exercisesSolved: 35 },
  { day: 'Sun', dayEl: 'Κυρ', xp: 950, exercisesSolved: 45 },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      userId: null,
      username: 'Μαθητής Boole',
      avatar: '👨‍💻',
      language: 'el',
      theme: 'dark',
      soundEnabled: true,

      totalXP: 120,
      level: 1,
      currentLevelXP: 120,
      totalPoints: 120,

      streak: 0,
      maxStreak: 0,
      badges: ['first_step'],
      completedLessons: ['intro'],

      totalAttempts: 0,
      correctAnswers: 0,
      hardExercisesSolved: 0,
      demorganSolved: 0,
      truthTablesSolved: 0,
      circuitsBuiltCount: 0,

      progressHistory: defaultHistory,

      initializeUser: (customName) => {
        const state = get();
        // Sync HTML class for dark/light mode
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        if (!state.userId) {
          set({
            userId: 'user_' + Date.now(),
            username: customName || state.username || 'Μαθητής Boole',
          });
        }
      },

      setUsername: (name) => set({ username: name.trim() || 'Μαθητής Boole' }),

      setAvatar: (avatar) => set({ avatar }),

      setLanguage: (language) => set({ language }),

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: next });
        if (next === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleSound: () => {
        const next = !get().soundEnabled;
        set({ soundEnabled: next });
        if (next) playSound('click', true);
      },

      addXP: (amount: number, multiplier: number = 1) => {
        const state = get();
        const xpGain = Math.floor(amount * multiplier);
        const newTotalXP = state.totalXP + xpGain;
        const newLevel = Math.floor(newTotalXP / XP_PER_LEVEL) + 1;
        const leveledUp = newLevel > state.level;

        // Update today's progress history entry
        const history = [...state.progressHistory];
        const lastIdx = history.length - 1;
        if (lastIdx >= 0) {
          history[lastIdx] = {
            ...history[lastIdx],
            xp: history[lastIdx].xp + xpGain,
            exercisesSolved: history[lastIdx].exercisesSolved + 1,
          };
        }

        set({
          totalXP: newTotalXP,
          totalPoints: state.totalPoints + xpGain,
          level: newLevel,
          currentLevelXP: newTotalXP % XP_PER_LEVEL,
          progressHistory: history,
        });

        if (leveledUp) {
          playSound('levelup', state.soundEnabled);
          if (newLevel >= 5 && newTotalXP >= 2000) {
            get().addBadge('grandmaster');
          }
        }

        return { leveledUp, newLevel };
      },

      addCorrectAnswer: (exerciseType?: string, difficulty?: string, moduleId?: string) => {
        const state = get();
        const newStreak = state.streak + 1;
        const newMaxStreak = Math.max(newStreak, state.maxStreak);
        const newCorrect = state.correctAnswers + 1;
        const newTotal = state.totalAttempts + 1;

        let hardCount = state.hardExercisesSolved;
        let dmCount = state.demorganSolved;
        let ttCount = state.truthTablesSolved;

        if (difficulty === 'hard') hardCount += 1;
        if (moduleId === 'demorgan' || exerciseType === 'boolean-simplification') dmCount += 1;
        if (exerciseType === 'truth-table') ttCount += 1;

        // Streak check
        if (newStreak >= 5) get().addBadge('streak_5');
        if (newStreak >= 10) get().addBadge('streak_10');
        if (newStreak >= 20) get().addBadge('streak_20');
        if (hardCount >= 3) get().addBadge('expert');
        if (dmCount >= 5) get().addBadge('demorgan_master');
        if (ttCount >= 3) get().addBadge('truth_table_pro');
        get().addBadge('first_step');

        // Base XP depends on difficulty
        let baseXP = 15;
        if (difficulty === 'medium') baseXP = 25;
        if (difficulty === 'hard') baseXP = 40;

        // Streak bonus multiplier
        let streakMultiplier = 1;
        if (newStreak >= 10) streakMultiplier = 2.0;
        else if (newStreak >= 5) streakMultiplier = 1.5;
        else if (newStreak >= 3) streakMultiplier = 1.2;

        set({
          correctAnswers: newCorrect,
          totalAttempts: newTotal,
          streak: newStreak,
          maxStreak: newMaxStreak,
          hardExercisesSolved: hardCount,
          demorganSolved: dmCount,
          truthTablesSolved: ttCount,
        });

        get().addXP(baseXP, streakMultiplier);
        playSound('correct', state.soundEnabled);
      },

      resetStreak: () => {
        const state = get();
        set({
          totalAttempts: state.totalAttempts + 1,
          streak: 0,
        });
        playSound('wrong', state.soundEnabled);
      },

      addBadge: (badgeId: string) => {
        const state = get();
        if (!state.badges.includes(badgeId)) {
          set({ badges: [...state.badges, badgeId] });
          playSound('badge', state.soundEnabled);
          return true;
        }
        return false;
      },

      completeLesson: (lessonId: string) => {
        const state = get();
        if (!state.completedLessons.includes(lessonId)) {
          const nextLessons = [...state.completedLessons, lessonId];
          set({ completedLessons: nextLessons });
          get().addXP(50);
          playSound('correct', state.soundEnabled);
          if (nextLessons.length >= 8) {
            get().addBadge('all_lessons');
          }
        }
      },

      recordCircuitBuilt: () => {
        const state = get();
        const next = state.circuitsBuiltCount + 1;
        set({ circuitsBuiltCount: next });
        if (next >= 1) {
          get().addBadge('circuit_architect');
        }
        get().addXP(30);
      },

      resetProgress: () =>
        set({
          totalXP: 0,
          level: 1,
          currentLevelXP: 0,
          totalPoints: 0,
          badges: ['first_step'],
          streak: 0,
          maxStreak: 0,
          completedLessons: [],
          totalAttempts: 0,
          correctAnswers: 0,
          hardExercisesSolved: 0,
          demorganSolved: 0,
          truthTablesSolved: 0,
          circuitsBuiltCount: 0,
          progressHistory: defaultHistory,
        }),
    }),
    {
      name: 'logic-gates-store-v2',
    }
  )
);
