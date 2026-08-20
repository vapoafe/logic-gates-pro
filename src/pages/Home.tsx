import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GateSvg } from '../components/GateSvg';
import { evaluateGate } from '../data/exercises';
import { GateType } from '../types';
import {
  BookOpen,
  Award,
  Wrench,
  User,
  Zap,
  Flame,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Shield,
  Layers,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const {
    username,
    level,
    totalPoints,
    streak,
    badges,
    completedLessons,
    language,
    currentLevelXP,
  } = useGameStore();

  const isEl = language === 'el';

  // Interactive Quick Sandbox on Hero
  const [quickGate, setQuickGate] = useState<GateType>('XOR');
  const [quickA, setQuickA] = useState<number>(1);
  const [quickB, setQuickB] = useState<number>(0);
  const quickOutput = evaluateGate(quickGate, quickA, quickGate === 'NOT' ? 0 : quickB);

  const availableQuickGates: GateType[] = ['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR', 'XNOR'];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner with Interactive Logic Gate Playground */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 sm:p-10 text-white shadow-2xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEl ? 'Διαδραστική Εκμάθηση Λογικής' : 'Interactive Logic Learning'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              {isEl ? (
                <>
                  Κατάκτησε τις <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Λογικές Πύλες</span> & την Άλγεβρα Boole
                </>
              ) : (
                <>
                  Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Logic Gates</span> & Boolean Algebra
                </>
              )}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              {isEl
                ? 'Μάθετε διαδραστικά πώς σκέφτονται οι υπολογιστές, σχεδιάστε πραγματικά ψηφιακά κυκλώματα και λύστε προκλήσεις κερδίζοντας XP!'
                : 'Learn how computers compute, simulate digital circuits in real-time, and solve challenges to earn XP and level up!'}
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('lessons')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isEl ? 'Ξεκίνα τα Μαθήματα' : 'Start Lessons'}</span>
              </button>

              <button
                onClick={() => onNavigate('designer')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 font-bold text-sm transition-all flex items-center gap-2"
              >
                <Wrench className="w-4 h-4 text-indigo-400" />
                <span>{isEl ? 'Σχεδιαστής Κυκλωμάτων' : 'Circuit Designer'}</span>
              </button>
            </div>
          </div>

          {/* Right Live Interactive Playground Card */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {isEl ? 'Δοκιμή Πύλης (Live Sandbox)' : 'Live Gate Sandbox'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Interactive
                </span>
              </div>

              {/* Gate Selectors */}
              <div className="flex flex-wrap gap-1.5">
                {availableQuickGates.map((g) => (
                  <button
                    key={g}
                    onClick={() => setQuickGate(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      quickGate === g
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 scale-105'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Gate Interactive Simulation Box */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                {/* Inputs */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setQuickA(quickA === 1 ? 0 : 1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      quickA === 1
                        ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    A: {quickA}
                  </button>
                  {quickGate !== 'NOT' && (
                    <button
                      onClick={() => setQuickB(quickB === 1 ? 0 : 1)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                        quickB === 1
                          ? 'bg-emerald-600 border-emerald-400 text-white shadow-md'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      B: {quickB}
                    </button>
                  )}
                </div>

                {/* Gate SVG */}
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <GateSvg type={quickGate} width={75} height={45} active={quickOutput === 1} />
                </div>

                {/* Output Bulb */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                    {isEl ? 'Έξοδος' : 'Output'}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-mono font-black text-lg border-2 transition-all ${
                      quickOutput === 1
                        ? 'bg-emerald-500 border-emerald-300 text-white shadow-[0_0_15px_#22c55e]'
                        : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}
                  >
                    {quickOutput}
                  </div>
                </div>
              </div>

              <div className="text-center font-mono text-xs text-indigo-300 font-bold bg-indigo-950/40 py-1.5 rounded-lg border border-indigo-500/20">
                {quickGate === 'NOT'
                  ? `NOT(${quickA}) = ${quickOutput}`
                  : `${quickA} ${quickGate} ${quickB} = ${quickOutput}`}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Progression Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">
              {isEl ? 'Επίπεδο' : 'Level'}
            </span>
            <div className="text-2xl font-extrabold text-white mt-0.5">Lv. {level}</div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-indigo-400"
                style={{ width: `${(currentLevelXP / 500) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">
              {isEl ? 'Συνολικό XP' : 'Total XP'}
            </span>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">⭐ {totalPoints}</div>
            <span className="text-[10px] text-slate-400">{isEl ? 'Πόντοι εμπειρίας' : 'Points earned'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">
              {isEl ? 'Σερί Σωστών' : 'Current Streak'}
            </span>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5 flex items-center gap-1">
              <Flame className="w-6 h-6 text-rose-400 fill-rose-400" />
              {streak}
            </div>
            <span className="text-[10px] text-slate-400">{isEl ? 'Συνεχόμενες σωστές' : 'In a row'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">
              {isEl ? 'Σήματα & Επιτεύγματα' : 'Badges Earned'}
            </span>
            <div className="text-2xl font-extrabold text-purple-400 mt-0.5">🏆 {badges.length}</div>
            <span className="text-[10px] text-slate-400">{isEl ? 'Ξεκλειδωμένα' : 'Unlocked'}</span>
          </div>
        </div>
      </div>

      {/* Main Feature Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Lessons Card */}
        <div
          onClick={() => onNavigate('lessons')}
          className="group relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-indigo-500/5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              📚
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {isEl ? 'Μαθήματα' : 'Lessons'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {isEl
                ? 'Μάθετε AND, OR, NOT, XOR, NAND, NOR, De Morgan με διαδραστικά γραφήματα.'
                : 'Learn AND, OR, NOT, XOR, NAND, NOR and De Morgan with step-by-step guides.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              {completedLessons.length} / 10 {isEl ? 'ολοκληρωμένα' : 'completed'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Exercises Card */}
        <div
          onClick={() => onNavigate('exercises')}
          className="group relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-purple-500/5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {isEl ? 'Ασκήσεις & Quiz' : 'Exercises & Quiz'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {isEl
                ? 'Εξασκηθείτε με πίνακες αληθείας, απλοποιήσεις εκφράσεων και άπειρα κουίζ.'
                : 'Solve truth tables, formula simplifications, and evaluate gate outputs for XP.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              {isEl ? 'Κερδίστε XP & Σερί' : 'Earn XP & Streaks'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Designer Card */}
        <div
          onClick={() => onNavigate('designer')}
          className="group relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-emerald-500/5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🛠️
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {isEl ? 'Σχεδιαστής Κυκλωμάτων' : 'Circuit Designer'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {isEl
                ? 'Συνδέστε πύλες, λάμπες LED, διακόπτες και δημιουργήστε σύνθετα κυκλώματα.'
                : 'Drag, connect wires, toggle inputs, and test digital logic circuits in real-time.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {isEl ? 'Sandbox & Προσομοιωτής' : 'Sandbox Simulator'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Profile Card */}
        <div
          onClick={() => onNavigate('profile')}
          className="group relative p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-300 hover:-translate-y-1.5 shadow-lg shadow-pink-500/5 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {isEl ? 'Προφίλ & Σήματα' : 'Profile & Badges'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {isEl
                ? 'Δείτε τα αναλυτικά στατιστικά σας, τα σήματα που κερδίσατε και την ακρίβεια.'
                : 'Track your growth, weekly XP progress, unlocked achievements and stats.'}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
              {badges.length} {isEl ? 'σήματα' : 'badges'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isEl ? 'Γιατί να μάθετε με το Logic Gates Pro;' : 'Why Learn with Logic Gates Pro?'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isEl
              ? 'Σχεδιασμένο για μαθητές, φοιτητές πληροφορικής και μηχανικούς.'
              : 'Engineered for students, computer scientists, and digital electronics enthusiasts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl">
              🎮
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {isEl ? 'Παιχνιδοποίηση (Gamification)' : 'Gamified Learning'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEl
                ? 'Κερδίστε πόντους XP, αυξήστε το σερί σας και ξεκλειδώστε μοναδικά σήματα επιτευγμάτων.'
                : 'Level up from Novice to Grandmaster, maintain daily streaks, and collect badges.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {isEl ? 'Προσομοίωση σε Πραγματικό Χρόνο' : 'Real-Time Logic Simulation'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEl
                ? 'Δείτε τα σήματα 0 και 1 να διαδίδονται μέσα από καλώδια και πύλες σε πραγματικό χρόνο.'
                : 'Watch electrical logic signals travel through glowing wires and update outputs on the fly.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl">
              📐
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              {isEl ? 'Άλγεβρα Boole & De Morgan' : 'Boolean Algebra & De Morgan'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEl
                ? 'Μάθετε θεωρήματα απλοποίησης, πίνακες αληθείας και πώς συνδέονται με τον σχεδιασμό chip.'
                : 'Master boolean transformation identities, absorption laws, and universal NAND/NOR logic.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
