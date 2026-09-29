import React from 'react';
import {
  Users,
  BedDouble,
  CheckCircle2,
  Stethoscope,
  CheckSquare,
  Truck,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { StatCard } from '../shared/StatCard';
import { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Patients"
        value={stats.totalPatients}
        subtitle="Currently admitted"
        icon={Users}
        variant="brand"
      />
      <StatCard
        title="Occupied Beds"
        value={stats.occupiedBeds}
        subtitle={`${stats.occupancyRate}% hospital occupancy`}
        icon={BedDouble}
        variant={stats.occupancyRate > 85 ? 'warning' : 'brand'}
      />
      <StatCard
        title="Available Beds"
        value={stats.availableBeds}
        subtitle="Ready for intake"
        icon={CheckCircle2}
        variant="success"
      />
      <StatCard
        title="Doctors On Duty"
        value={stats.doctorsOnDuty}
        subtitle="Active shift staff"
        icon={Stethoscope}
        variant="brand"
      />
      <StatCard
        title="Pending Tasks"
        value={stats.pendingTasks}
        subtitle="Open operational items"
        icon={CheckSquare}
        variant={stats.pendingTasks > 10 ? 'warning' : 'neutral'}
      />
      <StatCard
        title="Active Ambulances"
        value={stats.activeAmbulances}
        subtitle="Dispatched or en route"
        icon={Truck}
        variant="cyan"
      />
      <StatCard
        title="Low Stock Items"
        value={stats.lowStockItems}
        subtitle="Below safety threshold"
        icon={AlertTriangle}
        variant={stats.lowStockItems > 0 ? 'danger' : 'neutral'}
      />
      <StatCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        subtitle="Awaiting authorization"
        icon={ShieldAlert}
        variant={stats.pendingApprovals > 0 ? 'warning' : 'neutral'}
      />
    </div>
  );
};
