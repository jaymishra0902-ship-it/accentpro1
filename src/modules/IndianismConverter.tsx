import { useState } from 'react';
import { ArrowLeftRight, Volume2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { indianisms } from '@/data/content';

export function IndianismConverter() {
  const { accent } = useApp();
  const [search, setSearch] = useState('');

  const results = indianisms.filter(
    (item) =>
      !search ||
      item.indianism.toLowerCase().includes(search.toLowerCase()) ||
      item.nativeUS.toLowerCase().includes(search.toLowerCase()) ||
      item.nativeUK.toLowerCase().includes(search.toLowerCase())
  );

  const speak = (text: string, lang: 'us' | 'uk') => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'us' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Indianism to Native Converter"
        description="Side-by-side instant correction cards with American and British native translations, context notes, and audio playback."
        icon={<ArrowLeftRight className="w-7 h-7 text-zinc-400" />}
      />

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Indianisms..."
          className="w-full max-w-md px-4 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {results.map((item) => (
          <Card key={item.id} className="p-5">
            {/* Indianism */}
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 mb-3">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1.5">
                Indianism
              </p>
              <p className="text-sm text-zinc-800 font-medium leading-snug">
                "{item.indianism}"
              </p>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center mb-3">
              <ArrowRight className="w-5 h-5 text-zinc-300" />
            </div>

            {/* Native US */}
            <div className="p-3 rounded-lg bg-green-50 border border-green-100 mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wide">
                  🇺🇸 American Native
                </p>
                <button
                  onClick={() => speak(item.nativeUS, 'us')}
                  className="p-1 rounded hover:bg-green-100 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-green-600" />
                </button>
              </div>
              <p className="text-sm text-zinc-800 font-medium leading-snug">
                "{item.nativeUS}"
              </p>
            </div>

            {/* Native UK */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  🇬🇧 British Native
                </p>
                <button
                  onClick={() => speak(item.nativeUK, 'uk')}
                  className="p-1 rounded hover:bg-blue-100 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
              <p className="text-sm text-zinc-800 font-medium leading-snug">
                "{item.nativeUK}"
              </p>
            </div>

            {/* Explanation */}
            <div className="pt-3 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 leading-relaxed">{item.explanation}</p>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-zinc-400">No Indianisms found for your search.</p>
        </div>
      )}
    </div>
  );
}
