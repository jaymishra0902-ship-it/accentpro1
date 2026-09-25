import type { MouthPosition } from '@/types';

export function MouthVisualizer({ position }: { position: MouthPosition }) {
  const isRounded = position.lipShape.toLowerCase().includes('round');
  const isPursed = position.lipShape.toLowerCase().includes('purs');
  const isSpread = position.lipShape.toLowerCase().includes('spread');
  const isProtruding = position.id.includes('th');
  const isGlottal = position.id === 'glottal';
  const isRC = position.id === 'r-colored';
  const isRoundedOrPursed = isRounded || isPursed;

  // Determine tongue position from description
  const tongueHigh = position.tonguePosition.toLowerCase().includes('high');
  const tongueLow = position.tonguePosition.toLowerCase().includes('low');
  const tongueBack = position.tonguePosition.toLowerCase().includes('back');
  const tongueForward = position.tonguePosition.toLowerCase().includes('forward');
  const tongueCurl = position.tonguePosition.toLowerCase().includes('curl') || position.tonguePosition.toLowerCase().includes('retro');

  // Lip path based on shape
  const upperLipPath = isRoundedOrPursed
    ? 'M 65 95 Q 75 88 85 90 Q 92 87 100 91 Q 108 87 115 90 Q 125 88 135 95'
    : isSpread
    ? 'M 45 95 Q 70 82 100 88 Q 130 82 155 95'
    : 'M 50 95 Q 70 85 100 90 Q 130 85 150 95';

  const lowerLipPath = isRoundedOrPursed
    ? 'M 65 95 Q 100 118 135 95'
    : isSpread
    ? 'M 45 95 Q 100 112 155 95'
    : 'M 50 95 Q 100 115 150 95';

  // Tongue position based on description
  let tongueEl;
  if (isProtruding) {
    tongueEl = <ellipse cx="100" cy="108" rx="8" ry="14" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else if (isGlottal) {
    tongueEl = (
      <>
        <ellipse cx="100" cy="110" rx="20" ry="6" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />
        <line x1="92" y1="120" x2="108" y2="130" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="108" y1="120" x2="92" y2="130" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  } else if (tongueCurl || isRC) {
    tongueEl = (
      <path
        d="M 85 108 Q 100 95 115 108 Q 115 118 100 118 Q 85 118 85 108"
        fill="#f4a8a8"
        stroke="#e88a8a"
        strokeWidth="1"
      />
    );
  } else if (tongueHigh && tongueForward) {
    tongueEl = <ellipse cx="100" cy="102" rx="22" ry="7" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else if (tongueHigh && tongueBack) {
    tongueEl = <ellipse cx="110" cy="104" rx="18" ry="6" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else if (tongueLow) {
    tongueEl = <ellipse cx="100" cy="112" rx="28" ry="4" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else if (tongueBack) {
    tongueEl = <ellipse cx="112" cy="108" rx="16" ry="6" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else if (tongueForward) {
    tongueEl = <ellipse cx="88" cy="108" rx="16" ry="6" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  } else {
    tongueEl = <ellipse cx="100" cy="108" rx="25" ry="5" fill="#f4a8a8" stroke="#e88a8a" strokeWidth="1" />;
  }

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <svg viewBox="0 0 200 160" className="w-full">
        {/* Face outline */}
        <path d="M 20 100 Q 20 30 100 20 Q 180 30 180 100" fill="none" stroke="#d4d4d8" strokeWidth="1.5" />

        {/* Nose */}
        <path d="M 95 55 L 100 68 L 105 55" fill="none" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />

        {/* Upper lip */}
        <path d={upperLipPath} fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />

        {/* Lower lip */}
        <path d={lowerLipPath} fill="rgba(0,0,0,0.03)" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />

        {/* Teeth for TH sounds */}
        {isProtruding && (
          <>
            <rect x="85" y="92" width="30" height="6" rx="1" fill="white" stroke="#d4d4d8" strokeWidth="0.5" />
            <rect x="85" y="98" width="30" height="5" rx="1" fill="white" stroke="#d4d4d8" strokeWidth="0.5" />
          </>
        )}

        {/* Tongue */}
        {tongueEl}

        {/* R-colored curl indicator */}
        {isRC && (
          <path
            d="M 88 105 Q 100 98 112 105 Q 112 112 100 112 Q 88 112 88 105"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        )}

        {/* IPA label */}
        <text x="100" y="150" textAnchor="middle" className="fill-zinc-800 font-bold" style={{ fontSize: '14px' }}>
          {position.ipa}
        </text>
      </svg>
    </div>
  );
}
