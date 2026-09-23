import { useState } from 'react';
import { BookOpen, Search, Volume2, Copy, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { slangDatabase } from '@/data/content';

export function SlangVault() {
  const { accent } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = slangDatabase.filter((s) => {
    const matchAccent = s.accent === accent;
    const matchSearch =
      !search ||
      s.phrase.toLowerCase().includes(search.toLowerCase()) ||
      s.meaning.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchAccent && matchSearch && matchCategory;
  });

  const categories = ['All', ...Array.from(new Set(slangDatabase.filter(s => s.accent === accent).map((s) => s.category)))];

  const speak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const copyExpression = (id: string, phrase: string) => {
    try {
      navigator.clipboard.writeText(phrase);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Native Slang & Idiom Vault"
        description="Searchable database of US vs UK slang with instant Audio Preview and Copy Expression buttons."
        icon={<BookOpen className="w-7 h-7 text-zinc-400" />}
      />

      {/* Search & filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slang and idioms..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-base font-bold text-black">{item.phrase}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 font-medium mt-1 inline-block">
                  {item.category}
                </span>
              </div>
              <span className="text-lg">{item.accent === 'american' ? '🇺🇸' : '🇬🇧'}</span>
            </div>

            <p className="text-sm text-zinc-600 mb-2">{item.meaning}</p>
            <p className="text-xs text-zinc-400 italic mb-3">"{item.example}"</p>

            <div className="flex gap-2">
              <button
                onClick={() => speak(item.phrase)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Audio Preview
              </button>
              <button
                onClick={() => copyExpression(item.id, item.phrase)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 text-xs font-semibold hover:bg-zinc-50 transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-zinc-400">No expressions found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
