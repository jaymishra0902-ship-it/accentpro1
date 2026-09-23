import { useState } from 'react';
import { BarChart3, TrendingUp, Award, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { RadarChart } from '@/components/RadarChart';
import type { SkillScores } from '@/types';

const skillLabels: { key: keyof SkillScores; label: string; desc: string }[] = [
  { key: 'pronunciation', label: 'Pronunciation', desc: 'Accuracy of individual sound production' },
  { key: 'intonation', label: 'Intonation', desc: 'Pitch patterns and melody of speech' },
  { key: 'fluency', label: 'Fluency', desc: 'Smoothness and flow of connected speech' },
  { key: 'vocabulary', label: 'Vocabulary', desc: 'Range and accuracy of word usage' },
  { key: 'consistency', label: 'Consistency', desc: 'Reliability of accent across contexts' },
];

export function ProgressProfile() {
  const { user, skillScores, setSkillScores, completedLessons, accent } = useApp();
  const [editing, setEditing] = useState(false);
  const [tempScores, setTempScores] = useState<SkillScores>(skillScores);

  const avg = Math.round(
    (skillScores.pronunciation +
      skillScores.intonation +
      skillScores.fluency +
      skillScores.vocabulary +
      skillScores.consistency) /
      5
  );

  const strongestSkill = skillLabels.reduce((max, cur) =>
    skillScores[cur.key] > skillScores[max.key] ? cur : max
  );
  const weakestSkill = skillLabels.reduce((min, cur) =>
    skillScores[cur.key] < skillScores[min.key] ? cur : min
  );

  const saveScores = () => {
    setSkillScores(tempScores);
    setEditing(false);
  };

  return (
    <div>
      <PageHeader
        title="Benchmark Radar Chart & Profile"
        description="Your progress tracking page with a 5-axis skills radar chart."
        icon={<BarChart3 className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Skill Radar</h2>
            <button
              onClick={() => { setTempScores(skillScores); setEditing(!editing); }}
              className="text-xs font-semibold text-zinc-500 hover:text-black px-2.5 py-1 rounded-lg hover:bg-zinc-100 transition-colors"
            >
              {editing ? 'Cancel' : 'Update Scores'}
            </button>
          </div>

          <RadarChart scores={editing ? tempScores : skillScores} />

          {editing && (
            <div className="mt-4 space-y-3">
              {skillLabels.map((skill) => (
                <div key={skill.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-600">{skill.label}</span>
                    <span className="text-xs font-bold text-black">{tempScores[skill.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={tempScores[skill.key]}
                    onChange={(e) =>
                      setTempScores({ ...tempScores, [skill.key]: Number(e.target.value) })
                    }
                    className="w-full accent-black"
                  />
                </div>
              ))}
              <button
                onClick={saveScores}
                className="w-full py-2.5 rounded-lg bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
              >
                Save Scores
              </button>
            </div>
          )}
        </Card>

        {/* Profile details */}
        <div className="space-y-4">
          {/* Overall */}
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-black">{avg}%</p>
                <p className="text-xs text-zinc-500">Overall Accent Score</p>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-black transition-all duration-700"
                style={{ width: `${avg}%` }}
              />
            </div>
          </Card>

          {/* User profile */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-3">
              Profile
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Name</span>
                <span className="text-sm font-semibold text-black">{user?.name ?? 'Guest'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Current Level</span>
                <span className="text-sm font-semibold text-black">{user?.level ?? 'B1'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Active Accent</span>
                <span className="text-sm font-semibold text-black">
                  {accent === 'american' ? '🇺🇸 American' : '🇬🇧 British'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Lessons Completed</span>
                <span className="text-sm font-semibold text-black">{completedLessons.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Streak</span>
                <span className="text-sm font-semibold text-black">{user?.streak ?? 0} days</span>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-zinc-500 uppercase">Strongest</span>
              </div>
              <p className="text-sm font-bold text-black">{strongestSkill.label}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {skillScores[strongestSkill.key]}%
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase">Focus Area</span>
              </div>
              <p className="text-sm font-bold text-black">{weakestSkill.label}</p>
              <p className="text-2xl font-bold text-orange-500 mt-1">
                {skillScores[weakestSkill.key]}%
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Skill breakdown */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-bold text-black mb-4">Skill Breakdown</h3>
        <div className="space-y-4">
          {skillLabels.map((skill) => (
            <div key={skill.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <span className="text-sm font-semibold text-black">{skill.label}</span>
                  <span className="text-xs text-zinc-400 ml-2">{skill.desc}</span>
                </div>
                <span className="text-sm font-bold text-black">{skillScores[skill.key]}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-black transition-all duration-500"
                  style={{ width: `${skillScores[skill.key]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
