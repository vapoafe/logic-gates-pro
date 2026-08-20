import React, { useState, useEffect } from 'react';
import { getRandomExercise } from '../data/exercises';
import { ExerciseContainer } from '../components/ExerciseContainer';
import { useGameStore } from '../store/gameStore';
import { Exercise } from '../types';
import { Award, Zap, Timer, Flame, RefreshCw, Shuffle, Target, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Exercises: React.FC = () => {
  const { streak, correctAnswers, totalAttempts, language, addXP } = useGameStore();
  const isEl = language === 'el';

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentExercise, setCurrentExercise] = useState<Exercise>(() =>
    getRandomExercise('all', 'all')
  );

  // Timed Speed Challenge Mode
  const [isTimedMode, setIsTimedMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timedScore, setTimedScore] = useState<number>(0);
  const [timedFinished, setTimedFinished] = useState<boolean>(false);

  const modules = [
    { id: 'all', name: isEl ? 'Όλες οι Κατηγορίες' : 'All Topics' },
    { id: 'and-gate', name: isEl ? 'AND Πύλη' : 'AND Gate' },
    { id: 'or-gate', name: isEl ? 'OR Πύλη' : 'OR Gate' },
    { id: 'not-gate', name: isEl ? 'NOT Πύλη' : 'NOT Gate' },
    { id: 'xor-gate', name: isEl ? 'XOR Πύλη' : 'XOR Gate' },
    { id: 'nand-gate', name: isEl ? 'NAND Πύλη' : 'NAND Gate' },
    { id: 'nor-gate', name: isEl ? 'NOR Πύλη' : 'NOR Gate' },
    { id: 'demorgan', name: isEl ? 'De Morgan & Boole' : 'De Morgan & Boolean' },
  ];

  // Timer interval for Timed Mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimedMode && timeLeft > 0 && !timedFinished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimedFinished(true);
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch {
              // ignore
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimedMode, timeLeft, timedFinished]);

  const handleNextExercise = () => {
    const next = getRandomExercise(selectedModule, selectedDifficulty);
    setCurrentExercise(next);
    if (isTimedMode && !timedFinished) {
      setTimedScore((prev) => prev + 1);
    }
  };

  const handleModuleChange = (modId: string) => {
    setSelectedModule(modId);
    const next = getRandomExercise(modId, selectedDifficulty);
    setCurrentExercise(next);
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    const next = getRandomExercise(selectedModule, diff);
    setCurrentExercise(next);
  };

  const startTimedChallenge = () => {
    setIsTimedMode(true);
    setTimeLeft(60);
    setTimedScore(0);
    setTimedFinished(false);
    setCurrentExercise(getRandomExercise('all', 'all'));
  };

  const exitTimedMode = () => {
    setIsTimedMode(false);
    setTimeLeft(60);
    setTimedFinished(false);
  };

  const accuracy =
    totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold border border-white/10">
            <Target className="w-3.5 h-3.5" />
            <span>{isEl ? 'Πρακτική & Εξάσκηση' : 'Practice & Mastery'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isEl ? 'Διαδραστικές Ασκήσεις' : 'Interactive Exercises'}
          </h1>
          <p className="text-purple-200 text-sm max-w-lg">
            {isEl
              ? 'Εξασκηθείτε στην αξιολόγηση πυλών, στους πίνακες αληθείας και στην απλοποίηση εκφράσεων Boole.'
              : 'Solve gate evaluations, truth table puzzles, and boolean formula simplifications.'}
          </p>
        </div>

        {/* Live Performance Strip */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-purple-200 block">
              {isEl ? 'Σερί' : 'Streak'}
            </span>
            <span className="text-xl font-extrabold text-amber-300 flex items-center justify-center gap-0.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              {streak}
            </span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-purple-200 block">
              {isEl ? 'Ακρίβεια' : 'Accuracy'}
            </span>
            <span className="text-xl font-extrabold text-emerald-300">{accuracy}%</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-purple-200 block">
              {isEl ? 'Λυμένες' : 'Solved'}
            </span>
            <span className="text-xl font-extrabold text-white">{correctAnswers}</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher: Practice vs Timed Speed Challenge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => !isTimedMode && null}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            !isTimedMode
              ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 opacity-70 hover:opacity-100'
          }`}
          onClickCapture={exitTimedMode}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
              📚
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {isEl ? 'Ελεύθερη Εξάσκηση (Practice)' : 'Standard Practice'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEl ? 'Χωρίς χρονικό όριο, με επεξηγήσεις' : 'Untimed, detailed step-by-step solutions'}
              </p>
            </div>
          </div>
          {!isTimedMode && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        </div>

        <div
          onClick={startTimedChallenge}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            isTimedMode
              ? 'bg-gradient-to-br from-amber-500/10 to-rose-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-750 opacity-70 hover:opacity-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl font-bold">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                {isEl ? 'Πρόκληση 60 Δευτερολέπτων' : '60-Second Speed Quiz'}
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                  NEW
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEl ? 'Λύστε όσες περισσότερες μπορείτε σε 1 λεπτό!' : 'Solve as many as possible in 1 minute!'}
              </p>
            </div>
          </div>
          {isTimedMode && <Timer className="w-5 h-5 text-amber-500 animate-spin" />}
        </div>
      </div>

      {/* Timed Challenge Score Display if Active */}
      {isTimedMode && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-amber-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">
              {isEl ? 'Χρόνος που απομένει:' : 'Time Remaining:'}
            </span>
            <span
              className={`font-mono text-xl font-black px-2 py-0.5 rounded-lg ${
                timeLeft <= 10 ? 'bg-rose-600 text-white animate-ping' : 'bg-slate-800 text-amber-300'
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300">
              {isEl ? 'Σκορ Γύρου:' : 'Round Score:'}{' '}
              <strong className="text-emerald-400 font-mono text-base">{timedScore}</strong>
            </span>
            <button
              onClick={exitTimedMode}
              className="text-xs font-bold text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
            >
              {isEl ? 'Έξοδος' : 'Exit'}
            </button>
          </div>
        </div>
      )}

      {/* Timed Mode Finished Dialog */}
      {isTimedMode && timedFinished && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-indigo-950 text-white text-center space-y-4 border border-amber-500/40 shadow-2xl animate-in zoom-in-95">
          <div className="text-5xl">🏆</div>
          <h2 className="text-2xl sm:text-3xl font-black">
            {isEl ? 'Ο Χρόνος Τελείωσε!' : "Time's Up!"}
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto">
            {isEl
              ? `Εξαιρετική προσπάθεια! Ολοκληρώσατε επιτυχώς ${timedScore} ερωτήσεις και κερδίσατε ${
                  timedScore * 20
                } μπόνους XP!`
              : `Awesome job! You answered ${timedScore} questions correctly and earned ${
                  timedScore * 20
                } bonus XP!`}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={startTimedChallenge}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg hover:scale-105 transition-all"
            >
              {isEl ? 'Παίξε Ξανά ⚡' : 'Play Again ⚡'}
            </button>
            <button
              onClick={exitTimedMode}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
            >
              {isEl ? 'Επιστροφή στην Εξάσκηση' : 'Back to Practice'}
            </button>
          </div>
        </div>
      )}

      {/* Module & Difficulty Filter Bar (in standard practice mode) */}
      {!isTimedMode && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Module Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase shrink-0">
              {isEl ? 'Θέμα:' : 'Topic:'}
            </span>
            <div className="flex items-center gap-1.5">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleModuleChange(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedModule === m.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-650'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Shuffle */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={selectedDifficulty}
              onChange={(e) => handleDifficultyChange(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="all">{isEl ? 'Όλες οι Δυσκολίες' : 'All Difficulties'}</option>
              <option value="easy">{isEl ? 'Εύκολο' : 'Easy'}</option>
              <option value="medium">{isEl ? 'Μέτριο' : 'Medium'}</option>
              <option value="hard">{isEl ? 'Δύσκολο' : 'Hard'}</option>
            </select>

            <button
              onClick={handleNextExercise}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
              title={isEl ? 'Τυχαία Άσκηση' : 'Shuffle Exercise'}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Exercise Card */}
      {(!isTimedMode || (isTimedMode && !timedFinished)) && (
        <ExerciseContainer
          key={currentExercise.id}
          exercise={currentExercise}
          onNext={handleNextExercise}
        />
      )}
    </div>
  );
};
