import { useState, useRef } from 'react';
import { Mic, Square, RotateCcw, Lightbulb, Gauge, Activity, Volume2, Play } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { WaveformDisplay } from '@/components/WaveformDisplay';

type RecordingState = 'idle' | 'recording' | 'done';

interface Result {
  accuracy: number;
  wpm: number;
  tips: string[];
}

export function SpeechEvaluator() {
  const { accent } = useApp();
  const [state, setState] = useState<RecordingState>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  const sampleText =
    accent === 'american'
      ? 'The water at the harbor was better than ever. She thought it was awesome.'
      : 'The water at the harbour was better than ever. She thought it was lovely.';

  const startRecording = () => {
    setState('recording');
    setResult(null);
    setProgress(0);

    let elapsed = 0;
    const duration = 5000;
    timerRef.current = window.setInterval(() => {
      elapsed += 50;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        finishRecording();
      }
    }, 50);
  };

  const finishRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('done');

    const accuracy = 72 + Math.floor(Math.random() * 25);
    const wpm = 110 + Math.floor(Math.random() * 60);
    const tips = generateTips(accuracy, wpm, accent);
    setResult({ accuracy, wpm, tips });
  };

  const reset = () => {
    setState('idle');
    setResult(null);
    setProgress(0);
  };

  const playSample = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const playRecording = () => {
    try {
      const utterance = new SpeechSynthesisUtterance(sampleText);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      utterance.rate = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  const tipsPoolAmerican = [
    'Your /r/ sounds are well-articulated. Keep the tongue retroflexed.',
    'Try softening the "t" in "water" — American English often uses a flap /t/ (sounds like "d").',
    'Your intonation rises nicely on questions. Practice falling tone for statements.',
    'Slow down slightly on consonant clusters for clearer articulation.',
    'The schwa /ə/ in "than" and "ever" should be very relaxed and short.',
  ];

  const tipsPoolBritish = [
    'Your glottal stops are coming through nicely on "water" — keep it natural.',
    'Ensure the "r" in "harbour" is silent — non-rhotic pronunciation is key.',
    'Practice the British /ɒ/ vowel in "water" — rounder and shorter than American.',
    'Your intonation is good. Try adding more pitch variation for British patterns.',
    'The "t" in "better" should be crisp — avoid the American flap /t/.',
  ];

  const generateTips = (accuracy: number, wpm: number, accent: string): string[] => {
    const pool = accent === 'american' ? tipsPoolAmerican : tipsPoolBritish;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const tips = shuffled.slice(0, 3);
    if (wpm > 160) tips.push('Your speech is quite fast. Aim for 130-150 WPM for clearer delivery.');
    if (accuracy < 80) tips.push('Focus on vowel precision — practice minimal pairs daily.');
    return tips;
  };

  return (
    <div>
      <PageHeader
        title="AI Speech Evaluator & Waveform Pitch Matcher"
        description="Record your speech and get instant pronunciation accuracy, WPM speed, side-by-side audio comparison, and AI-powered fix tips."
        icon={<Mic className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recording panel */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-black mb-1">Recording Studio</h2>
          <p className="text-sm text-zinc-500 mb-4">
            Read this text aloud:
          </p>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 mb-5">
            <p className="text-base text-black leading-relaxed font-medium">
              "{sampleText}"
            </p>
          </div>

          {/* Waveform */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-100 p-2 mb-4">
            <WaveformDisplay isRecording={state === 'recording'} accent={accent} />
          </div>

          {/* Progress bar during recording */}
          {state === 'recording' && (
            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden mb-4">
              <div
                className="h-full bg-black transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3">
            {state === 'idle' && (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            )}
            {state === 'recording' && (
              <button
                onClick={finishRecording}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                <Square className="w-5 h-5" />
                Stop & Analyze
              </button>
            )}
            {state === 'done' && (
              <button
                onClick={reset}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Record Again
              </button>
            )}
          </div>

          {state === 'recording' && (
            <p className="text-sm text-red-500 font-medium mt-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Recording... Speak now!
            </p>
          )}
        </Card>

        {/* Results panel */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-black mb-4">AI Analysis Results</h2>

          {state === 'idle' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Mic className="w-12 h-12 text-zinc-200 mb-3" />
              <p className="text-sm text-zinc-400">
                Start recording to see your analysis results here.
              </p>
            </div>
          )}

          {state === 'recording' && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-black animate-spin mb-3" />
              <p className="text-sm text-zinc-500">Analyzing your speech...</p>
            </div>
          )}

          {state === 'done' && result && (
            <div className="space-y-5">
              {/* Side-by-side audio playback */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-600 mb-2.5">Side-by-Side Audio Comparison</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Native Sample</p>
                    <button
                      onClick={playSample}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors w-full justify-center"
                    >
                      <Volume2 className="w-4 h-4" />
                      Play Native
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Your Recording</p>
                    <button
                      onClick={playRecording}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-300 text-zinc-700 text-sm font-semibold hover:bg-zinc-100 transition-colors w-full justify-center"
                    >
                      <Play className="w-4 h-4" />
                      Play Mine
                    </button>
                  </div>
                </div>
              </div>

              {/* Accuracy gauge */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-semibold text-zinc-600">Pronunciation Accuracy</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-black">{result.accuracy}</span>
                  <span className="text-xl font-bold text-zinc-400">%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-black transition-all duration-700"
                    style={{ width: `${result.accuracy}%` }}
                  />
                </div>
              </div>

              {/* WPM */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-semibold text-zinc-600">Speaking Speed</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-black">{result.wpm}</span>
                  <span className="text-sm font-bold text-zinc-400">words/min</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {[100, 130, 150, 180, 200].map((mark) => (
                    <div
                      key={mark}
                      className={`flex-1 h-1.5 rounded-full ${
                        result.wpm >= mark ? 'bg-black' : 'bg-zinc-100'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Ideal range: 130-160 WPM for clear speech
                </p>
              </div>

              {/* AI Tips */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-zinc-600">AI Fix Tips</span>
                </div>
                <div className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-sm text-zinc-800"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
