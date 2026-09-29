import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ProposedActionsProps {
  actions: string[];
}

export const ProposedActions: React.FC<ProposedActionsProps> = ({ actions }) => {
  if (actions.length === 0) return null;

  return (
    <div className="mb-6">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
        Proposed Deterministic Actions
      </h4>
      <div className="space-y-2">
        {actions.map((action, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
          >
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="font-mono text-[11px] text-slate-400">[{idx + 1}]</span>
            <span className="capitalize">{action.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
