import React, { useState, useEffect } from 'react';
import { Exercise } from '../types';
import { useGameStore } from '../store/gameStore';
import { GateSvg } from './GateSvg';
import { CheckCircle, XCircle, ArrowRight, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExerciseContainerProps {
  exercise: Exercise;
  onNext: () => void;
}

export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ exercise, onNext }) => {
  const { addCorrectAnswer, resetStreak, streak, language } = useGameStore();
  const isEl = language === 'el';

  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);

  // For Truth Table exercises: map of row index -> user selected output (0 or 1)
  const [tableAnswers, setTableAnswers] = useState<Record<number, number | null>>({});

  useEffect(() => {
    setAnswered(false);
    setSelectedOption(null);
    setIsCorrect(false);
    setTableAnswers({});
  }, [exercise.id]);

  const handleSelectOption = (option: string | number) => {
    if (answered) return;
    setSelectedOption(option);

    let correct = false;
    if (exercise.type === 'gate-evaluation') {
      correct = option === exercise.expectedOutput;
    } else if (exercise.type === 'boolean-simplification') {
      correct = option === exercise.correctAnswer;
    }

    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      addCorrectAnswer(exercise.type, exercise.difficulty, exercise.moduleId);
      if (streak + 1 >= 5 || exercise.difficulty === 'hard') {
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      }
    } else {
      resetStreak();
    }
  };

  const handleTableToggle = (rowIndex: number) => {
    if (answered) return;
    const curr = tableAnswers[rowIndex];
    const next = curr === 1 ? 0 : 1;
    setTableAnswers({ ...tableAnswers, [rowIndex]: next });
  };

  const verifyTruthTable = () => {
    if (!exercise.tableRows || answered) return;
    let allCorrect = true;
    exercise.tableRows.forEach((row, idx) => {
      const userVal = tableAnswers[idx];
      if (userVal !== row.expected) {
        allCorrect = false;
      }
    });

    setIsCorrect(allCorrect);
    setAnswered(true);

    if (allCorrect) {
      addCorrectAnswer(exercise.type, exercise.difficulty, exercise.moduleId);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch {
        // ignore
      }
    } else {
      resetStreak();
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'easy':
        return isEl ? 'Εύκολο' : 'Easy';
      case 'medium':
        return isEl ? 'Μέτριο' : 'Medium';
      case 'hard':
        return isEl ? 'Δύσκολο' : 'Hard';
      default:
        return diff;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header with Difficulty & Streak Bonus */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              exercise.difficulty === 'easy'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : exercise.difficulty === 'medium'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
            }`}
          >
            {getDifficultyBadge(exercise.difficulty)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {exercise.moduleId.toUpperCase()}
          </span>
        </div>

        {streak >= 3 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {streak}x Combo! (+{streak >= 10 ? '100%' : streak >= 5 ? '50%' : '20%'} Bonus XP)
            </span>
          </div>
        )}
      </div>

      {/* Main Question Body */}
      <div className="p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center leading-snug">
          {isEl ? exercise.questionEl : exercise.questionEn}
        </h2>

        {/* 1. Gate Evaluation Visual Display */}
        {exercise.type === 'gate-evaluation' && exercise.gate && exercise.inputs && (
          <div className="py-6 px-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            {/* Inputs Column */}
            <div className="flex flex-col gap-3">
              {Object.entries(exercise.inputs).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-400 w-6">
                    {key}:
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg border-2 ${
                      val === 1
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/50'
                    }`}
                  >
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Gate Diagram */}
            <div className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <GateSvg type={exercise.gate} width={100} height={60} active={false} />
            </div>

            {/* Output Target */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mb-1">
                {isEl ? 'Έξοδος' : 'Output'}
              </span>
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border-2 border-dashed border-indigo-500 dark:border-indigo-400/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-mono font-black text-2xl animate-pulse shadow-sm">
                ?
              </div>
            </div>
          </div>
        )}

        {/* 2. Boolean Simplification Expression */}
        {exercise.type === 'boolean-simplification' && exercise.expression && (
          <div className="py-8 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/70 dark:to-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-500/30 text-center shadow-inner">
            <span className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-300 font-bold mb-2 block">
              {isEl ? 'Λογική Έκφραση' : 'Boolean Expression'}
            </span>
            <div className="font-mono font-black text-3xl sm:text-4xl text-indigo-900 dark:text-indigo-200 tracking-wider">
              {exercise.expression}
            </div>
          </div>
        )}

        {/* 3. Interactive Truth Table Filler */}
        {exercise.type === 'truth-table' && exercise.tableRows && (
          <div className="space-y-4">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              {isEl
                ? 'Κάντε κλικ στα κελιά με το "?" για να ορίσετε 0 ή 1:'
                : 'Click on the "?" cells to set 0 or 1:'}
            </p>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <table className="w-full text-center text-sm">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    {exercise.tableHeaders?.map((h, i) => (
                      <th key={i} className="py-3 px-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-base">
                  {exercise.tableRows.map((row, idx) => {
                    const selectedVal = tableAnswers[idx];
                    const isAnswerSet = selectedVal !== undefined;
                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        {row.inputs.map((inp, inpIdx) => (
                          <td key={inpIdx} className="py-3 px-4 font-bold text-slate-800 dark:text-slate-300">
                            {inp}
                          </td>
                        ))}
                        <td className="py-3 px-4 bg-indigo-50/50 dark:bg-indigo-950/20">
                          {!answered ? (
                            <button
                              onClick={() => handleTableToggle(idx)}
                              className={`w-12 h-9 rounded-xl font-bold transition-all border ${
                                !isAnswerSet
                                  ? 'bg-white dark:bg-slate-800 border-dashed border-indigo-400 text-indigo-500 hover:border-indigo-600'
                                  : selectedVal === 1
                                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                                  : 'bg-slate-700 text-white border-slate-600 shadow-sm'
                              }`}
                            >
                              {isAnswerSet ? selectedVal : '?'}
                            </button>
                          ) : (
                            <span
                              className={`inline-block w-10 py-1.5 rounded-lg font-bold ${
                                selectedVal === row.expected
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {selectedVal ?? 'X'} ({row.expected})
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!answered && (
              <button
                onClick={verifyTruthTable}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/30 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                {isEl ? 'Έλεγχος Πίνακα Αληθείας' : 'Verify Truth Table'}
              </button>
            )}
          </div>
        )}

        {/* Multiple Choice Options (Gate eval & Boolean) */}
        {!answered && exercise.type !== 'truth-table' && exercise.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {exercise.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-750 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 font-mono font-bold text-lg text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:scale-[1.02] shadow-sm active:scale-95"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Feedback Section */}
        {answered && (
          <div
            className={`p-6 rounded-2xl border-2 transition-all space-y-4 animate-in fade-in slide-in-from-bottom-2 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600/60 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-600/60 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-500 shrink-0" />
              )}
              <div>
                <h3 className="font-extrabold text-lg">
                  {isCorrect
                    ? isEl
                      ? 'Συγχαρητήρια! Σωστή Απάντηση! 🎉'
                      : 'Excellent! Correct Answer! 🎉'
                    : isEl
                    ? 'Δεν πειράζει, προσπάθησε ξανά! 💪'
                    : 'Not quite, keep practicing! 💪'}
                </h3>
                <p className="text-sm opacity-90 mt-0.5">
                  {isEl ? exercise.explanationEl : exercise.explanationEn}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onNext}
                className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-md hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>{isEl ? 'Επόμενη Άσκηση' : 'Next Exercise'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
