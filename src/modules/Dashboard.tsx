import {
  Flame,
  TrendingUp,
  Mic,
  GraduationCap,
  Target,
  ArrowRight,
  CheckCircle2,
  Zap,
  Award,
} from 'lucide-react';
import { useApp, allBadges } from '@/context/AppContext';
import { RadarChart } from '@/components/RadarChart';
import { Card } from '@/components/Card';
import { curriculum } from '@/data/content';
import type { ModuleId } from '@/types';

export function Dashboard() {
  const { user, accent, skillScores, completedLessons, setActiveModule, xp, unlockedBadges } = useApp();

  const totalLessons = curriculum.length;
  const doneCount = completedLessons.length;
  const progress = Math.round((doneCount / totalLessons) * 100);
  const avgScore = Math.round(
    (skillScores.pronunciation +
      skillScores.intonation +
      skillScores.fluency +
      skillScores.vocabulary +
      skillScores.consistency) /
      5
  );

  const quickActions: { id: ModuleId; label: string; icon: typeof Mic; desc: string }[] = [
    { id: 'evaluator', label: 'Speech Evaluator', icon: Mic, desc: 'Test your pronunciation' },
    { id: 'curriculum', label: 'Continue Learning', icon: GraduationCap, desc: 'Pick up where you left off' },
    { id: 'roleplay', label: 'Roleplay', icon: Target, desc: 'Practice real scenarios' },
    { id: 'drills', label: 'Daily Drill', icon: Flame, desc: 'Keep your streak alive' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
          Welcome back{user ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          You're practicing the <span className="font-semibold text-black">{accent === 'american' ? '🇺🇸 American' : '🇬🇧 British'}</span> accent. Let's keep improving.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Streak</span>
          </div>
          <p className="text-2xl font-bold text-black">{user?.streak ?? 0}</p>
          <p className="text-xs text-zinc-400">days in a row</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Lessons</span>
          </div>
          <p className="text-2xl font-bold text-black">{doneCount}/{totalLessons}</p>
          <p className="text-xs text-zinc-400">{progress}% complete</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-black">{avgScore}%</p>
          <p className="text-xs text-zinc-400">across all skills</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">XP</span>
          </div>
          <p className="text-2xl font-bold text-black">{xp}</p>
          <p className="text-xs text-zinc-400">points earned</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-zinc-700" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Badges</span>
          </div>
          <p className="text-2xl font-bold text-black">{unlockedBadges.length}/{allBadges.length}</p>
          <p className="text-xs text-zinc-400">unlocked</p>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-black mb-1">Skill Profile</h2>
          <p className="text-xs text-zinc-500 mb-4">Your 5-axis accent proficiency breakdown</p>
          <RadarChart scores={skillScores} />
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-black mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.id}
                    onClick={() => setActiveModule(action.id)}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center mb-2.5">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-black">{action.label}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{action.desc}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-black">Curriculum Progress</h3>
              <button
                onClick={() => setActiveModule('curriculum')}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-black"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-black transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {doneCount} of {totalLessons} lessons completed
            </p>
          </Card>

          {/* XP progress */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-black">XP Progress</h3>
              <button
                onClick={() => setActiveModule('achievements')}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-black"
              >
                View badges <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-zinc-700" />
              <span className="text-2xl font-bold text-black">{xp}</span>
              <span className="text-xs text-zinc-400">XP earned</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-black transition-all duration-500"
                style={{ width: `${Math.min(100, (unlockedBadges.length / allBadges.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              {unlockedBadges.length} of {allBadges.length} badges unlocked
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
