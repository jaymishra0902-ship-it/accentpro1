import type { SkillScores } from '@/types';

interface RadarChartProps {
  scores: SkillScores;
  size?: number;
}

const labels: { key: keyof SkillScores; label: string }[] = [
  { key: 'pronunciation', label: 'Pronunciation' },
  { key: 'intonation', label: 'Intonation' },
  { key: 'fluency', label: 'Fluency' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'consistency', label: 'Consistency' },
];

export function RadarChart({ scores, size = 280 }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 50;
  const angleStep = (Math.PI * 2) / labels.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataPoints = labels.map((l, i) => getPoint(scores[l.key], i));
  const polygonPoints = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  const gridLevels = [20, 40, 60, 80, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid polygons */}
      {gridLevels.map((level) => {
        const pts = labels
          .map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (level / 100) * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          })
          .join(' ');
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {labels.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(0,0,0,0.08)"
        stroke="#000000"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#000000" />
      ))}

      {/* Labels */}
      {labels.map((l, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelR = radius + 28;
        const x = center + labelR * Math.cos(angle);
        const y = center + labelR * Math.sin(angle);
        const score = scores[l.key];
        return (
          <g key={l.key}>
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-zinc-700"
            >
              {l.label}
            </text>
            <text
              x={x}
              y={y + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] font-bold fill-black"
            >
              {score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
