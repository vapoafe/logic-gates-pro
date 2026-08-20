import React, { useState } from 'react';
import { lessons } from '../data/lessons';
import { LessonCard } from '../components/LessonCard';
import { LessonDetail } from '../components/LessonDetail';
import { useGameStore } from '../store/gameStore';
import { Lesson } from '../types';
import { BookOpen, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

export const Lessons: React.FC = () => {
  const { completedLessons, language } = useGameStore();
  const isEl = language === 'el';

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: isEl ? 'Όλα τα Μαθήματα' : 'All Lessons' },
    { id: 'basics', label: isEl ? 'Βασικές Έννοιες' : 'Basics' },
    { id: 'gates', label: isEl ? 'Λογικές Πύλες' : 'Logic Gates' },
    { id: 'boolean', label: isEl ? 'Άλγεβρα Boole' : 'Boolean Algebra' },
    { id: 'circuits', label: isEl ? 'Κυκλώματα' : 'Circuits' },
  ];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesCategory = selectedCategory === 'all' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    const matchesSearch =
      searchQuery.trim() === '' ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.titleEl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.descriptionEl.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const completionPercent = Math.round((completedLessons.length / lessons.length) * 100);

  if (selectedLesson) {
    return <LessonDetail lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold border border-white/10">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isEl ? 'Πρόγραμμα Σπουδών' : 'Curriculum'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {isEl ? 'Μαθήματα Λογικών Πυλών' : 'Logic Gate Lessons'}
          </h1>
          <p className="text-indigo-200 text-sm max-w-xl">
            {isEl
              ? 'Ανακαλύψτε τις πύλες AND, OR, NOT, XOR, NAND, NOR, XNOR και τους κανόνες De Morgan με διαδραστικά παραδείγματα.'
              : 'Explore logic gates, De Morgan theorems, and arithmetic adders with live interactive testers.'}
          </p>
        </div>

        {/* Progress Box */}
        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[200px] shrink-0">
          <span className="text-xs font-bold text-indigo-200">
            {isEl ? 'Πρόοδος Μαθημάτων' : 'Course Progress'}
          </span>
          <div className="text-3xl font-extrabold my-1">{completionPercent}%</div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-indigo-300">
            {completedLessons.length} / {lessons.length} {isEl ? 'ολοκληρωμένα' : 'completed'}
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Difficulty Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEl ? 'Αναζήτηση...' : 'Search lessons...'}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">{isEl ? 'Όλες οι Δυσκολίες' : 'All Difficulties'}</option>
            <option value="Beginner">{isEl ? 'Αρχάριος' : 'Beginner'}</option>
            <option value="Intermediate">{isEl ? 'Ενδιάμεσο' : 'Intermediate'}</option>
            <option value="Advanced">{isEl ? 'Προχωρημένο' : 'Advanced'}</option>
          </select>
        </div>
      </div>

      {/* Lessons Grid */}
      {filteredLessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onClick={() => setSelectedLesson(lesson)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-500 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">
            {isEl ? 'Δεν βρέθηκαν μαθήματα' : 'No lessons found'}
          </h3>
          <p className="text-xs">
            {isEl
              ? 'Δοκιμάστε διαφορετικά φίλτρα ή λέξη-κλειδί αναζήτησης.'
              : 'Try clearing your filters or changing your search terms.'}
          </p>
        </div>
      )}
    </div>
  );
};
