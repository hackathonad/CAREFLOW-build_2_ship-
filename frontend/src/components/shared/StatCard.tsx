import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral';
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
  trend,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'brand':
        return {
          iconBg: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
          accent: 'hover:border-brand-500/40',
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accent: 'hover:border-emerald-500/40',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accent: 'hover:border-amber-500/40',
        };
      case 'danger':
        return {
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accent: 'hover:border-rose-500/40',
        };
      default:
        return {
          iconBg: 'bg-slate-800 text-slate-400 border-slate-700',
          accent: 'hover:border-slate-600',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm transition-all duration-200 ${styles.accent}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg border ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-100 tracking-tight">{value}</div>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.positive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};
