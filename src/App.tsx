/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Lessons } from './pages/Lessons';
import { Exercises } from './pages/Exercises';
import { CircuitDesignerPage } from './pages/CircuitDesignerPage';
import { Profile } from './pages/Profile';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const { initializeUser, username, language } = useGameStore();
  const isEl = language === 'el';

  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'lessons', 'exercises', 'designer', 'profile'].includes(hash)) {
      return hash;
    }
    return 'home';
  });

  // Handle hash change
  useEffect(() => {
    initializeUser();
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'lessons', 'exercises', 'designer', 'profile'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top Sticky Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && <Home onNavigate={handleTabChange} />}
        {activeTab === 'lessons' && <Lessons />}
        {activeTab === 'exercises' && <Exercises />}
        {activeTab === 'designer' && <CircuitDesignerPage />}
        {activeTab === 'profile' && <Profile />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 py-8 text-center text-xs text-slate-500 dark:text-slate-400 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Logic Gates Pro</span>
            <span>— {isEl ? 'Διαδραστική Εκμάθηση Λογικών Πυλών' : 'Interactive Logic Gates Academy'}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <button onClick={() => handleTabChange('lessons')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              {isEl ? 'Μαθήματα' : 'Lessons'}
            </button>
            <button onClick={() => handleTabChange('exercises')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              {isEl ? 'Ασκήσεις' : 'Exercises'}
            </button>
            <button onClick={() => handleTabChange('designer')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              {isEl ? 'Σχεδιαστής' : 'Designer'}
            </button>
            <button onClick={() => handleTabChange('profile')} className="hover:text-indigo-600 dark:hover:text-white transition-colors">
              {isEl ? 'Προφίλ' : 'Profile'}
            </button>
          </div>

          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
            <span>{isEl ? 'Φτιαγμένο για σπουδαστές ψηφιακής λογικής' : 'Built for digital logic learners'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
