import React from 'react';
import { CalendarDays, CheckSquare, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../shared/StatusBadge';

interface DashboardRecentActivityProps {
  tasks: any[];
  appointments: any[];
}

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  linkTo: string;
  count?: number;
}> = ({ icon, title, linkTo, count }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <h3 className="text-xs font-bold text-slate-200">{title}</h3>
        {count !== undefined && (
          <p className="text-[10px] text-slate-600 mt-0.5">{count} total records</p>
        )}
      </div>
    </div>
    <Link
      to={linkTo}
      className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
    >
      View All
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
);

export const DashboardRecentActivity: React.FC<DashboardRecentActivityProps> = ({
  tasks,
  appointments,
}) => {
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortedTasks = [...tasks]
    .sort((a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 9) - (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 9))
    .slice(0, 5);

  const upcomingAppts = appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
    .slice(0, 5);

  const cardStyle = {
    background: 'linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%)',
    border: '1px solid rgba(255,255,255,0.07)',
  };

  const rowStyle = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Active Operational Tasks */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <SectionHeader
          icon={
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
            </div>
          }
          title="Active Operational Tasks"
          linkTo="/tasks"
          count={tasks.length}
        />

        <div className="space-y-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg flex items-center justify-between gap-3 transition-all duration-150 hover:border-white/[0.09]"
              style={rowStyle}
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{task.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-slate-500">{task.department}</span>
                  <span className="text-slate-700 text-[10px]">·</span>
                  <span className="text-[10px] text-slate-600 truncate">{task.assigned_employee}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <StatusBadge status={task.priority} size="xs" />
                <StatusBadge status={task.status} size="xs" />
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-600">No active tasks</div>
          )}
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div className="rounded-xl p-5" style={cardStyle}>
        <SectionHeader
          icon={
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          }
          title="Upcoming Consultations"
          linkTo="/appointments"
          count={appointments.length}
        />

        <div className="space-y-2">
          {upcomingAppts.map((app) => (
            <div
              key={app.id}
              className="p-3 rounded-lg flex items-center justify-between gap-3 transition-all duration-150 hover:border-white/[0.09]"
              style={rowStyle}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">{app.patient_name}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-blue-300 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                    <Clock className="w-2.5 h-2.5" />
                    {app.time}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 truncate">{app.doctor_name}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-[10px] text-slate-600">{app.department}</span>
                </div>
              </div>
              <StatusBadge status={app.status} size="xs" />
            </div>
          ))}

          {upcomingAppts.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-600">No upcoming appointments</div>
          )}
        </div>
      </div>
    </div>
  );
};
