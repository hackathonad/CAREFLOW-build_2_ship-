import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { taskService } from '../services/taskService';
import { appointmentService } from '../services/appointmentService';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardAlerts } from '../components/dashboard/DashboardAlerts';
import { DashboardResourceOverview } from '../components/dashboard/DashboardResourceOverview';
import { DashboardRecentActivity } from '../components/dashboard/DashboardRecentActivity';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { RefreshCw, LayoutDashboard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [dashRes, tasksRes, appRes] = await Promise.all([
        analyticsService.getDashboard(),
        taskService.getAll(),
        appointmentService.getAll(),
      ]);
      setData(dashRes);
      setTasks(tasksRes);
      setAppointments(appRes);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err?.message || 'Failed to fetch operational telemetry from backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading && !data) {
    return <LoadingState message="Connecting to hospital operations backend..." />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={fetchDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Hospital Operations Control Center
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time operational overview, ward triage telemetry, and autonomous workflow monitoring.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            to="/ai-command-center"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Command Center</span>
          </Link>

          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Priority Alerts Banner */}
      {data?.alerts && <DashboardAlerts alerts={data.alerts} />}

      {/* Top Level Metric Cards */}
      {data?.stats && <DashboardStats stats={data.stats} />}

      {/* Ward & Bed Occupancy Breakdown */}
      {data?.bedDistribution && (
        <DashboardResourceOverview distribution={data.bedDistribution} />
      )}

      {/* Recent Operational Tasks & Consultations */}
      <DashboardRecentActivity tasks={tasks} appointments={appointments} />
    </div>
  );
};
