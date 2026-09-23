import { Flame, LogOut, User as UserIcon, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Logo } from './Logo';
import { AccentToggle } from './AccentToggle';

export function Header() {
  const { user, logout, setAuthModalOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <Logo size={36} />
          <span className="text-xl font-bold tracking-tight text-black">
            Accent<span className="text-zinc-500">Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <AccentToggle />

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-700">
                  {user.streak} day{user.streak !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-zinc-800 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-colors text-sm font-medium text-zinc-700"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
