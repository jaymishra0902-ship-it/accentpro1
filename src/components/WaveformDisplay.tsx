import { useEffect, useRef, useState } from 'react';

interface WaveformDisplayProps {
  isRecording: boolean;
  accent: 'american' | 'british';
}

export function WaveformDisplay({ isRecording, accent }: WaveformDisplayProps) {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 48 }, () => 10 + Math.random() * 20)
  );
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      const basePitch = accent === 'american' ? 1.0 : 0.85;
      const animate = () => {
        setBars((prev) =>
          prev.map((_, i) => {
            const phase = Date.now() / 200 + i * 0.3;
            const base = 15 + Math.sin(phase) * 25 + Math.random() * 30;
            return Math.max(8, Math.min(100, base * basePitch));
          })
        );
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(Array.from({ length: 48 }, () => 10 + Math.random() * 15));
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRecording, accent]);

  return (
    <div className="flex items-center justify-center gap-0.5 h-24 py-4">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-black transition-all duration-100"
          style={{
            height: `${h}%`,
            opacity: isRecording ? 0.4 + (h / 100) * 0.6 : 0.2,
          }}
        />
      ))}
    </div>
  );
}
