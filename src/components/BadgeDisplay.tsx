import React from 'react';
import { allBadges } from '../data/badges';
import { useGameStore } from '../store/gameStore';
import { Lock, Check } from 'lucide-react';

export const BadgeDisplay: React.FC = () => {
  const { badges, language } = useGameStore();
  const isEl = language === 'el';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {allBadges.map((badge) => {
        const isUnlocked = badges.includes(badge.id);

        return (
          <div
            key={badge.id}
            className={`relative p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
              isUnlocked
                ? 'bg-white dark:bg-slate-800 border-indigo-500/30 shadow-lg shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-500'
                : 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60'
            }`}
          >
            {/* Icon */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-inner ${
                isUnlocked
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
                  : 'bg-slate-200 dark:bg-slate-700 grayscale'
              }`}
            >
              {badge.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {isEl ? badge.nameEl : badge.name}
                </h4>
                {isUnlocked ? (
                  <span className="flex items-center gap-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    {isEl ? 'Κερδήθηκε' : 'Unlocked'}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400">
                    <Lock className="w-3 h-3" />
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {isEl ? badge.descriptionEl : badge.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
