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
        <LoadingState message="Connecting to hospital operations backend..." />
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
