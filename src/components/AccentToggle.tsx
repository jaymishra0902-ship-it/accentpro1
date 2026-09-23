import { useApp } from '@/context/AppContext';

export function AccentToggle() {
  const { accent, setAccent, user } = useApp();

  const isAmerican = accent === 'american';
  const canToggle = !user || user.isGuest || user.targetAccent !== accent;

  // We always allow toggling - the toggle changes the active accent for the session
  return (
    <div className="flex items-center rounded-full border border-zinc-200 bg-zinc-50 p-0.5">
      <button
        onClick={() => setAccent('american')}
        className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          isAmerican
            ? 'bg-black text-white shadow-sm'
            : 'text-zinc-600 hover:text-black'
        }`}
      >
        <span className="text-sm">🇺🇸</span>
        <span className="hidden sm:inline">US</span>
      </button>
      <button
        onClick={() => setAccent('british')}
        className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all ${
          !isAmerican
            ? 'bg-black text-white shadow-sm'
            : 'text-zinc-600 hover:text-black'
        }`}
      >
        <span className="text-sm">🇬🇧</span>
        <span className="hidden sm:inline">UK</span>
      </button>
    </div>
  );
}
