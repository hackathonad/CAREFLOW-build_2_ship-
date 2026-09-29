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
      gradient: 'from-blue-600/20 to-blue-600/5',
      border: 'border-blue-500/25',
      iconBg: 'bg-blue-500/15 border-blue-500/25',
      iconColor: 'text-blue-400',
      numColor: 'text-blue-500/60',
    },
    {
      id: '02',
      title: 'AI PARSING',
      subtitle: 'Gemini NLP Engine',
      desc: 'Classifies intent, extracts entities, verifies missing parameters',
      icon: Cpu,
      gradient: 'from-cyan-600/20 to-cyan-600/5',
      border: 'border-cyan-500/25',
      iconBg: 'bg-cyan-500/15 border-cyan-500/25',
      iconColor: 'text-cyan-400',
      numColor: 'text-cyan-500/60',
    },
    {
      id: '03',
      title: 'DECISION',
      subtitle: 'Deterministic Logic',
      desc: 'Evaluates bed occupancy rules and physician caseload capacity',
      icon: GitBranch,
      gradient: 'from-purple-600/20 to-purple-600/5',
      border: 'border-purple-500/25',
      iconBg: 'bg-purple-500/15 border-purple-500/25',
      iconColor: 'text-purple-400',
      numColor: 'text-purple-500/60',
    },
    {
      id: '04',
      title: 'AUTOMATION',
      subtitle: 'Backend State Engine',
      desc: 'Reserves bed, assigns doctor, dispatches intake tasks automatically',
      icon: PlayCircle,
      gradient: 'from-amber-600/20 to-amber-600/5',
      border: 'border-amber-500/25',
      iconBg: 'bg-amber-500/15 border-amber-500/25',
      iconColor: 'text-amber-400',
      numColor: 'text-amber-500/60',
    },
    {
      id: '05',
      title: 'RESULT',
      subtitle: 'Audited Operational State',
      desc: 'Patient admitted, nursing alerts triggered, audit log persisted',
      icon: CheckCircle2,
      gradient: 'from-emerald-600/20 to-emerald-600/5',
      border: 'border-emerald-500/25',
      iconBg: 'bg-emerald-500/15 border-emerald-500/25',
      iconColor: 'text-emerald-400',
      numColor: 'text-emerald-500/60',
    },
  ];

  return (
    <section
      id="workflow"
      className="py-24"
      style={{
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-cyan-400 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(6,182,212,0.10)', border: '1px solid rgba(6,182,212,0.20)' }}>
            Autonomous Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            How Operational Automation Works
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            CareFlow separates natural-language understanding from deterministic execution. The AI
            interprets intent while backend engines execute verified hospital protocols.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative flex flex-col">
                <div
                  className={`h-full rounded-xl p-5 border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 bg-gradient-to-b ${step.gradient} ${step.border}`}
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono font-bold ${step.numColor}`}>{step.id}</span>
                      <div className={`p-2 rounded-lg border ${step.iconBg}`}>
                        <Icon className={`w-4 h-4 ${step.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-200 mb-2">{step.subtitle}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Arrow connector */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: '#060b17', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <ArrowRight className="w-2.5 h-2.5 text-slate-600" />
                    </div>
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
