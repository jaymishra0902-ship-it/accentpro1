import { useState } from 'react';
import { Volume2, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { ipaSymbols } from '@/data/content';
import type { IPASymbol } from '@/types';

const typeConfig: Record<IPASymbol['type'], { label: string; color: string }> = {
  vowel: { label: 'Vowels', color: 'bg-blue-50 border-blue-100 text-blue-700' },
  consonant: { label: 'Consonants', color: 'bg-green-50 border-green-100 text-green-700' },
  diphthong: { label: 'Diphthongs', color: 'bg-amber-50 border-amber-100 text-amber-700' },
};

export function IPAChart() {
  const { accent } = useApp();
  const [activeType, setActiveType] = useState<'all' | 'vowel' | 'consonant' | 'diphthong'>('all');
  const [selected, setSelected] = useState<IPASymbol | null>(null);

  const filtered =
    activeType === 'all'
      ? ipaSymbols
      : ipaSymbols.filter((s) => s.type === activeType);

  const speak = (word: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      utterance.rate = 0.8;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const filterTabs: { id: 'all' | 'vowel' | 'consonant' | 'diphthong'; label: string }[] = [
    { id: 'all', label: 'All Sounds' },
    { id: 'vowel', label: 'Vowels' },
    { id: 'consonant', label: 'Consonants' },
    { id: 'diphthong', label: 'Diphthongs' },
  ];

  return (
    <div>
      <PageHeader
        title="Interactive IPA Phonetic Chart"
        description="Click any IPA symbol to hear it pronounced. Covers all 44 sounds of English — vowels, consonants, and diphthongs."
        icon={<Volume2 className="w-7 h-7 text-zinc-400" />}
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveType(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              activeType === tab.id
                ? 'bg-black text-white'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* IPA grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filtered.map((sym) => {
              const cfg = typeConfig[sym.type];
              return (
                <Card
                  key={sym.id}
                  onClick={() => { setSelected(sym); speak(sym.exampleWord); }}
                  className={`p-4 text-center cursor-pointer transition-all hover:shadow-md ${
                    selected?.id === sym.id ? 'border-black ring-1 ring-black' : ''
                  }`}
                >
                  <p className="text-2xl font-bold text-black font-mono mb-1">{sym.symbol}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
                    {cfg.label.slice(0, -1)}
                  </span>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:sticky lg:top-20 self-start">
          <Card className="p-5">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-4xl font-bold text-black font-mono">{selected.symbol}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${typeConfig[selected.type].color}`}>
                      {typeConfig[selected.type].label}
                    </span>
                  </div>
                  <button
                    onClick={() => speak(selected.exampleWord)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Play
                  </button>
                </div>

                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Description</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{selected.description}</p>
                </div>

                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Voicing</p>
                  <p className="text-sm text-zinc-700">
                    {selected.voiced ? 'Voiced — vocal cords vibrate' : 'Voiceless — no vocal cord vibration'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Example Words</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.example.split(', ').map((word) => (
                      <button
                        key={word}
                        onClick={() => speak(word)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-100 text-sm font-medium text-zinc-700 hover:bg-zinc-200 transition-colors"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black text-white">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-zinc-400">Try it</p>
                  <p className="text-sm">Say "{selected.exampleWord}" — focus on the {selected.symbol} sound.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Info className="w-10 h-10 text-zinc-200 mb-3" />
                <p className="text-sm text-zinc-400">
                  Click any IPA symbol to hear it and see pronunciation details.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
