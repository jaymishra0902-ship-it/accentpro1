import {
  LayoutDashboard,
  Smile,
  GraduationCap,
  Youtube,
  Mic,
  MessageSquare,
  ArrowLeftRight,
  Link2,
  Repeat,
  BookOpen,
  PlayCircle,
  BarChart3,
  Type,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { ModuleId } from '@/types';

interface NavItem {
  id: ModuleId;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'phonics', label: 'Phonics Visualizer', icon: Smile },
  { id: 'curriculum', label: 'Curriculum', icon: GraduationCap },
  { id: 'youtube', label: 'YouTube Hub', icon: Youtube },
  { id: 'evaluator', label: 'Speech Evaluator', icon: Mic },
  { id: 'roleplay', label: 'Roleplay Simulator', icon: MessageSquare },
  { id: 'indianism', label: 'Indianism Converter', icon: ArrowLeftRight },
  { id: 'connected', label: 'Connected Speech', icon: Link2 },
  { id: 'drills', label: 'Daily Drills', icon: Repeat },
  { id: 'slang', label: 'Slang & Idioms', icon: BookOpen },
  { id: 'shadowing', label: 'Shadowing Player', icon: PlayCircle },
  { id: 'ipa', label: 'IPA Chart', icon: Type },
  { id: 'progress', label: 'Progress Profile', icon: BarChart3 },
];

export function Sidebar() {
  const { activeModule, setActiveModule } = useApp();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-zinc-200 bg-white h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-black text-white'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all shrink-0 ${
                  active
                    ? 'bg-black text-white'
                    : 'text-zinc-500 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="whitespace-nowrap">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
