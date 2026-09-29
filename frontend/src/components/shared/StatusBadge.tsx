import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'xs' | 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', pulse }) => {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  const getStyles = (st: string): { bg: string; text: string; border: string; dot: string } => {
    switch (st) {
      // ── Patients ──
      case 'admitted':
        return { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/25', dot: 'bg-blue-400' };
      case 'resting':
        return { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/25', dot: 'bg-indigo-400' };
      case 'under_observation':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'needs_attention':
        return { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/25', dot: 'bg-orange-400' };
      case 'critical':
        return { bg: 'bg-rose-500/12', text: 'text-rose-300', border: 'border-rose-500/30', dot: 'bg-rose-400' };
      case 'discharge_ready':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
      case 'discharged':
        return { bg: 'bg-slate-700/40', text: 'text-slate-400', border: 'border-slate-600/30', dot: 'bg-slate-500' };

      // ── Beds ──
      case 'available':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
      case 'occupied':
        return { bg: 'bg-sky-500/10', text: 'text-sky-300', border: 'border-sky-500/25', dot: 'bg-sky-400' };
      case 'reserved':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'maintenance':
        return { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/25', dot: 'bg-rose-400' };

      // ── Inventory ──
      case 'normal':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
      case 'low_stock':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'critical_stock':
      case 'out_of_stock':
        return { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/25', dot: 'bg-rose-400' };

      // ── Ambulances ──
      case 'dispatched':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'en_route':
        return { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/25', dot: 'bg-blue-400' };
      case 'at_hospital':
        return { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/25', dot: 'bg-purple-400' };

      // ── Tasks / Approvals ──
      case 'pending':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'in_progress':
        return { bg: 'bg-blue-500/10', text: 'text-blue-300', border: 'border-blue-500/25', dot: 'bg-blue-400' };
      case 'completed':
      case 'approved':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
      case 'escalated':
      case 'rejected':
        return { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/25', dot: 'bg-rose-400' };

      // ── Priority ──
      case 'urgent':
      case 'high':
        return { bg: 'bg-rose-500/10', text: 'text-rose-300', border: 'border-rose-500/25', dot: 'bg-rose-400' };
      case 'medium':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };
      case 'low':
        return { bg: 'bg-slate-700/40', text: 'text-slate-400', border: 'border-slate-600/30', dot: 'bg-slate-500' };

      // ── Doctor status ──
      case 'on_duty':
      case 'on duty':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
      case 'off_duty':
      case 'off duty':
        return { bg: 'bg-slate-700/40', text: 'text-slate-400', border: 'border-slate-600/30', dot: 'bg-slate-500' };
      case 'on_leave':
      case 'on leave':
        return { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25', dot: 'bg-amber-400' };

      default:
        return { bg: 'bg-slate-700/40', text: 'text-slate-300', border: 'border-slate-600/30', dot: 'bg-slate-400' };
    }
  };

  const styles = getStyles(normalized);
  const isCritical = normalized === 'critical' || normalized === 'critical_stock' || normalized === 'urgent';

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  const dotSizes = {
    xs: 'w-1 h-1',
    sm: 'w-1.5 h-1.5',
    md: 'w-1.5 h-1.5',
  };

  const formattedText = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses[size]}`}
    >
      <span
        className={`rounded-full flex-shrink-0 ${styles.dot} ${dotSizes[size]} ${
          (isCritical || pulse) ? 'animate-pulse' : ''
        }`}
      />
      {formattedText}
    </span>
  );
};
