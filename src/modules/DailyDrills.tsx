import { useState } from 'react';
import { Repeat, Flame, Timer, RotateCcw, Volume2, Trophy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { tongueTwisters } from '@/data/content';

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-50 text-green-700 border-green-100' },
  medium: { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  hard: { label: 'Hard', color: 'bg-red-50 text-red-700 border-red-100' },
};

export function DailyDrills() {
  const { user } = useApp();
  const [activeId, setActiveId] = useState(tongueTwisters[0].id);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const active = tongueTwisters.find((t) => t.id === activeId)!;
  const cfg = difficultyConfig[active.difficulty];

  const startTimer = () => {
    setIsRunning(true);
    setElapsed(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const sec = (Date.now() - start) / 1000;
      setElapsed(sec);
      if (sec >= 30) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 100);
  };

  const recordAttempt = () => {
    setIsRunning(false);
    const time = elapsed;
    setAttempts((prev) => ({ ...prev, [activeId]: (prev[activeId] ?? 0) + 1 }));
    setBestTimes((prev) => {
      const current = prev[activeId];
      if (!current || time < current) return { ...prev, [activeId]: time };
      return prev;
    });
  };

  const reset = () => {
    setIsRunning(false);
    setElapsed(0);
  };

  const speak = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(active.text);
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const totalAttempts = Object.values(attempts).reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader
        title="Daily Accent Drills & Tongue Twisters"
        description="High-speed speech challenges with streak tracking and replay buttons."
        icon={<Repeat className="w-7 h-7 text-zinc-400" />}
      />

      {/* Stats bar */}
      <div className="flex gap-3 mb-6">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{user?.streak ?? 0}</p>
            <p className="text-xs text-zinc-400">Day streak</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-zinc-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-black">{totalAttempts}</p>
            <p className="text-xs text-zinc-400">Total attempts</p>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Twister list */}
        <div className="space-y-2">
          {tongueTwisters.map((t) => {
            const cfg = difficultyConfig[t.difficulty];
            return (
              <Card
                key={t.id}
                onClick={() => { setActiveId(t.id); reset(); }}
                className={`p-3.5 ${activeId === t.id ? 'border-black ring-1 ring-black' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  {bestTimes[t.id] && (
                    <span className="text-xs font-mono text-zinc-400">
                      {bestTimes[t.id].toFixed(1)}s
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-700 line-clamp-2">{t.text}</p>
                <p className="text-xs text-zinc-400 mt-1">Focus: {t.focusSound}</p>
              </Card>
            );
          })}
        </div>

        {/* Active drill */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color}`}>
                {cfg.label}
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                Focus: {active.focusSound}
              </span>
            </div>

            <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-100 mb-5 text-center">
              <p className="text-xl sm:text-2xl font-bold text-black leading-snug">
                {active.text}
              </p>
            </div>

            {/* Timer display */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <Timer className="w-5 h-5 text-zinc-400" />
              <span className="text-3xl font-bold font-mono text-black">
                {elapsed.toFixed(1)}s
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={speak}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Play
              </button>
              {!isRunning ? (
                <button
                  onClick={startTimer}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
                >
                  <Timer className="w-4 h-4" />
                  Start Timer
                </button>
              ) : (
                <button
                  onClick={recordAttempt}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
                >
                  <Trophy className="w-4 h-4" />
                  Record Attempt
                </button>
              )}
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Attempt info */}
            {attempts[activeId] && (
              <div className="mt-5 p-3 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-around text-center">
                <div>
                  <p className="text-lg font-bold text-black">{attempts[activeId]}</p>
                  <p className="text-xs text-zinc-400">Attempts</p>
                </div>
                {bestTimes[activeId] && (
                  <div>
                    <p className="text-lg font-bold text-black">{bestTimes[activeId].toFixed(1)}s</p>
                    <p className="text-xs text-zinc-400">Best time</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
