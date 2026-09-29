import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase().replace(/[\s-]/g, '_');

  const getColorClasses = (st: string) => {
    switch (st) {
      // Patients
      case 'admitted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'resting':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'under_observation':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'needs_attention':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
      case 'discharge_ready':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'discharged':
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';

      // Beds
      case 'available':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'occupied':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'reserved':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'maintenance':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

      // Inventory
      case 'normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'low_stock':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'out_of_stock':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

      // Ambulances
      case 'dispatched':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'en_route':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'at_hospital':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';

      // Tasks / Approvals
      case 'pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed':
      case 'approved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'escalated':
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';

      // Priority
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
      case 'low':
        return 'bg-slate-600/10 text-slate-400 border-slate-600/20';

      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const formattedText = status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${getColorClasses(
        normalized
      )} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {formattedText}
    </span>
  );
};
