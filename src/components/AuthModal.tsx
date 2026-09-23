import { useState, type FormEvent } from 'react';
import { X, Mail, Lock, User as UserIcon, Globe, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { AccentType, Level, User } from '@/types';

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, continueAsGuest } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetAccent, setTargetAccent] = useState<AccentType>('american');
  const [level, setLevel] = useState<Level>('B1');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const newUser: User = {
      name: mode === 'signup' ? name.trim() : email.split('@')[0],
      email: email.trim(),
      targetAccent,
      level,
      streak: mode === 'signup' ? 1 : 3,
      isGuest: false,
    };
    login(newUser);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden animate-in">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-xl font-bold text-black">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex gap-1 px-6 pb-4">
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            Sign In
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Target Accent
                  </span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetAccent('american')}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                      targetAccent === 'american'
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    🇺🇸 American
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetAccent('british')}
                    className={`flex-1 py-2.5 rounded-lg border text-sm font-semibold transition-all ${
                      targetAccent === 'british'
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    🇬🇧 British
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Current Level
                  </span>
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm text-black bg-white focus:outline-none focus:border-black transition-colors cursor-pointer"
                >
                  <option value="A1">A1 — Beginner</option>
                  <option value="A2">A2 — Elementary</option>
                  <option value="B1">B1 — Intermediate</option>
                  <option value="B2">B2 — Upper Intermediate</option>
                  <option value="C1">C1 — Advanced</option>
                  <option value="C2">C2 — Native Master</option>
                </select>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600 font-medium px-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-xs text-zinc-400 font-medium">or</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full py-2.5 rounded-lg border border-zinc-200 text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors"
          >
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}
