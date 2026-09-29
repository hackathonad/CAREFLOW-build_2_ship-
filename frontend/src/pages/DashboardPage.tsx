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
import { PageHeader } from '../components/shared/PageHeader';
import { LayoutDashboard, Sparkles } from 'lucide-react';
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
      <PageHeader
        icon={LayoutDashboard}
        title="Hospital Operations Control Center"
        subtitle="Real-time operational overview, ward occupancy, and autonomous workflow monitoring."
        iconColor="text-blue-400"
        iconBg="bg-blue-500/10 border-blue-500/20"
        onRefresh={fetchDashboardData}
        isRefreshing={isLoading}
        actions={
          <Link
            to="/ai-command-center"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #0059c2, #0070f3)', boxShadow: '0 4px 12px rgba(0,112,243,0.30)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Command Center</span>
          </Link>
        }
      />

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
