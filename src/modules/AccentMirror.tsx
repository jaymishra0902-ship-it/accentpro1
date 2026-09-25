import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, CameraOff, Volume2, Smile } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { mouthPositions } from '@/data/content';

export function AccentMirror() {
  const { accent } = useApp();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const filtered = mouthPositions.filter((p) => p.accent === accent);
  const selected = filtered.find((p) => p.id === selectedId) ?? filtered[0];

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      setActive(true);
      setError('');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions to use this feature.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setActive(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const speak = () => {
    if (!selected) return;
    try {
      const utterance = new SpeechSynthesisUtterance(selected.tip.split('—')[0].replace(/[^a-zA-Z\s]/g, '').trim());
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
        title="AI Accent Mirror"
        description="Camera video preview with an overlay guide for ideal mouth and lip shape while practicing phonemes."
        icon={<Camera className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Camera preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-black">Live Camera Preview</h2>
            {!active ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-semibold hover:bg-zinc-50 transition-colors"
              >
                <CameraOff className="w-4 h-4" />
                Stop Camera
              </button>
            )}
          </div>

          <div className="relative aspect-video rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden">
            {active ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Overlay guide */}
                {selected && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="relative">
                      {/* Guide oval for mouth area */}
                      <div
                        className="w-24 h-16 border-2 border-white/70 rounded-full"
                        style={{ boxShadow: '0 0 0 4px rgba(0,0,0,0.3)' }}
                      />
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 border-t-2 border-white/50 rounded-full" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold">
                    {selected ? `Practice: ${selected.sound} ${selected.ipa}` : 'Select a sound'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 text-white text-xs font-semibold">
                    {accent === 'american' ? '🇺🇸 US' : '🇬🇧 UK'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                {error ? (
                  <>
                    <CameraOff className="w-12 h-12 text-zinc-300 mb-3" />
                    <p className="text-sm text-zinc-500 max-w-xs">{error}</p>
                  </>
                ) : (
                  <>
                    <Camera className="w-12 h-12 text-zinc-300 mb-3" />
                    <p className="text-sm text-zinc-500 max-w-xs">
                      Click "Start Camera" to see yourself with a lip-shape overlay guide. Your video stays private — nothing is recorded or uploaded.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Sound selector */}
        <div className="space-y-3">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-black">
                  {selected ? selected.sound : 'Select a Sound'}
                </h3>
                {selected && <p className="text-sm text-zinc-500 font-mono">{selected.ipa}</p>}
              </div>
              {selected && (
                <button
                  onClick={speak}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  Play
                </button>
              )}
            </div>
            {selected && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Lip Shape</p>
                  <p className="text-sm text-zinc-800">{selected.lipShape}</p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1">Tongue</p>
                  <p className="text-sm text-zinc-800">{selected.tonguePosition}</p>
                </div>
                <div className="p-3 rounded-lg bg-black text-white">
                  <p className="text-xs font-bold uppercase tracking-wide mb-1 text-zinc-400">Pro Tip</p>
                  <p className="text-sm">{selected.tip}</p>
                </div>
              </div>
            )}
          </Card>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide sticky top-0 bg-white py-1">
              {accent === 'american' ? '🇺🇸 American Sounds' : '🇬🇧 British Sounds'}
            </h3>
            {filtered.map((p) => (
              <Card
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`p-3 ${selectedId === p.id ? 'border-black ring-1 ring-black' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-black">{p.sound}</p>
                    <p className="text-xs text-zinc-500">{p.ipa}</p>
                  </div>
                  <Smile className="w-4 h-4 text-zinc-300" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
