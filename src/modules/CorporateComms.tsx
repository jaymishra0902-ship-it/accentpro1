import { useState } from 'react';
import { Briefcase, Volume2, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/Card';
import { corporateTopics } from '@/data/content';

export function CorporateComms() {
  const { accent } = useApp();
  const [activeId, setActiveId] = useState(corporateTopics[0].id);

  const active = corporateTopics.find((t) => t.id === activeId)!;

  const speak = (text: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = accent === 'american' ? 'en-US' : 'en-GB';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } catch {
      // not available
    }
  };

  return (
    <div>
      <PageHeader
        title="Corporate & Business Communication"
        description="Workplace English modules covering executive presentations, polite refusals, salary negotiation, and email phrasal verbs."
        icon={<Briefcase className="w-7 h-7 text-zinc-400" />}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topic list */}
        <div className="space-y-2">
          {corporateTopics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => setActiveId(topic.id)}
              className={`p-4 ${activeId === topic.id ? 'border-black ring-1 ring-black' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                  {topic.category}
                </span>
              </div>
              <p className="text-sm font-bold text-black">{topic.title}</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{topic.description}</p>
            </Card>
          ))}
        </div>

        {/* Active topic */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-black">{active.title}</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 font-semibold">
                {active.category}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mb-5">{active.description}</p>

            <div className="space-y-3">
              {active.phrases.map((phrase, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-100 bg-zinc-50">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
                    {phrase.context}
                  </p>
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                    {/* Indianism */}
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                      <p className="text-xs font-bold text-red-500 uppercase mb-1.5">Avoid</p>
                      <p className="text-sm text-zinc-800 font-medium leading-snug">
                        "{phrase.indianism}"
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-zinc-300" />
                    </div>

                    {/* Native */}
                    <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-bold text-green-600 uppercase">Use Instead</p>
                        <button
                          onClick={() => speak(phrase.native)}
                          className="p-1 rounded hover:bg-green-100 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-green-600" />
                        </button>
                      </div>
                      <p className="text-sm text-zinc-800 font-medium leading-snug">
                        "{phrase.native}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
