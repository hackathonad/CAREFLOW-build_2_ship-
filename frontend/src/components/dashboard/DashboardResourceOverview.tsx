import React from 'react';
import { BedDouble, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardResourceOverviewProps {
  distribution: Record<string, { total: number; occupied: number }>;
}

export const DashboardResourceOverview: React.FC<DashboardResourceOverviewProps> = ({
  distribution,
}) => {
  const categories = [
    { key: 'icu', label: 'ICU / Critical Care', color: 'rose' },
    { key: 'emergency', label: 'Emergency & Trauma', color: 'amber' },
    { key: 'premium', label: 'Executive Suites', color: 'purple' },
    { key: 'semi_premium', label: 'Semi-Private Rooms', color: 'blue' },
    { key: 'general', label: 'General Wards', color: 'emerald' },
    { key: 'observation', label: 'Short Observation', color: 'cyan' },
  ];

  const getBarColor = (percent: number, colorKey: string) => {
    if (percent > 90) return 'bg-rose-500';
    if (percent >= 75) return 'bg-amber-500';
    const map: Record<string, string> = {
      icu: 'bg-rose-500',
      emergency: 'bg-amber-500',
      premium: 'bg-purple-500',
      semi_premium: 'bg-blue-500',
      general: 'bg-emerald-500',
      observation: 'bg-cyan-500',
    };
    return map[colorKey] || 'bg-blue-500';
  };

  const getTextColor = (percent: number) => {
    if (percent > 90) return 'text-rose-400';
    if (percent >= 75) return 'text-amber-400';
    return 'text-slate-400';
  };

  return (
    <div
      className="rounded-xl p-5 mb-6"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BedDouble className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Ward & Bed Occupancy</h3>
            <p className="text-[10px] text-slate-600 mt-0.5">Real-time capacity across all wards</p>
          </div>
        </div>
        <Link
          to="/beds"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          Manage Beds
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Ward Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => {
          const data = distribution[cat.key] || { total: 10, occupied: 0 };
          const percent = data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0;
          const barColor = getBarColor(percent, cat.key);
          const textColor = getTextColor(percent);

          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-lg transition-all duration-200 hover:border-white/[0.10]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-300">{cat.label}</span>
                <span className={`text-xs font-mono font-bold tabular-nums ${textColor}`}>
                  {data.occupied}/{data.total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full progress-bar-track mb-2">
                <div
                  className={`h-full rounded-full progress-bar-fill ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold tabular-nums ${textColor}`}>
                  {percent}% capacity
                </span>
                <span className="text-[10px] text-slate-600">
                  {data.total - data.occupied} vacant
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
