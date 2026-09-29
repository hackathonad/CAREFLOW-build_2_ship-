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
    },
    {
      title: 'Physician Workload Balancing',
      description:
        'Matches incoming patients with active duty specialists considering current patient volume, specialty department, and shift hours.',
      icon: Stethoscope,
      tag: 'Staff Roster',
    },
    {
      title: 'Inventory Threshold Replenishment',
      description:
        'Monitors critical supplies such as medical oxygen, suture kits, and pharmaceuticals. Auto-generates purchase requisitions before stocks deplete.',
      icon: PackageSearch,
      tag: 'Supply Chain',
    },
    {
      title: 'Ambulance Triage & Fleet Routing',
      description:
        'Coordinates emergency dispatches, sets waypoint destinations, and notifies emergency trauma bays before arrival.',
      icon: Truck,
      tag: 'Fleet Ops',
    },
    {
      title: 'Operational Task Orchestration',
      description:
        'Automatically breaks down high-level hospital events into actionable, traceable tasks for nursing, billing, and biomedical teams.',
      icon: CheckSquare,
      tag: 'Task Automation',
    },
    {
      title: 'Traceable Audit & Escalations',
      description:
        'Maintains immutable operational event logs for compliance. Escalates critical threshold violations directly for supervisory review.',
      icon: ShieldAlert,
      tag: 'Governance',
    },
  ];

  return (
    <section id="capabilities" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800/60 px-3 py-1 rounded-full">
            Core Modules
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-100 tracking-tight">
            Streamlining Every Pillar of Hospital Operations
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            CareFlow replaces fragmented telephone calls and whiteboard rosters with structured,
            automated operational workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:translate-y-[-2px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-brand-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
