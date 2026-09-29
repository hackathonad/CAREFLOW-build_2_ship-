import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { taskService } from '../services/taskService';
import { appointmentService } from '../services/appointmentService';
import { clientCache } from '../services/api';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { DashboardAlerts } from '../components/dashboard/DashboardAlerts';
import { DashboardResourceOverview } from '../components/dashboard/DashboardResourceOverview';
import { DashboardRecentActivity } from '../components/dashboard/DashboardRecentActivity';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { PageHeader } from '../components/shared/PageHeader';
import { LayoutDashboard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Alert Banner Skeleton */}
    <div className="h-16 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center px-4 space-x-3">
      <div className="w-8 h-8 rounded-lg bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="w-48 h-3.5 bg-slate-800 rounded" />
        <div className="w-72 h-2.5 bg-slate-800/60 rounded" />
      </div>
    </div>

    {/* 4 Stat Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 rounded-xl bg-slate-900/60 border border-slate-800/80 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-24 h-3 bg-slate-800 rounded" />
            <div className="w-6 h-6 rounded-lg bg-slate-800" />
          </div>
          <div className="w-16 h-7 bg-slate-800 rounded" />
          <div className="w-32 h-2.5 bg-slate-800/60 rounded" />
        </div>
      ))}
    </div>

    {/* Ward Overview Skeleton */}
    <div className="h-64 rounded-xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-4">
      <div className="w-40 h-4 bg-slate-800 rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-lg bg-slate-950/60 border border-slate-800/40 p-4 space-y-2">
            <div className="w-20 h-3 bg-slate-800 rounded" />
            <div className="w-12 h-6 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<any>(() => clientCache.get('/analytics/dashboard'));
  const [tasks, setTasks] = useState<any[]>(() => clientCache.get('/tasks') || []);
  const [appointments, setAppointments] = useState<any[]>(() => clientCache.get('/appointments') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/analytics/dashboard'));
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('analytics/dashboard');
        clientCache.invalidate('tasks');
        clientCache.invalidate('appointments');
      }
      if (!data) setIsLoading(true);
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
      if (!data) {
        setError(err?.message || 'Failed to fetch operational telemetry from backend');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Hospital Operations Control Center"
        subtitle="Real-time operational overview, ward occupancy, and autonomous workflow monitoring."
        iconColor="text-blue-400"
        onRefresh={() => fetchDashboardData(true)}
        isRefreshing={isLoading}
        actions={
          <Link
            to="/ai-command-center"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-[0_2px_8px_rgba(0,112,243,0.3)] hover:shadow-[0_4px_16px_rgba(0,112,243,0.4)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Command Center
          </Link>
        }
      />

      {isLoading && !data ? (
        <DashboardSkeleton />
      ) : error && !data ? (
        <ErrorState message={error} onRetry={() => fetchDashboardData(true)} />
      ) : data && (
        <>
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
        </>
      )}
    </div>
  );
};
