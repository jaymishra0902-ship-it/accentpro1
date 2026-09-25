import { useState, useEffect } from 'react';
import { Award, Zap, Star, Flame, Smile, Repeat, MessageSquare, Type, BookOpen, Footprints } from 'lucide-react';
import { useApp, allBadges } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';

const iconMap: Record<string, typeof Award> = {
  Footprints,
  Smile,
  Repeat,
  Flame,
  MessageSquare,
  Type,
  BookOpen,
  Award,
};

export function Achievements() {
  const { xp, unlockedBadges, user } = useApp();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (unlockedBadges.length > 0) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [unlockedBadges.length]);

  const unlockedCount = unlockedBadges.length;
  const totalCount = allBadges.length;
  const xpToNext = allBadges
    .filter((b) => !unlockedBadges.includes(b.id))
    .sort((a, b) => a.xpRequired - b.xpRequired)[0];

  return (
    <div>
      <PageHeader
        title="Achievements & XP"
        description="Track your progress, unlock badges, and earn XP as you master your accent."
        icon={<Award className="w-7 h-7 text-zinc-400" />}
      />

      {/* XP Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Total XP</span>
          </div>
          <p className="text-3xl font-bold text-black">{xp}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {xpToNext ? `${xpToNext.xpRequired - xp} XP to next badge` : 'All badges unlocked!'}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Streak</span>
          </div>
          <p className="text-3xl font-bold text-black">{user?.streak ?? 0}</p>
          <p className="text-xs text-zinc-400 mt-1">days in a row</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Badges</span>
          </div>
          <p className="text-3xl font-bold text-black">{unlockedCount}/{totalCount}</p>
          <p className="text-xs text-zinc-400 mt-1">achievements unlocked</p>
        </Card>
      </div>

      {/* XP Progress bar */}
      {xpToNext && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-black">
              Progress to "{xpToNext.name}"
            </p>
            <p className="text-xs font-semibold text-zinc-500">
              {xp} / {xpToNext.xpRequired} XP
            </p>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / xpToNext.xpRequired) * 100)}%` }}
            />
          </div>
        </Card>
      )}

      {/* Badge grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allBadges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = iconMap[badge.icon] ?? Award;
          const canUnlock = xp >= badge.xpRequired && !isUnlocked;

          return (
            <Card
              key={badge.id}
              className={`p-5 text-center transition-all ${
                isUnlocked
                  ? 'border-black ring-1 ring-black'
                  : canUnlock
                  ? 'border-zinc-400'
                  : 'opacity-50'
              } ${showAnimation && isUnlocked ? 'animate-pulse' : ''}`}
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  isUnlocked
                    ? 'bg-black'
                    : canUnlock
                    ? 'bg-zinc-200'
                    : 'bg-zinc-100'
                }`}
              >
                <Icon
                  className={`w-8 h-8 ${
                    isUnlocked ? 'text-white' : 'text-zinc-400'
                  }`}
                />
              </div>
              <p className="text-sm font-bold text-black mb-1">{badge.name}</p>
              <p className="text-xs text-zinc-500 leading-snug mb-2">{badge.description}</p>
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-500">{badge.xpRequired} XP</span>
                {isUnlocked && (
                  <span className="ml-1 text-xs font-bold text-green-600">Unlocked</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
