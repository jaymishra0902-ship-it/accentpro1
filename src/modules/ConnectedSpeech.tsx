import { useState } from 'react';
import { Link2, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { connectedSpeechItems } from '@/data/content';

const typeConfig: Record<string, { label: string; color: string }> = {
  linking: { label: 'Linking', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  elision: { label: 'Elision', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  contraction: { label: 'Contraction', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  silent: { label: 'Silent Letter', color: 'bg-teal-50 text-teal-700 border-teal-100' },
};

export function ConnectedSpeech() {
  const { accent } = useApp();
  const filtered = connectedSpeechItems.filter((i) => i.accent === accent);
  const [activeId, setActiveId] = useState(filtered[0]?.id ?? '');
  const active = filtered.find((i) => i.id === activeId) ?? filtered[0];

  if (!active) return null;

  const speak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text.split('→')[0].trim());
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Connected Speech & Silent Letters Engine"
        description="Interactive guides on linking words, elisions, contractions, and tricky silent letters."
        icon={<Link2 className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Type list */}
        <div className="space-y-2">
          {filtered.map((item) => {
            const cfg = typeConfig[item.type];
            return (
              <Card
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`p-4 ${activeId === item.id ? 'border-black ring-1 ring-black' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm font-bold text-black">{item.title}</p>
              </Card>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${typeConfig[active.type].color}`}>
                {typeConfig[active.type].label}
              </span>
            </div>

            <h2 className="text-xl font-bold text-black mb-2">{active.title}</h2>
            <p className="text-sm text-zinc-600 mb-5 leading-relaxed">{active.description}</p>

            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wide">Examples</h3>
              {active.examples.map((ex, i) => {
                const [original, transformed] = ex.split(' → ');
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3.5 rounded-lg bg-zinc-50 border border-zinc-100"
                  >
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-sm font-medium text-zinc-700">{original}</span>
                      <span className="text-zinc-300">→</span>
                      <span className="text-sm font-bold text-black">{transformed}</span>
                    </div>
                    <button
                      onClick={() => speak(ex)}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 transition-colors shrink-0"
                    >
                      <Volume2 className="w-4 h-4 text-zinc-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
