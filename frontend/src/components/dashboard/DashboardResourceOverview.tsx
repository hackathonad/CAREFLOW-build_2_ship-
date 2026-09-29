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
    { key: 'icu', label: 'ICU / Critical Care' },
    { key: 'emergency', label: 'Emergency & Trauma' },
    { key: 'premium', label: 'Executive Suites' },
    { key: 'semi_premium', label: 'Semi-Private Rooms' },
    { key: 'general', label: 'General Wards' },
    { key: 'observation', label: 'Short Observation' },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BedDouble className="w-4 h-4 text-brand-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Ward & Bed Occupancy Telemetry
          </h3>
        </div>
        <Link
          to="/beds"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center space-x-1"
        >
          <span>Manage Beds</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const data = distribution[cat.key] || { total: 10, occupied: 0 };
          const percent = data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0;
          const isHigh = percent >= 80;

          return (
            <div
              key={cat.key}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-200">{cat.label}</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    isHigh ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {data.occupied} / {data.total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent > 90
                      ? 'bg-rose-500'
                      : percent >= 75
                      ? 'bg-amber-500'
                      : 'bg-brand-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{percent}% capacity</span>
                <span>{data.total - data.occupied} vacant</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
