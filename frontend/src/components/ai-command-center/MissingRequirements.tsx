import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface MissingRequirementsProps {
  missing: string[];
}

export const MissingRequirements: React.FC<MissingRequirementsProps> = ({ missing }) => {
  if (missing.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 mb-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Safety Guardrail Triggered — Missing Operational Requirements
          </h4>
          <p className="mt-1 text-xs text-amber-200/80">
            To prevent accidental or incorrect hospital allocation, automated execution was paused.
            The following parameters must be provided:
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {missing.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-2 text-xs text-amber-300 font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
