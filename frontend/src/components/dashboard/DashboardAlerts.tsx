import React from 'react';
import { AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 mb-8 text-center text-xs text-slate-400">
        All systems nominal. No critical operational alerts active.
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getAlertBorder = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-rose-800/60 bg-rose-950/20';
      case 'urgent':
        return 'border-amber-800/60 bg-amber-950/20';
      default:
        return 'border-slate-800 bg-slate-900/50';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Priority Operational Alerts</span>
        </h3>
        <Link
          to="/activity"
          className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center space-x-1"
        >
          <span>View All Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border ${getAlertBorder(
              alert.type
            )} transition-all hover:border-slate-700`}
          >
            <div className="flex items-start space-x-2.5">
              <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{alert.title}</h4>
                  <span className="text-[10px] text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{alert.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
