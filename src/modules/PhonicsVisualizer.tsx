import { useState } from 'react';
import { Smile, Volume2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { MouthVisualizer } from '@/components/MouthVisualizer';
import { mouthPositions } from '@/data/content';

export function PhonicsVisualizer() {
  const { accent } = useApp();
  const filtered = mouthPositions.filter((p) => p.accent === accent);
  const [selectedId, setSelectedId] = useState(filtered[0]?.id ?? '');
  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];

  if (!selected) return null;

  const speak = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(selected.tip.replace(/[^a-zA-Z\s]/g, '').split('—')[0]);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Phonics & Mouth Position Visualizer"
        description="Interactive 2D diagrams showing tongue and lip positions for key English sounds."
        icon={<Smile className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sound selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-2">
            {accent === 'american' ? '🇺🇸 American Sounds' : '🇬🇧 British Sounds'}
          </h3>
          {filtered.map((p) => (
            <Card
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`p-3.5 ${selectedId === p.id ? 'border-black ring-1 ring-black' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black">{p.sound}</p>
                  <p className="text-xs text-zinc-500">{p.ipa}</p>
                </div>
                <span className="text-lg font-mono text-zinc-300">{p.ipa}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Visualizer */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-black">{selected.sound}</h2>
                <p className="text-sm text-zinc-500 font-mono">{selected.ipa}</p>
              </div>
              <button
                onClick={speak}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                Play Sound
              </button>
            </div>

            <div className="bg-zinc-50 rounded-xl p-4 mb-5">
              <MouthVisualizer position={selected} />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-zinc-700 leading-relaxed">{selected.description}</p>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Tongue</p>
                  <p className="text-sm text-zinc-800">{selected.tonguePosition}</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Lips</p>
                  <p className="text-sm text-zinc-800">{selected.lipShape}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black text-white">
                <p className="text-xs font-bold uppercase tracking-wide mb-1 text-zinc-400">Pro Tip</p>
                <p className="text-sm">{selected.tip}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
