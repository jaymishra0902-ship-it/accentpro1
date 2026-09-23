import { useState, useRef, useEffect } from 'react';
import { PlayCircle, Play, Pause, Gauge } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { shadowingTracks } from '@/data/content';

type Speed = 0.5 | 0.75 | 1;

export function ShadowingPlayer() {
  const { accent } = useApp();
  const filtered = shadowingTracks.filter((t) => t.accent === accent);
  const [trackId, setTrackId] = useState(filtered[0]?.id ?? '');
  const track = filtered.find((t) => t.id === trackId) ?? filtered[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const timerRef = useRef<number | null>(null);

  if (!track) return null;

  const segmentDuration = 4 / speed; // 4 seconds per segment, adjusted by speed

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setTimeout(() => {
        if (currentSegment < track.segments.length - 1) {
          setCurrentSegment((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentSegment(0);
        }
      }, segmentDuration * 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentSegment, segmentDuration, track.segments.length]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const switchTrack = (id: string) => {
    setTrackId(id);
    setIsPlaying(false);
    setCurrentSegment(0);
  };

  const speakSegment = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  useEffect(() => {
    if (isPlaying) {
      speakSegment(track.segments[currentSegment].text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSegment, isPlaying]);

  const progress = ((currentSegment + 1) / track.segments.length) * 100;

  return (
    <div>
      <PageHeader
        title="Slow-Mo Shadowing Player"
        description="Subtitle-synced audio player with speed controls for accent shadowing practice."
        icon={<PlayCircle className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Track selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-2">
            {accent === 'american' ? '🇺🇸 American Tracks' : '🇬🇧 British Tracks'}
          </h3>
          {filtered.map((t) => (
            <Card
              key={t.id}
              onClick={() => switchTrack(t.id)}
              className={`p-4 ${trackId === t.id ? 'border-black ring-1 ring-black' : ''}`}
            >
              <p className="text-sm font-bold text-black">{t.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{t.subtitle}</p>
              <p className="text-xs text-zinc-400 mt-1">{t.duration} · {t.segments.length} segments</p>
            </Card>
          ))}
        </div>

        {/* Player */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-black">{track.title}</h2>
                <p className="text-sm text-zinc-500">{track.subtitle}</p>
              </div>
              <span className="text-sm font-mono text-zinc-400">{track.duration}</span>
            </div>

            {/* Current subtitle */}
            <div className="p-6 rounded-xl bg-zinc-50 border border-zinc-100 mb-5 text-center min-h-[100px] flex items-center justify-center">
              <p className="text-xl sm:text-2xl font-bold text-black leading-snug">
                {track.segments[currentSegment].text}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden mb-5">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Segment dots */}
            <div className="flex items-center justify-center gap-1.5 mb-5">
              {track.segments.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentSegment(i); speakSegment(track.segments[i].text); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSegment ? 'bg-black scale-150' : i < currentSegment ? 'bg-zinc-400' : 'bg-zinc-200'
                  }`}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              {/* Speed control */}
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-zinc-400" />
                <div className="flex rounded-lg border border-zinc-200 overflow-hidden">
                  {([0.5, 0.75, 1] as Speed[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-3 py-1.5 text-sm font-semibold transition-all ${
                        speed === s
                          ? 'bg-black text-white'
                          : 'bg-white text-zinc-600 hover:bg-zinc-50'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* All segments preview */}
            <div className="mt-5 pt-5 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
                All Segments
              </h3>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {track.segments.map((seg, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrentSegment(i); speakSegment(seg.text); }}
                    className={`w-full text-left p-2.5 rounded-lg text-sm transition-all ${
                      i === currentSegment
                        ? 'bg-black text-white'
                        : 'bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    <span className="text-xs font-mono opacity-50 mr-2">{i + 1}</span>
                    {seg.text}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
