import { useRef, useState } from 'react';
import { Award, Download, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';

export function Certificate() {
  const { user, skillScores, accent, xp, unlockBadge } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState(user?.name ?? '');
  const [generated, setGenerated] = useState(false);

  const avgScore = Math.round(
    (skillScores.pronunciation +
      skillScores.intonation +
      skillScores.fluency +
      skillScores.vocabulary +
      skillScores.consistency) / 5
  );

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1000;
    const h = 700;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Outer border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Inner border
    ctx.strokeStyle = '#D4D4D8';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Corner decorations
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    const corners = [
      [40, 40], [w - 40, 40], [40, h - 40], [w - 40, h - 40],
    ];
    corners.forEach(([cx, cy], i) => {
      ctx.beginPath();
      if (i === 0) { ctx.moveTo(cx, cy + 30); ctx.lineTo(cx, cy); ctx.lineTo(cx + 30, cy); }
      if (i === 1) { ctx.moveTo(cx, cy + 30); ctx.lineTo(cx, cy); ctx.lineTo(cx - 30, cy); }
      if (i === 2) { ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy); ctx.lineTo(cx + 30, cy); }
      if (i === 3) { ctx.moveTo(cx, cy - 30); ctx.lineTo(cx, cy); ctx.lineTo(cx - 30, cy); }
      ctx.stroke();
    });

    // Title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 42px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('AccentPro', w / 2, 120);

    ctx.font = '16px Georgia, serif';
    ctx.fillStyle = '#71717A';
    ctx.fillText('AI English Accent Coach', w / 2, 145);

    // Certificate title
    ctx.font = 'bold 28px Georgia, serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('Certificate of Achievement', w / 2, 200);

    ctx.font = '16px Georgia, serif';
    ctx.fillStyle = '#71717A';
    ctx.fillText('This is to certify that', w / 2, 250);

    // Name
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(name || 'Your Name', w / 2, 300);

    // Underline
    const nameWidth = ctx.measureText(name || 'Your Name').width;
    ctx.beginPath();
    ctx.moveTo(w / 2 - nameWidth / 2 - 10, 315);
    ctx.lineTo(w / 2 + nameWidth / 2 + 10, 315);
    ctx.strokeStyle = '#D4D4D8';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Description
    ctx.font = '16px Georgia, serif';
    ctx.fillStyle = '#52525B';
    ctx.fillText('has successfully completed the AccentPro training program', w / 2, 360);
    ctx.fillText(`and is certified as a C2 Native Speaker in the`, w / 2, 385);
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(`${accent === 'american' ? 'American (US)' : 'British (UK)'} English Accent`, w / 2, 415);

    // Score breakdown
    ctx.font = '14px Georgia, serif';
    ctx.fillStyle = '#71717A';
    ctx.fillText('Score Breakdown', w / 2, 465);

    const scores = [
      { label: 'Pronunciation', value: skillScores.pronunciation },
      { label: 'Intonation', value: skillScores.intonation },
      { label: 'Fluency', value: skillScores.fluency },
      { label: 'Vocabulary', value: skillScores.vocabulary },
      { label: 'Consistency', value: skillScores.consistency },
    ];

    const colWidth = 130;
    const startX = w / 2 - (scores.length * colWidth) / 2 + colWidth / 2;
    scores.forEach((s, i) => {
      const x = startX + i * colWidth;
      ctx.font = '11px Georgia, serif';
      ctx.fillStyle = '#71717A';
      ctx.fillText(s.label, x, 490);
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(`${s.value}%`, x, 515);
    });

    // Average score
    ctx.font = '14px Georgia, serif';
    ctx.fillStyle = '#52525B';
    ctx.fillText(`Overall Score: ${avgScore}%`, w / 2, 555);

    // Date and signature
    ctx.font = '14px Georgia, serif';
    ctx.fillStyle = '#71717A';
    ctx.textAlign = 'left';
    ctx.fillText(`Date: ${today}`, 100, h - 80);
    ctx.fillText(`Total XP: ${xp}`, 100, h - 60);

    ctx.textAlign = 'right';
    ctx.fillText('AccentPro', w - 100, h - 80);
    ctx.fillText('Authorized Signature', w - 100, h - 60);

    // Signature line
    ctx.beginPath();
    ctx.moveTo(w - 200, h - 70);
    ctx.lineTo(w - 100, h - 70);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.stroke();

    setGenerated(true);
    unlockBadge('native-certified');
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `AccentPro-Certificate-${name.replace(/\s/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      <PageHeader
        title="C2 Native Speaker Certificate"
        description="Generate and download your official AccentPro certification with your name, scores, and completion date."
        icon={<Award className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-black mb-3">Certificate Details</h3>

            <label className="block mb-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide block mb-1.5">
                Your Name
              </span>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </label>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Accent</span>
                <span className="font-semibold text-black">
                  {accent === 'american' ? '🇺🇸 American' : '🇬🇧 British'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Level</span>
                <span className="font-semibold text-black">{user?.level ?? 'B1'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Overall Score</span>
                <span className="font-semibold text-black">{avgScore}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Total XP</span>
                <span className="font-semibold text-black">{xp}</span>
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors mb-2"
            >
              <Award className="w-4 h-4" />
              Generate Certificate
            </button>
            {generated && (
              <button
                onClick={download}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            )}
          </Card>

          {/* Score breakdown */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-black mb-3">Score Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: 'Pronunciation', value: skillScores.pronunciation },
                { label: 'Intonation', value: skillScores.intonation },
                { label: 'Fluency', value: skillScores.fluency },
                { label: 'Vocabulary', value: skillScores.vocabulary },
                { label: 'Consistency', value: skillScores.consistency },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-500">{s.label}</span>
                    <span className="font-bold text-black">{s.value}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-black"
                      style={{ width: `${s.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Certificate preview */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                className="w-full"
                style={{ maxHeight: '600px' }}
              />
              {!generated && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <Award className="w-16 h-16 text-zinc-200 mb-4" />
                  <p className="text-sm text-zinc-400 max-w-xs">
                    Enter your name and click "Generate Certificate" to create your official AccentPro C2 Native Speaker Certification.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
