import { useState, useRef, useCallback } from 'react';
import { Repeat, Flame, Timer, RotateCcw, Volume2, Trophy, Zap } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { tongueTwisters } from '@/data/content';

const difficultyConfig: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: 'bg-green-50 text-green-700 border-green-100' },
  medium: { label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  hard: { label: 'Hard', color: 'bg-red-50 text-red-700 border-red-100' },
  insane: { label: 'Insane', color: 'bg-zinc-900 text-white border-zinc-900' },
};

export function DailyDrills() {
  const { user, addXP, unlockBadge } = useApp();
  const [activeId, setActiveId] = useState(tongueTwisters[0].id);
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [bestTimes, setBestTimes] = useState<Record<string, number>>({});
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const active = tongueTwisters.find((t) => t.id === activeId)!;
  const cfg = difficultyConfig[active.difficulty];

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const now = performance.now();
    const seconds = (now - startTimeRef.current) / 1000;
    setElapsed(seconds);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setElapsed(0);
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stopTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsRunning(false);

    const finalTime = startTimeRef.current !== null
      ? (performance.now() - startTimeRef.current) / 1000
      : 0;
    startTimeRef.current = null;
    setElapsed(finalTime);

    setAttempts((prev) => {
      const newCount = (prev[activeId] ?? 0) + 1;
      if (newCount >= 10) {
        unlockBadge('twister-king');
      }
      return { ...prev, [activeId]: newCount };
    });

    setBestTimes((prev) => {
      const current = prev[activeId];
      if (!current || finalTime < current) {
        return { ...prev, [activeId]: finalTime };
      }
      return prev;
    });

    addXP(15);
  }, [activeId, addXP, unlockBadge]);

  const reset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    setIsRunning(false);
    setElapsed(0);
  }, []);

  const selectTwister = (id: string) => {
    reset();
    setActiveId(id);
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
  const metTarget = bestTimes[activeId] !== undefined && bestTimes[activeId] <= active.targetSpeed;

  return (
    <div>
      <PageHeader
        title="Daily Accent Drills & Tongue Twisters"
        description="High-speed speech challenges with streak tracking, target speed benchmarks, and replay buttons."
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
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {tongueTwisters.map((t) => {
            const tcfg = difficultyConfig[t.difficulty];
            return (
              <Card
                key={t.id}
                onClick={() => selectTwister(t.id)}
                className={`p-3.5 ${activeId === t.id ? 'border-black ring-1 ring-black' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${tcfg.color}`}>
                    {tcfg.label}
                  </span>
                  {bestTimes[t.id] && (
                    <span className="text-xs font-mono text-zinc-400">
                      {bestTimes[t.id].toFixed(2)}s
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-zinc-700 line-clamp-2">{t.text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-zinc-400">Focus: {t.focusSound}</p>
                  <span className="text-xs text-zinc-300">·</span>
                  <p className="text-xs text-zinc-400">Target: {t.targetSpeed}s</p>
                </div>
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
              <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500">
                <span>Focus: {active.focusSound}</span>
                <span className="text-zinc-300">·</span>
                <span>Target: {active.targetSpeed}s</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-100 mb-5 text-center">
              <p className="text-xl sm:text-2xl font-bold text-black leading-snug">
                {active.text}
              </p>
            </div>

            {/* Timer display */}
            <div className="flex flex-col items-center justify-center gap-1 mb-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-zinc-400" />
                <span className="text-4xl font-bold font-mono text-black tabular-nums">
                  {elapsed.toFixed(2)}s
                </span>
              </div>
              {isRunning && (
                <div className="w-48 h-1 rounded-full bg-zinc-100 overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-75"
                    style={{ width: `${Math.min(100, (elapsed / 30) * 100)}%` }}
                  />
                </div>
              )}
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
                  onClick={stopTimer}
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
            {attempts[activeId] !== undefined && (
              <div className="mt-5 p-4 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-around text-center">
                <div>
                  <p className="text-2xl font-bold text-black">{attempts[activeId]}</p>
                  <p className="text-xs text-zinc-400">Attempts</p>
                </div>
                {bestTimes[activeId] !== undefined && (
                  <div>
                    <p className="text-2xl font-bold text-black">{bestTimes[activeId].toFixed(2)}s</p>
                    <p className="text-xs text-zinc-400">Best time</p>
                  </div>
                )}
                {bestTimes[activeId] !== undefined && (
                  <div>
                    {metTarget ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm font-bold">Target met!</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-zinc-500">
                          {(bestTimes[activeId] - active.targetSpeed).toFixed(1)}s over
                        </p>
                        <p className="text-xs text-zinc-400">Beat target</p>
                      </div>
                    )}
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
