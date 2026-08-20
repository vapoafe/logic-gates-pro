import React from 'react';
import { Lesson } from '../types';
import { useGameStore } from '../store/gameStore';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onClick }) => {
  const { completedLessons, language } = useGameStore();
  const isEl = language === 'el';
  const isCompleted = completedLessons.includes(lesson.id);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
      case 'Intermediate':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Advanced':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30';
    }
  };

  const difficultyLabel = () => {
    if (!isEl) return lesson.difficulty;
    switch (lesson.difficulty) {
      case 'Beginner': return 'Αρχάριος';
      case 'Intermediate': return 'Ενδιάμεσο';
      case 'Advanced': return 'Προχωρημένο';
      default: return lesson.difficulty;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between p-6 bg-white dark:bg-slate-800/90 rounded-2xl border transition-all duration-300 cursor-pointer hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10 ${
        isCompleted
          ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-500/60'
      }`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
            {lesson.icon}
          </div>
          {isCompleted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isEl ? 'Ολοκληρώθηκε' : 'Completed'}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              +50 XP
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {isEl ? lesson.titleEl : lesson.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {isEl ? lesson.descriptionEl : lesson.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getDifficultyBadge(lesson.difficulty)}`}>
          {difficultyLabel()}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{lesson.duration}</span>
        </div>
      </div>
    </div>
  );
};
