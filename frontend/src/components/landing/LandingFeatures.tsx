import React from 'react';
import { BedDouble, Stethoscope, PackageSearch, Truck, CheckSquare, ShieldAlert } from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  const features = [
    {
      title: 'Automated Bed Allocation',
      description:
        'Continuously tracks ICU, Premium, Semi-Private, and General beds. Allocates optimal beds based on departmental requirements and sanitation readiness.',
      icon: BedDouble,
      tag: 'Resource Optimization',
      color: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      tagBg: 'bg-blue-500/8 text-blue-400 border-blue-500/15',
    },
    {
      title: 'Physician Workload Balancing',
      description:
        'Matches incoming patients with active duty specialists considering current patient volume, specialty department, and shift hours.',
      icon: Stethoscope,
      tag: 'Staff Roster',
      color: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/20',
      tagBg: 'bg-cyan-500/8 text-cyan-400 border-cyan-500/15',
    },
    {
      title: 'Inventory Threshold Replenishment',
      description:
        'Monitors critical supplies such as medical oxygen, suture kits, and pharmaceuticals. Auto-generates purchase requisitions before stocks deplete.',
      icon: PackageSearch,
      tag: 'Supply Chain',
      color: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      tagBg: 'bg-amber-500/8 text-amber-400 border-amber-500/15',
    },
    {
      title: 'Ambulance Triage & Fleet Routing',
      description:
        'Coordinates emergency dispatches, sets waypoint destinations, and notifies emergency trauma bays before arrival.',
      icon: Truck,
      tag: 'Fleet Ops',
      color: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      tagBg: 'bg-rose-500/8 text-rose-400 border-rose-500/15',
    },
    {
      title: 'Operational Task Orchestration',
      description:
        'Automatically breaks down high-level hospital events into actionable, traceable tasks for nursing, billing, and biomedical teams.',
      icon: CheckSquare,
      tag: 'Task Automation',
      color: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      tagBg: 'bg-emerald-500/8 text-emerald-400 border-emerald-500/15',
    },
    {
      title: 'Traceable Audit & Escalations',
      description:
        'Maintains immutable operational event logs for compliance. Escalates critical threshold violations directly for supervisory review.',
      icon: ShieldAlert,
      tag: 'Governance',
      color: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      tagBg: 'bg-purple-500/8 text-purple-400 border-purple-500/15',
    },
  ];

  return (
    <section id="capabilities" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-400 px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(0,112,243,0.10)', border: '1px solid rgba(0,112,243,0.20)' }}>
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
            Streamlining Every Pillar of Hospital Operations
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            CareFlow replaces fragmented telephone calls and whiteboard rosters with structured,
            automated operational workflows — powered by Gemini AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group p-6 rounded-xl transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-2.5 rounded-lg border ${item.iconBg}`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${item.tagBg}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
