import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operational Data Unreachable',
  message = 'Unable to fetch records from the backend API. Please verify server connection and try again.',
  onRetry,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between p-3.5 rounded-lg bg-rose-500/8 border border-rose-500/20 text-xs">
        <div className="flex items-center gap-2 text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-3 text-xs font-medium text-rose-400 hover:text-rose-300 flex-shrink-0 underline underline-offset-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-[fadeIn_0.3s_ease-out]">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/8 border border-rose-500/20 flex items-center justify-center">
          <WifiOff className="w-7 h-7 text-rose-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">!</span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{message}</p>

      {/* Diagnostic info */}
      <div className="w-full max-w-xs bg-[#0f172a] border border-white/[0.06] rounded-lg p-3.5 mb-6 text-left">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Diagnostic</p>
        <div className="space-y-1.5 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Backend API</span>
            <span className="text-rose-400 font-mono">localhost:5000</span>
          </div>
          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-rose-400">Unreachable</span>
          </div>
          <div className="flex justify-between">
            <span>Action</span>
            <span className="text-amber-400">Run npm start in /backend</span>
          </div>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_12px_rgba(0,112,243,0.3)] transition-all hover:shadow-[0_4px_20px_rgba(0,112,243,0.4)] hover:-translate-y-px"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
