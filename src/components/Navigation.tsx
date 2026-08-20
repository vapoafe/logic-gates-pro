import React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  Volume2,
  VolumeX,
  Flame,
  Award,
  BookOpen,
  Wrench,
  User,
  Home as HomeIcon,
  Sun,
  Moon,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const {
    username,
    level,
    totalPoints,
    streak,
    avatar,
    language,
    setLanguage,
    soundEnabled,
    toggleSound,
    theme,
    toggleTheme,
    currentLevelXP,
  } = useGameStore();

  const isEl = language === 'el';

  const navItems = [
    { id: 'home', label: isEl ? 'Αρχική' : 'Home', icon: HomeIcon },
    { id: 'lessons', label: isEl ? 'Μαθήματα' : 'Lessons', icon: BookOpen },
    { id: 'exercises', label: isEl ? 'Ασκήσεις' : 'Exercises', icon: Award },
    { id: 'designer', label: isEl ? 'Σχεδιαστής' : 'Designer', icon: Wrench },
    { id: 'profile', label: isEl ? 'Προφίλ' : 'Profile', icon: User },
  ];

  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / 500) * 100));

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm dark:shadow-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform text-white">
              ⚡
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-200 dark:via-white dark:to-purple-200">
                Logic Gates Pro
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
                Academy
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Controls / Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                streak > 0
                  ? 'bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
              title={isEl ? `Τρέχον σερί: ${streak} σωστές απαντήσεις` : `Current Streak: ${streak} correct answers`}
            >
              <Flame className={`w-4 h-4 ${streak > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>{streak}</span>
            </div>

            {/* Level & XP */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-inner group"
              title={isEl ? `Επίπεδο ${level} - ${currentLevelXP}/500 XP για το επόμενο` : `Level ${level} - ${currentLevelXP}/500 XP to next`}
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-500/50 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                {level}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                  ⭐ {totalPoints} XP
                </span>
                <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${levelProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all border border-slate-200 dark:border-slate-700"
              title={theme === 'dark' ? (isEl ? 'Αλλαγή σε φωτεινό θέμα' : 'Switch to Light mode') : (isEl ? 'Αλλαγή σε σκούρο θέμα' : 'Switch to Dark mode')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
              title={soundEnabled ? (isEl ? 'Σίγαση ήχων' : 'Mute sound') : (isEl ? 'Ενεργοποίηση ήχων' : 'Enable sound')}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
              title={isEl ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            >
              {language === 'el' ? '🇬🇷 EL' : '🇬🇧 EN'}
            </button>

            {/* User Profile Pill */}
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <span className="text-lg">{avatar}</span>
              <span className="hidden xl:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                {username}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-semibold ${
                  active ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
