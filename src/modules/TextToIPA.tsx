import { useState, useMemo } from 'react';
import { Type, Volume2, Copy, Check, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';

// Simple word-to-IPA mapping for common English sounds
const wordToIPA: Record<string, { us: string; uk: string }> = {
  // Common words - this is a simplified phonetic transcription engine
  the: { us: '/ðə/', uk: '/ðə/' },
  a: { us: '/ə/', uk: '/ə/' },
  an: { us: '/ən/', uk: '/ən/' },
  and: { us: '/ænd/', uk: '/ænd/' },
  or: { us: '/ɔr/', uk: '/ɔː/' },
  but: { us: '/bʌt/', uk: '/bʌt/' },
  if: { us: '/ɪf/', uk: '/ɪf/' },
  is: { us: '/ɪz/', uk: '/ɪz/' },
  are: { us: '/ɑr/', uk: '/ɑː/' },
  was: { us: '/wʌz/', uk: '/wɒz/' },
  were: { us: '/wɜr/', uk: '/wɜː/' },
  will: { us: '/wɪl/', uk: '/wɪl/' },
  would: { us: '/wʊd/', uk: '/wʊd/' },
  can: { us: '/kæn/', uk: '/kæn/' },
  could: { us: '/kʊd/', uk: '/kʊd/' },
  should: { us: '/ʃʊd/', uk: '/ʃʊd/' },
  have: { us: '/hæv/', uk: '/hæv/' },
  has: { us: '/hæz/', uk: '/hæz/' },
  had: { us: '/hæd/', uk: '/hæd/' },
  do: { us: '/du/', uk: '/duː/' },
  does: { us: '/dʌz/', uk: '/dʌz/' },
  did: { us: '/dɪd/', uk: '/dɪd/' },
  not: { us: '/nɑt/', uk: '/nɒt/' },
  no: { us: '/noʊ/', uk: '/nəʊ/' },
  yes: { us: '/jɛs/', uk: '/jes/' },
  hello: { us: '/həˈloʊ/', uk: '/həˈləʊ/' },
  world: { us: '/wɜrld/', uk: '/wɜːld/' },
  water: { us: '/ˈwɔtər/', uk: '/ˈwɔːtə/' },
  about: { us: '/əˈbaʊt/', uk: '/əˈbaʊt/' },
  think: { us: '/θɪŋk/', uk: '/θɪŋk/' },
  this: { us: '/ðɪs/', uk: '/ðɪs/' },
  that: { us: '/ðæt/', uk: '/ðæt/' },
  with: { us: '/wɪθ/', uk: '/wɪð/' },
  from: { us: '/frʌm/', uk: '/frɒm/' },
  what: { us: '/wʌt/', uk: '/wɒt/' },
  when: { us: '/wɛn/', uk: '/wen/' },
  where: { us: '/wɛr/', uk: '/weə/' },
  why: { us: '/waɪ/', uk: '/waɪ/' },
  how: { us: '/haʊ/', uk: '/haʊ/' },
  who: { us: '/hu/', uk: '/huː/' },
  good: { us: '/ɡʊd/', uk: '/ɡʊd/' },
  great: { us: '/ɡreɪt/', uk: '/ɡreɪt/' },
  very: { us: '/ˈvɛri/', uk: '/ˈveri/' },
  much: { us: '/mʌtʃ/', uk: '/mʌtʃ/' },
  some: { us: '/sʌm/', uk: '/sʌm/' },
  time: { us: '/taɪm/', uk: '/taɪm/' },
  people: { us: '/ˈpipəl/', uk: '/ˈpiːpəl/' },
  thing: { us: '/θɪŋ/', uk: '/θɪŋ/' },
  want: { us: '/wɑnt/', uk: '/wɒnt/' },
  need: { us: '/nid/', uk: '/niːd/' },
  like: { us: '/laɪk/', uk: '/laɪk/' },
  know: { us: '/noʊ/', uk: '/nəʊ/' },
  get: { us: '/ɡɛt/', uk: '/ɡet/' },
  make: { us: '/meɪk/', uk: '/meɪk/' },
  go: { us: '/ɡoʊ/', uk: '/ɡəʊ/' },
  see: { us: '/si/', uk: '/siː/' },
  come: { us: '/kʌm/', uk: '/kʌm/' },
  take: { us: '/teɪk/', uk: '/teɪk/' },
  look: { us: '/lʊk/', uk: '/lʊk/' },
  only: { us: '/ˈoʊnli/', uk: '/ˈəʊnli/' },
  new: { us: '/nu/', uk: '/njuː/' },
  now: { us: '/naʊ/', uk: '/naʊ/' },
  way: { us: '/weɪ/', uk: '/weɪ/' },
  day: { us: '/deɪ/', uk: '/deɪ/' },
  use: { us: '/juz/', uk: '/juːz/' },
  man: { us: '/mæn/', uk: '/mæn/' },
  woman: { us: '/ˈwʊmən/', uk: '/ˈwʊmən/' },
  child: { us: '/tʃaɪld/', uk: '/tʃaɪld/' },
  work: { us: '/wɜrk/', uk: '/wɜːk/' },
  life: { us: '/laɪf/', uk: '/laɪf/' },
  hand: { us: '/hænd/', uk: '/hænd/' },
  part: { us: '/pɑrt/', uk: '/pɑːt/' },
  place: { us: '/pleɪs/', uk: '/pleɪs/' },
  case: { us: '/keɪs/', uk: '/keɪs/' },
  point: { us: '/pɔɪnt/', uk: '/pɔɪnt/' },
  company: { us: '/ˈkʌmpəni/', uk: '/ˈkʌmpəni/' },
  number: { us: '/ˈnʌmbər/', uk: '/ˈnʌmbə/' },
  group: { us: '/ɡrup/', uk: '/ɡruːp/' },
  problem: { us: '/ˈprɑbləm/', uk: '/ˈprɒbləm/' },
  fact: { us: '/fækt/', uk: '/fækt/' },
};

function transcribeWord(word: string, accent: 'american' | 'british'): string {
  const clean = word.toLowerCase().replace(/[^a-z']/g, '');
  if (!clean) return word;

  // Check dictionary first
  if (wordToIPA[clean]) {
    return accent === 'american' ? wordToIPA[clean].us : wordToIPA[clean].uk;
  }

  // Simple rule-based fallback for common patterns
  let ipa = clean;
  // Basic substitutions
  ipa = ipa.replace(/tion/g, 'ʃən');
  ipa = ipa.replace(/sion/g, 'ʒən');
  ipa = ipa.replace(/ough/g, 'oʊ');
  ipa = ipa.replace(/igh/g, 'aɪ');
  ipa = ipa.replace(/ee/g, 'iː');
  ipa = ipa.replace(/oo/g, 'uː');
  ipa = ipa.replace(/th/g, 'θ');
  ipa = ipa.replace(/sh/g, 'ʃ');
  ipa = ipa.replace(/ch/g, 'tʃ');
  ipa = ipa.replace(/ph/g, 'f');
  ipa = ipa.replace(/ck/g, 'k');
  ipa = ipa.replace(/wh/g, 'w');
  ipa = ipa.replace(/kn/g, 'n');
  ipa = ipa.replace(/wr/g, 'r');
  ipa = ipa.replace(/mb$/g, 'm');
  ipa = ipa.replace(/c/g, 'k');
  ipa = ipa.replace(/x/g, 'ks');
  ipa = ipa.replace(/y$/g, 'i');
  ipa = ipa.replace(/qu/g, 'kw');
  ipa = ipa.replace(/ng/g, 'ŋ');

  // Accent-specific
  if (accent === 'british') {
    ipa = ipa.replace(/or/g, 'ɔː');
    ipa = ipa.replace(/ar/g, 'ɑː');
    ipa = ipa.replace(/er/g, 'ɜː');
    ipa = ipa.replace(/ir/g, 'ɜː');
    ipa = ipa.replace(/ur/g, 'ɜː');
  } else {
    ipa = ipa.replace(/or/g, 'ɔr');
    ipa = ipa.replace(/ar/g, 'ɑr');
    ipa = ipa.replace(/er/g, 'ɜr');
    ipa = ipa.replace(/ir/g, 'ɪr');
    ipa = ipa.replace(/ur/g, 'ɜr');
  }

  return `/${ipa}/`;
}

function transcribeText(text: string, accent: 'american' | 'british'): string {
  return text
    .split(/\s+/)
    .map((word) => transcribeWord(word, accent))
    .join(' ');
}

export function TextToIPA() {
  const { accent } = useApp();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const transcription = useMemo(() => {
    if (!input.trim()) return { us: '', uk: '' };
    return {
      us: transcribeText(input, 'american'),
      uk: transcribeText(input, 'british'),
    };
  }, [input]);

  const speak = (lang: 'us' | 'uk') => {
    try {
      const utterance = new SpeechSynthesisUtterance(input);
      utterance.lang = lang === 'us' ? 'en-US' : 'en-GB';
      utterance.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const copyTranscription = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Custom Text-to-IPA Transcriber & Reader"
        description="Paste any text to generate real-time IPA phonetic transcriptions with American and British audio playback."
        icon={<Type className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-black mb-1">Input Text</h2>
          <p className="text-sm text-zinc-500 mb-4">Paste or type any paragraph to transcribe.</p>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste any English text here to see its IPA transcription..."
            className="w-full h-48 p-4 rounded-xl border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors resize-none leading-relaxed"
          />

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => speak('us')}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Volume2 className="w-4 h-4" />
              🇺🇸 Play US
            </button>
            <button
              onClick={() => speak('uk')}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Volume2 className="w-4 h-4" />
              🇬🇧 Play UK
            </button>
          </div>
        </Card>

        {/* Output */}
        <div className="space-y-4">
          {/* US transcription */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                🇺🇸 American IPA
              </h3>
              <button
                onClick={() => copyTranscription(transcription.us)}
                disabled={!transcription.us}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-black disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 min-h-[80px]">
              <p className="text-sm font-mono text-zinc-800 leading-relaxed">
                {transcription.us || 'Your transcription will appear here...'}
              </p>
            </div>
          </Card>

          {/* UK transcription */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-black">
                🇬🇧 British IPA
              </h3>
              <button
                onClick={() => copyTranscription(transcription.uk)}
                disabled={!transcription.uk}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-black disabled:opacity-40"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100 min-h-[80px]">
              <p className="text-sm font-mono text-zinc-800 leading-relaxed">
                {transcription.uk || 'Your transcription will appear here...'}
              </p>
            </div>
          </Card>

          {/* Active accent highlight */}
          <Card className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500">Active accent:</span>
              <span className="font-bold text-black">
                {accent === 'american' ? '🇺🇸 American' : '🇬🇧 British'}
              </span>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
              <span className="text-zinc-500">Audio plays in this accent</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
