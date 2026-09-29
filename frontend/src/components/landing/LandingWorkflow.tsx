import React from 'react';
import { MessageSquareText, Cpu, GitBranch, PlayCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingWorkflow: React.FC = () => {
  const steps = [
    {
      id: '01',
      title: 'REQUEST',
      subtitle: 'Natural Language Input',
      desc: '"Admit patient Rahul Sharma to Cardiology ward"',
      icon: MessageSquareText,
      color: 'border-brand-500/40 text-brand-400 bg-brand-500/10',
    },
    {
      id: '02',
      title: 'AI UNDERSTANDING',
      subtitle: 'Gemini NLP Parsing',
      desc: 'Classifies intent, extracts entities, verifies missing parameters',
      icon: Cpu,
      color: 'border-sky-500/40 text-sky-400 bg-sky-500/10',
    },
    {
      id: '03',
      title: 'DECISION',
      subtitle: 'Deterministic Logic',
      desc: 'Evaluates bed occupancy rules and physician caseload capacity',
      icon: GitBranch,
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
    },
    {
      id: '04',
      title: 'AUTOMATION',
      subtitle: 'Backend State Engine',
      desc: 'Reserves bed, assigns doctor, and dispatches intake tasks',
      icon: PlayCircle,
      color: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    },
    {
      id: '05',
      title: 'RESULT',
      subtitle: 'Audited Operational State',
      desc: 'Patient admitted, nursing alerts triggered, audit log persisted',
      icon: CheckCircle2,
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <section id="workflow" className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800/60 px-3 py-1 rounded-full">
            Autonomous Pipeline
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-100 tracking-tight">
            How Operational Automation Works
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            CareFlow separates natural-language understanding from deterministic execution. The AI
            interprets intent while backend engines execute verified hospital protocols.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col">
                <div className="h-full bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {step.id}
                      </span>
                      <div className={`p-2 rounded-lg border ${step.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-100 mt-1">{step.subtitle}</p>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Arrow Connector for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-600 bg-slate-950 rounded-full p-0.5">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
