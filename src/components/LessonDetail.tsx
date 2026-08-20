import React, { useState } from 'react';
import { Lesson } from '../types';
import { useGameStore } from '../store/gameStore';
import { GateSvg } from './GateSvg';
import { evaluateGate } from '../data/exercises';
import { ArrowLeft, CheckCircle2, Award, Zap, Lightbulb } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LessonDetailProps {
  lesson: Lesson;
  onBack: () => void;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ lesson, onBack }) => {
  const { completedLessons, completeLesson, language } = useGameStore();
  const isEl = language === 'el';
  const isCompleted = completedLessons.includes(lesson.id);

  // Interactive Live Simulator inside Lesson
  const [inputA, setInputA] = useState<number>(1);
  const [inputB, setInputB] = useState<number>(0);

  const demoGate = lesson.gateDemoType;
  const isSingleInput = demoGate === 'NOT' || demoGate === 'BUFFER';
  const liveOutput = demoGate ? evaluateGate(demoGate, inputA, isSingleInput ? 0 : inputB) : 0;

  const handleComplete = () => {
    completeLesson(lesson.id);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-semibold text-sm transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {isEl ? 'Πίσω στα Μαθήματα' : 'Back to Lessons'}
        </button>

        {isCompleted ? (
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            {isEl ? 'Ολοκληρώθηκε (+50 XP)' : 'Completed (+50 XP)'}
          </span>
        ) : (
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/30 hover:scale-105 transition-all"
          >
            <Award className="w-4 h-4" />
            {isEl ? 'Σημείωση ως Ολοκληρωμένο' : 'Mark as Completed'}
          </button>
        )}
      </div>

      {/* Hero Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white shadow-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-4xl border border-white/20 shadow-inner">
              {lesson.icon}
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-1">
                {lesson.difficulty} • {lesson.duration}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {isEl ? lesson.titleEl : lesson.title}
              </h1>
            </div>
          </div>
          <p className="text-slate-300 text-base max-w-2xl">
            {isEl ? lesson.descriptionEl : lesson.description}
          </p>
        </div>
      </div>

      {/* Interactive Gate Sandbox Widget (if applicable) */}
      {demoGate && (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {isEl ? 'Διαδραστικός Προσομοιωτής Πύλης' : 'Interactive Gate Simulator'}
            </h3>
            <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold border border-amber-500/20">
              Live Sandbox
            </span>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-col md:flex-row items-center justify-around gap-6">
            {/* Inputs */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-300 w-16">
                  {isEl ? 'Είσοδος A:' : 'Input A:'}
                </span>
                <button
                  onClick={() => setInputA(inputA === 1 ? 0 : 1)}
                  className={`px-4 py-2 rounded-xl font-mono font-bold text-base transition-all flex items-center gap-2 border ${
                    inputA === 1
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/40'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-current inline-block" />
                  {inputA === 1 ? '1 (HIGH)' : '0 (LOW)'}
                </button>
              </div>

              {!isSingleInput && (
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-300 w-16">
                    {isEl ? 'Είσοδος B:' : 'Input B:'}
                  </span>
                  <button
                    onClick={() => setInputB(inputB === 1 ? 0 : 1)}
                    className={`px-4 py-2 rounded-xl font-mono font-bold text-base transition-all flex items-center gap-2 border ${
                      inputB === 1
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/40'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-current inline-block" />
                    {inputB === 1 ? '1 (HIGH)' : '0 (LOW)'}
                  </button>
                </div>
              )}
            </div>

            {/* Gate Visualizer */}
            <div className="flex items-center gap-4 py-2 px-6 bg-slate-800/80 rounded-2xl border border-slate-700">
              <GateSvg type={demoGate} width={90} height={60} active={liveOutput === 1} />
            </div>

            {/* Live Output Bulb */}
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">
                {isEl ? 'Έξοδος (Y)' : 'Output (Y)'}
              </span>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center font-mono font-black text-2xl border-4 transition-all duration-300 ${
                  liveOutput === 1
                    ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_25px_rgba(16,185,129,0.7)] animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {liveOutput}
              </div>
              <span className="text-xs font-bold mt-2 text-slate-300">
                {liveOutput === 1 ? (isEl ? '💡 ΑΝΑΜΜΕΝΗ' : '💡 ON') : (isEl ? '⚫ ΣΒΗΣΤΗ' : '⚫ OFF')}
              </span>
            </div>
          </div>

          {/* Truth Table */}
          {lesson.truthTable && (
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-500" />
                {isEl ? 'Πίνακας Αληθείας (Truth Table)' : 'Truth Table'}
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm text-center">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      {lesson.truthTable.headers.map((h, i) => (
                        <th key={i} className="py-3 px-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono">
                    {lesson.truthTable.rows.map((row, rIdx) => {
                      const isCurrentActive =
                        !isSingleInput
                          ? row[0] === inputA && row[1] === inputB
                          : row[0] === inputA;
                      return (
                        <tr
                          key={rIdx}
                          className={`transition-colors ${
                            isCurrentActive
                              ? 'bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-extrabold'
                              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2.5 px-4">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lesson Content Body */}
      <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: isEl ? lesson.contentEl : lesson.contentEn,
          }}
        />
      </div>

      {/* Bottom Action Card */}
      <div className="p-6 bg-slate-100 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center text-2xl">
            🎓
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {isEl ? 'Ολοκλήρωση Μαθήματος' : 'Finish Lesson'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEl
                ? 'Κερδίστε 50 XP και ξεκλειδώστε το σήμα του Μελετητή!'
                : 'Earn 50 XP and unlock the Scholar badge!'}
            </p>
          </div>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
            isCompleted
              ? 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 cursor-default'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {isCompleted
            ? isEl
              ? 'Ολοκληρώθηκε ✓'
              : 'Completed ✓'
            : isEl
            ? 'Ολοκλήρωση (+50 XP)'
            : 'Complete (+50 XP)'}
        </button>
      </div>
    </div>
  );
};
