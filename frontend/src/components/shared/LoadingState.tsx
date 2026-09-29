import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading operational telemetry...',
  rows = 4,
}) => {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center">
      <div className="flex items-center space-x-3 text-brand-400 mb-6">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium text-slate-300">{message}</span>
      </div>

      <div className="w-full max-w-3xl space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-full bg-slate-900/60 border border-slate-800/80 rounded-lg animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
