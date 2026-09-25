import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/modules/Dashboard';
import { PhonicsVisualizer } from '@/modules/PhonicsVisualizer';
import { Curriculum } from '@/modules/Curriculum';
import { YouTubeHub } from '@/modules/YouTubeHub';
import { SpeechEvaluator } from '@/modules/SpeechEvaluator';
import { RoleplaySimulator } from '@/modules/RoleplaySimulator';
import { IndianismConverter } from '@/modules/IndianismConverter';
import { ConnectedSpeech } from '@/modules/ConnectedSpeech';
import { DailyDrills } from '@/modules/DailyDrills';
import { SlangVault } from '@/modules/SlangVault';
import { ShadowingPlayer } from '@/modules/ShadowingPlayer';
import { IPAChart } from '@/modules/IPAChart';
import { AccentMirror } from '@/modules/AccentMirror';
import { TextToIPA } from '@/modules/TextToIPA';
import { CorporateComms } from '@/modules/CorporateComms';
import { Achievements } from '@/modules/Achievements';
import { Certificate } from '@/modules/Certificate';
import { ProgressProfile } from '@/modules/ProgressProfile';
import type { ModuleId } from '@/types';

const modules: Record<ModuleId, () => JSX.Element | null> = {
  dashboard: Dashboard,
  phonics: PhonicsVisualizer,
  curriculum: Curriculum,
  youtube: YouTubeHub,
  evaluator: SpeechEvaluator,
  roleplay: RoleplaySimulator,
  indianism: IndianismConverter,
  connected: ConnectedSpeech,
  drills: DailyDrills,
  slang: SlangVault,
  shadowing: ShadowingPlayer,
  ipa: IPAChart,
  mirror: AccentMirror,
  text2ipa: TextToIPA,
  corporate: CorporateComms,
  achievements: Achievements,
  certificate: Certificate,
  progress: ProgressProfile,
};

function AppContent() {
  const { activeModule } = useApp();
  const ActiveModule = modules[activeModule] ?? Dashboard;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 min-w-0">
          <ActiveModule />
        </main>
      </div>
      <AuthModal />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
