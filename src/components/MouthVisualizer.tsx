import type { MouthPosition } from '@/types';

export function MouthVisualizer({ position }: { position: MouthPosition }) {
  const isRounded = position.lipShape.toLowerCase().includes('round');
  const isProtruding = position.id === 'th' || position.id === 'th-uk';
  const isGlottal = position.id === 'glottal';

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 160" className="w-full">
        {/* Face outline (partial) */}
        <path
          d="M 20 100 Q 20 30 100 20 Q 180 30 180 100"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="1.5"
        />

        {/* Nose */}
        <path
          d="M 95 55 L 100 68 L 105 55"
          fill="none"
          stroke="#d4d4d8"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Upper lip */}
        <path
          d={
            isRounded
              ? 'M 60 95 Q 70 88 80 90 Q 90 88 100 92 Q 110 88 120 90 Q 130 88 140 95'
              : 'M 50 95 Q 70 85 100 90 Q 130 85 150 95'
          }
          fill="none"
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Lower lip */}
        <path
          d={
            isRounded
              ? 'M 60 95 Q 100 120 140 95'
              : 'M 50 95 Q 100 115 150 95'
          }
          fill="rgba(0,0,0,0.03)"
          stroke="#18181b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Teeth (for TH sounds) */}
        {isProtruding && (
          <>
            <rect x="85" y="92" width="30" height="6" rx="1" fill="white" stroke="#d4d4d8" strokeWidth="0.5" />
            <rect x="85" y="98" width="30" height="5" rx="1" fill="white" stroke="#d4d4d8" strokeWidth="0.5" />
          </>
        )}

        {/* Tongue */}
        {isProtruding ? (
          <ellipse
            cx="100"
            cy="108"
            rx="8"
            ry="14"
            fill="#f4a8a8"
            stroke="#e88a8a"
            strokeWidth="1"
          />
        ) : isRounded ? (
          <ellipse
            cx="100"
            cy="105"
            rx="12"
            ry="8"
            fill="#f4a8a8"
            stroke="#e88a8a"
            strokeWidth="1"
          />
        ) : isGlottal ? (
          <>
            <ellipse cx="100" cy="110" rx="20" ry="6" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />
            {/* Glottal stop indicator - X mark in throat */}
            <line x1="92" y1="120" x2="108" y2="130" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            <line x1="108" y1="120" x2="92" y2="130" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <ellipse
            cx="100"
            cy="108"
            rx="25"
            ry="5"
            fill="#f4a8a8"
            stroke="#e88a8a"
            strokeWidth="1"
          />
        )}

        {/* R-colored indicator - tongue curl */}
        {position.id === 'r-colored' && (
          <path
            d="M 88 105 Q 100 98 112 105 Q 112 112 100 112 Q 88 112 88 105"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        )}

        {/* IPA label */}
        <text
          x="100"
          y="150"
          textAnchor="middle"
          className="fill-zinc-800 font-bold"
          style={{ fontSize: '14px' }}
        >
          {position.ipa}
        </text>
      </svg>
    </div>
  );
}
