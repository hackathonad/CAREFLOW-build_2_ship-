import React from 'react';
import { History, CalendarDays, CheckSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../shared/StatusBadge';

interface DashboardRecentActivityProps {
  tasks: any[];
  appointments: any[];
}

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  tasks,
  appointments,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Operational Tasks */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Hospital Tasks
            </h3>
          </div>
          <Link
            to="/tasks"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center justify-between"
            >
              <div className="min-w-0 pr-3">
                <p className="text-xs font-semibold text-slate-200 truncate">{task.title}</p>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                  <span>{task.department}</span>
                  <span>•</span>
                  <span>{task.assigned_employee}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <StatusBadge status={task.priority} size="sm" />
                <StatusBadge status={task.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Operational Appointments */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Today's Scheduled Consultations
            </h3>
          </div>
          <Link
            to="/appointments"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {appointments.slice(0, 4).map((app) => (
            <div
              key={app.id}
              className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center justify-between"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center space-x-2">
                  <p className="text-xs font-semibold text-slate-200">{app.patient_name}</p>
                  <span className="text-[10px] text-brand-400 font-mono bg-brand-950/80 px-1.5 py-0.2 rounded border border-brand-900">
                    {app.time}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                  <span>{app.doctor_name}</span>
                  <span>•</span>
                  <span>{app.department}</span>
                </div>
              </div>
              <StatusBadge status={app.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
