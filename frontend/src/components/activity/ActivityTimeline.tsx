import React from 'react';
import {
  Activity,
  UserCheck,
  BedDouble,
  Truck,
  Package,
  ShieldCheck,
  PlayCircle,
  Clock,
} from 'lucide-react';

interface TimelineItem {
  id: string;
  type: string;
  action: string;
  source: string;
  entityType: string;
  entityId: string;
  result: string;
  details: Record<string, any>;
  timestamp: string;
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-slate-400 text-sm">
        No operational activity logged yet.
      </div>
    );
  }

  const getEventIcon = (entityType: string, action: string) => {
    switch (entityType.toLowerCase()) {
      case 'patient':
        return <UserCheck className="w-4 h-4 text-brand-400" />;
      case 'bed':
        return <BedDouble className="w-4 h-4 text-sky-400" />;
      case 'ambulance':
        return <Truck className="w-4 h-4 text-purple-400" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-400" />;
      case 'approval':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'automation_run':
      case 'workflow':
        return <PlayCircle className="w-4 h-4 text-indigo-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative border-l border-slate-800 ml-4 space-y-6 my-4">
      {items.map((item) => (
        <div key={item.id} className="relative pl-6">
          {/* Timeline node icon */}
          <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center">
            {getEventIcon(item.entityType, item.action)}
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-slate-200 tracking-tight">
                {item.action}
              </span>
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono">
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400 mb-2">
              <span className="capitalize">Source: {item.source.replace(/_/g, ' ')}</span>
              <span>•</span>
              <span className="uppercase text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                {item.entityType}
              </span>
              {item.result && (
                <>
                  <span>•</span>
                  <span
                    className={`font-semibold capitalize ${
                      item.result === 'success' || item.result === 'completed'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {item.result}
                  </span>
                </>
              )}
            </div>

            {item.details && Object.keys(item.details).length > 0 && (
              <div className="p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 break-all">
                {JSON.stringify(item.details, null, 1)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
