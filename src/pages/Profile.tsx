import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { BadgeDisplay } from '../components/BadgeDisplay';
import { ProgressChart } from '../components/ProgressChart';
import {
  User,
  Award,
  Flame,
  Target,
  Wrench,
  CheckCircle2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Shield,
  BookOpen,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Profile: React.FC = () => {
  const {
    username,
    setUsername,
    avatar,
    setAvatar,
    level,
    totalXP,
    currentLevelXP,
    totalPoints,
    streak,
    maxStreak,
    badges,
    completedLessons,
    totalAttempts,
    correctAnswers,
    hardExercisesSolved,
    circuitsBuiltCount,
    resetProgress,
    language,
  } = useGameStore();

  const isEl = language === 'el';

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const availableAvatars = ['👨‍💻', '👩‍💻', '🤖', '🧙‍♂️', '⚡', '🚀', '🧠', '👑', '🔬', '🎓'];

  const getRankTitle = (lvl: number) => {
    if (lvl >= 10) return isEl ? '👑 Μέγας Δάσκαλος Boole' : '👑 Grandmaster of Boolean';
    if (lvl >= 7) return isEl ? '⚡ Αρχιμηχανικός Κυκλωμάτων' : '⚡ Master Circuit Engineer';
    if (lvl >= 5) return isEl ? '🧠 Ειδικός Ψηφιακής Λογικής' : '🧠 Digital Logic Specialist';
    if (lvl >= 3) return isEl ? '🛠️ Ειδικευόμενος Σχεδιαστής' : '🛠️ Circuit Apprentice';
    return isEl ? '🌱 Αρχάριος Μαθητής' : '🌱 Logic Novice';
  };

  const handleSaveName = () => {
    setUsername(tempName);
    setIsEditingName(false);
  };

  const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
  const nextLevelProgress = Math.min(100, Math.round((currentLevelXP / 500) * 100));

  const handleClaimCertificate = () => {
    setShowCertificate(true);
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar with selector */}
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-5xl">
                {avatar}
              </div>
            </div>

            {/* Quick Avatar Picker */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
              {availableAvatars.slice(0, 5).map((av) => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`w-6 h-6 rounded-lg text-sm flex items-center justify-center transition-all ${
                    avatar === av ? 'bg-indigo-500 scale-110' : 'hover:bg-white/20'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="px-3 py-1 bg-slate-800 border border-indigo-400 rounded-xl text-lg font-bold text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black">{username}</h1>
                  <button
                    onClick={() => {
                      setTempName(username);
                      setIsEditingName(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    title={isEl ? 'Επεξεργασία ονόματος' : 'Edit name'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                {getRankTitle(level)}
              </span>
            </div>

            {/* Level & XP Progress Bar */}
            <div className="space-y-1.5 max-w-md">
              <div className="flex items-center justify-between text-xs text-indigo-200 font-semibold">
                <span>
                  {isEl ? 'Επίπεδο' : 'Level'} {level}
                </span>
                <span>
                  {currentLevelXP} / 500 XP ({nextLevelProgress}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${nextLevelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Certificate Claim Button */}
          <div className="shrink-0">
            <button
              onClick={handleClaimCertificate}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>{isEl ? 'Πιστοποιητικό Boole' : 'Logic Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <span className="text-xs uppercase font-bold text-slate-400">
            {isEl ? 'Συνολικό XP' : 'Total XP'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            ⭐ {totalPoints}
          </div>
          <span className="text-[11px] text-slate-500">{isEl ? 'Πόντοι γνώσης' : 'Earned points'}</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <span className="text-xs uppercase font-bold text-slate-400">
            {isEl ? 'Ρεκόρ Σερί' : 'Max Streak'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 fill-amber-500" />
            {maxStreak}
          </div>
          <span className="text-[11px] text-slate-500">
            {isEl ? 'Καλύτερο σερί σωστών' : 'Best consecutive'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <span className="text-xs uppercase font-bold text-slate-400">
            {isEl ? 'Ακρίβεια' : 'Accuracy'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {accuracy}%
          </div>
          <span className="text-[11px] text-slate-500">
            {correctAnswers} / {totalAttempts} {isEl ? 'σωστά' : 'correct'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <span className="text-xs uppercase font-bold text-slate-400">
            {isEl ? 'Μαθήματα' : 'Lessons'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {completedLessons.length} / 10
          </div>
          <span className="text-[11px] text-slate-500">
            {isEl ? 'Ολοκληρωμένα' : 'Completed'}
          </span>
        </div>
      </div>

      {/* Progress Analytics Chart */}
      <ProgressChart />

      {/* Badges & Achievements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              {isEl ? 'Σήματα & Επιτεύγματα' : 'Badges & Achievements'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {badges.length} / 10 {isEl ? 'ξεκλειδωμένα σήματα' : 'badges unlocked'}
            </p>
          </div>
        </div>

        <BadgeDisplay />
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-rose-900 dark:text-rose-300">
            {isEl ? 'Επαναφορά Προόδου' : 'Reset All Progress'}
          </h4>
          <p className="text-xs text-rose-700/80 dark:text-rose-400/80">
            {isEl
              ? 'Επαναφέρει το XP, το επίπεδο, τις ασκήσεις και τα σήματα στην αρχική κατάσταση.'
              : 'Resets your level, points, streaks, badges and history to zero.'}
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {isEl ? 'Επαναφορά Όλων' : 'Reset All'}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isEl ? 'Είστε σίγουροι;' : 'Are you sure?'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isEl
                ? 'Όλα τα στατιστικά, το XP και τα σήματα θα χαθούν οριστικά.'
                : 'All your stats, unlocked badges and completed lessons will be permanently cleared.'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200"
              >
                {isEl ? 'Ακύρωση' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white"
              >
                {isEl ? 'Ναι, Επαναφορά' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl max-w-2xl w-full p-8 border-4 border-amber-400/80 shadow-2xl relative space-y-6 animate-in zoom-in-95 text-center">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-amber-400/20">
              👑
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold">
                Logic Gates Academy • Certificate of Achievement
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                {isEl ? 'Πιστοποιητικό Εξειδίκευσης Boole' : 'Boolean Logic Certificate'}
              </h2>
            </div>

            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {isEl
                ? `Απονέμεται στον/στην ${username} για την εξαιρετική κατανόηση των Λογικών Πυλών, των κανόνων De Morgan και της σχεδίασης ψηφιακών κυκλωμάτων με συνολικό σκορ ${totalPoints} XP!`
                : `Presented to ${username} for exemplary mastery of Digital Logic Gates, De Morgan Theorems, and Circuit Design with ${totalPoints} total XP!`}
            </p>

            <div className="flex items-center justify-center gap-6 py-4 border-y border-white/10 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">{isEl ? 'Επίπεδο:' : 'Level:'}</span>
                <span className="font-bold text-amber-300 text-sm">Lv. {level}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isEl ? 'Σήματα:' : 'Badges:'}</span>
                <span className="font-bold text-emerald-300 text-sm">{badges.length}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{isEl ? 'Ακρίβεια:' : 'Accuracy:'}</span>
                <span className="font-bold text-indigo-300 text-sm">{accuracy}%</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg"
            >
              {isEl ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
