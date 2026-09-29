import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'cyan';
  trend?: {
    value: string;
    positive: boolean;
    neutral?: boolean;
  };
  accentBar?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'brand',
  trend,
  accentBar = true,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'brand':
        return {
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          accentColor: 'bg-blue-500',
          glow: 'group-hover:shadow-[0_0_20px_rgba(0,112,243,0.15)]',
          border: 'group-hover:border-blue-500/30',
        };
      case 'cyan':
        return {
          iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          accentColor: 'bg-cyan-500',
          glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
          border: 'group-hover:border-cyan-500/30',
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accentColor: 'bg-emerald-500',
          glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.12)]',
          border: 'group-hover:border-emerald-500/30',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accentColor: 'bg-amber-500',
          glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]',
          border: 'group-hover:border-amber-500/30',
        };
      case 'danger':
        return {
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accentColor: 'bg-rose-500',
          glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.12)]',
          border: 'group-hover:border-rose-500/30',
        };
      default:
        return {
          iconBg: 'bg-slate-700/50 text-slate-400 border-slate-700/50',
          accentColor: 'bg-slate-600',
          glow: '',
          border: 'group-hover:border-slate-600/50',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`group relative overflow-hidden bg-[#0f172a] border border-white/[0.07] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300 ${styles.glow} ${styles.border} hover:border-opacity-100 stat-card`}
    >
      {/* Top accent bar */}
      {accentBar && (
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${styles.accentColor} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight tabular-nums">
              {value}
            </span>
            {trend && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                trend.neutral ? 'text-slate-400' :
                trend.positive ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {trend.neutral ? (
                  <Minus className="w-3 h-3" />
                ) : trend.positive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
        <div className={`flex-shrink-0 p-2.5 rounded-lg border ${styles.iconBg} ml-3`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
