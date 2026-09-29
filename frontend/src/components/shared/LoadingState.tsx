import React from 'react';
import { Loader2, Activity } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
  compact?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading operational data...',
  rows = 5,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-center py-8 space-x-2.5 text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
        <span className="text-sm">{message}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Spinner */}
      <div className="relative mb-6">
        <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-blue-500 border-r-blue-500/50 border-b-blue-500/20 border-l-transparent animate-spin" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-4 h-4 text-blue-400 opacity-60" />
        </div>
      </div>

      <p className="text-sm font-medium text-slate-300 mb-1">{message}</p>
      <p className="text-xs text-slate-600 mb-8">Connecting to backend services...</p>

      {/* Skeleton rows */}
      <div className="w-full max-w-2xl space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-11 w-full rounded-lg shimmer"
            style={{
              animationDelay: `${i * 100}ms`,
              opacity: 1 - i * 0.12,
            }}
          />
        ))}
      </div>
    </div>
  );
};
