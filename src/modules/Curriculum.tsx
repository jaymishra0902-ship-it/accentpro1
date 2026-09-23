import { useState } from 'react';
import { GraduationCap, CheckCircle2, Circle, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { curriculum } from '@/data/content';
import type { Level } from '@/types';

const levelGroups: { level: Level; label: string; color: string }[] = [
  { level: 'A1', label: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200' },
  { level: 'A2', label: 'Elementary', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { level: 'B1', label: 'Intermediate', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { level: 'B2', label: 'Upper Intermediate', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { level: 'C1', label: 'Advanced', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { level: 'C2', label: 'Native Master', color: 'bg-zinc-900 text-white border-zinc-900' },
];

export function Curriculum() {
  const { completedLessons, setCompletedLessons, user } = useApp();
  const [activeLevel, setActiveLevel] = useState<Level>(user?.level ?? 'B1');

  const lessonsForLevel = curriculum.filter((l) => l.level === activeLevel);
  const levelMeta = levelGroups.find((g) => g.level === activeLevel)!;

  const toggleComplete = (id: string) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((l) => l !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  return (
    <div>
      <PageHeader
        title="Level-Wise Curriculum"
        description="Structured step-by-step modules from A1 Beginner to C2 Native Master."
        icon={<GraduationCap className="w-7 h-7 text-zinc-400" />}
      />

      {/* Level tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {levelGroups.map((g) => {
          const lessons = curriculum.filter((l) => l.level === g.level);
          const done = lessons.filter((l) => completedLessons.includes(l.id)).length;
          return (
            <button
              key={g.level}
              onClick={() => setActiveLevel(g.level)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-semibold transition-all ${
                activeLevel === g.level
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <span className="font-mono">{g.level}</span>
              <span className="hidden sm:inline">{g.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeLevel === g.level ? 'bg-white/20' : 'bg-zinc-100'}`}>
                {done}/{lessons.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Level header */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${levelMeta.color}`}>
          {activeLevel} — {levelMeta.label}
        </span>
      </div>

      {/* Lessons */}
      <div className="grid sm:grid-cols-2 gap-4">
        {lessonsForLevel.map((lesson, idx) => {
          const isDone = completedLessons.includes(lesson.id);
          const prevId = idx > 0 ? lessonsForLevel[idx - 1].id : null;
          const isLocked = prevId !== null && !completedLessons.includes(prevId) && !isDone;

          return (
            <Card key={lesson.id} className={`p-5 ${isLocked ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {isLocked ? (
                    <Lock className="w-5 h-5 text-zinc-400" />
                  ) : isDone ? (
                    <button onClick={() => toggleComplete(lesson.id)}>
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </button>
                  ) : (
                    <button onClick={() => toggleComplete(lesson.id)}>
                      <Circle className="w-5 h-5 text-zinc-300 hover:text-zinc-500" />
                    </button>
                  )}
                  <span className="text-xs font-mono text-zinc-400">
                    Lesson {idx + 1}
                  </span>
                </div>
                {isDone && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-black mb-1">{lesson.title}</h3>
              <p className="text-sm text-zinc-500 mb-3">{lesson.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {lesson.topics.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs px-2 py-1 rounded-md bg-zinc-100 text-zinc-600 font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              {!isLocked && (
                <button
                  onClick={() => toggleComplete(lesson.id)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-black hover:gap-2.5 transition-all"
                >
                  {isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
