import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
}

interface DashboardAlertsProps {
  alerts: AlertItem[];
}

export const DashboardAlerts: React.FC<DashboardAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/6 border border-emerald-500/15 mb-6 text-xs text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="font-medium">All systems nominal — No critical operational alerts at this time.</span>
      </div>
    );
  }

  const getAlertConfig = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          iconColor: 'text-rose-400',
          bg: 'bg-rose-500/[0.07]',
          border: 'border-rose-500/20',
          titleColor: 'text-rose-200',
          msgColor: 'text-rose-300/70',
          dot: 'bg-rose-400',
          pulse: true,
          label: 'CRITICAL',
          labelStyle: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
        };
      case 'urgent':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          iconColor: 'text-amber-400',
          bg: 'bg-amber-500/[0.07]',
          border: 'border-amber-500/20',
          titleColor: 'text-amber-200',
          msgColor: 'text-amber-300/70',
          dot: 'bg-amber-400',
          pulse: false,
          label: 'URGENT',
          labelStyle: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
        };
      default:
        return {
          icon: <Info className="w-4 h-4" />,
          iconColor: 'text-blue-400',
          bg: 'bg-blue-500/[0.05]',
          border: 'border-blue-500/15',
          titleColor: 'text-blue-200',
          msgColor: 'text-blue-300/60',
          dot: 'bg-blue-400',
          pulse: false,
          label: 'INFO',
          labelStyle: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
        };
    }
  };

  return (
    <div className="mb-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Priority Operational Alerts
          </span>
          <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            {alerts.length}
          </span>
        </div>
        <Link
          to="/activity"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {alerts.slice(0, 3).map((alert) => {
          const cfg = getAlertConfig(alert.type);
          return (
            <div
              key={alert.id}
              className={`relative p-4 rounded-xl border ${cfg.bg} ${cfg.border} transition-all duration-200 hover:border-opacity-60`}
            >
              {/* Top stripe for critical */}
              {alert.type === 'critical' && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-rose-500/70 rounded-t-xl" />
              )}

              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 flex-shrink-0 ${cfg.iconColor}`}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-xs font-semibold leading-tight ${cfg.titleColor}`}>
                      {alert.title}
                    </h4>
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${cfg.labelStyle}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${cfg.msgColor} line-clamp-2`}>
                    {alert.message}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-2 font-mono">{alert.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
