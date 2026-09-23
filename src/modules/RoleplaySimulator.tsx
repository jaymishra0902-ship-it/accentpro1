import { useState } from 'react';
import { MessageSquare, Send, Lightbulb, User as UserIcon, Bot } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { roleplayScenarios } from '@/data/content';

interface Message {
  role: 'npc' | 'user';
  text: string;
  feedback?: string;
}

export function RoleplaySimulator() {
  const { accent } = useApp();
  const filtered = roleplayScenarios.filter((s) => s.accent === accent);
  const [scenarioId, setScenarioId] = useState(filtered[0]?.id ?? '');
  const scenario = filtered.find((s) => s.id === scenarioId) ?? filtered[0];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [started, setStarted] = useState(false);

  if (!scenario) return null;

  const startScenario = () => {
    setMessages([{ role: 'npc', text: scenario.prompts[0] }]);
    setPromptIndex(1);
    setStarted(true);
  };

  const handleSend = () => {
    if (!input.trim() || promptIndex >= scenario.prompts.length) return;

    const userMsg: Message = { role: 'user', text: input.trim() };
    const feedback = scenario.feedback[Math.min(promptIndex - 1, scenario.feedback.length - 1)];
    const userMsgWithFeedback: Message = { ...userMsg, feedback };

    const npcMsg: Message = {
      role: 'npc',
      text: scenario.prompts[promptIndex] ?? "Thank you for your time. That concludes our conversation.",
    };

    setMessages((prev) => [...prev, userMsgWithFeedback, npcMsg]);
    setInput('');
    setPromptIndex((prev) => prev + 1);
  };

  const reset = () => {
    setMessages([]);
    setInput('');
    setPromptIndex(0);
    setStarted(false);
  };

  const switchScenario = (id: string) => {
    setScenarioId(id);
    reset();
  };

  return (
    <div>
      <PageHeader
        title="Real-World AI Roleplay Simulator"
        description="Practice real-life scenarios with live accent & grammar feedback cards."
        icon={<MessageSquare className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scenario selector */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wide mb-2">
            {accent === 'american' ? '🇺🇸 American Scenarios' : '🇬🇧 British Scenarios'}
          </h3>
          {filtered.map((s) => (
            <Card
              key={s.id}
              onClick={() => switchScenario(s.id)}
              className={`p-4 ${scenarioId === s.id ? 'border-black ring-1 ring-black' : ''}`}
            >
              <p className="text-sm font-bold text-black">{s.title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.setting}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                  {s.difficulty}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Chat interface */}
        <div className="lg:col-span-2">
          <Card className="flex flex-col h-[600px]">
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black">{scenario.title}</p>
                <p className="text-xs text-zinc-500">{scenario.setting}</p>
              </div>
              {started && (
                <button
                  onClick={reset}
                  className="text-xs font-semibold text-zinc-500 hover:text-black px-2.5 py-1 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  Restart
                </button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {!started ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-12 h-12 text-zinc-200 mb-3" />
                  <p className="text-sm text-zinc-500 mb-4 max-w-xs">
                    Ready to practice? Start the conversation and respond naturally. You'll get accent feedback after each reply.
                  </p>
                  <button
                    onClick={startScenario}
                    className="px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-zinc-800 transition-colors"
                  >
                    Start Roleplay
                  </button>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'npc' ? 'bg-black' : 'bg-zinc-200'
                    }`}>
                      {msg.role === 'npc' ? (
                        <Bot className="w-4 h-4 text-white" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-zinc-600" />
                      )}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                        msg.role === 'npc'
                          ? 'bg-zinc-100 text-zinc-800 rounded-tl-sm'
                          : 'bg-black text-white rounded-tr-sm'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.feedback && (
                        <div className="mt-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-700">{msg.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            {started && promptIndex < scenario.prompts.length + 1 && (
              <div className="p-4 border-t border-zinc-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your response..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:border-black transition-colors"
                  />
                  <button
                    onClick={handleSend}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white hover:bg-zinc-800 transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {started && promptIndex >= scenario.prompts.length + 1 && (
              <div className="p-4 border-t border-zinc-100 text-center">
                <p className="text-sm font-semibold text-black mb-2">Roleplay complete!</p>
                <button
                  onClick={reset}
                  className="text-sm font-semibold text-zinc-600 hover:text-black"
                >
                  Try again
                </button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
