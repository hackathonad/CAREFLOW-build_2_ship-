import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { Appointment, AppointmentStatus } from '../types';
import { AppointmentTable } from '../components/appointments/AppointmentTable';
import { ScheduleAppointmentModal } from '../components/appointments/ScheduleAppointmentModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { CalendarDays, PlusCircle, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => clientCache.get<Appointment[]>('/appointments') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/appointments'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const fetchAppointments = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('appointments');
      }
      if (appointments.length === 0) setIsLoading(true);
      setError(null);
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      if (appointments.length === 0) {
        setError(err?.message || 'Failed to fetch appointments list');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.patient_name.toLowerCase().includes(q) ||
      app.doctor_name.toLowerCase().includes(q) ||
      app.department.toLowerCase().includes(q)
    );
  });

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
    { label: 'Pending', value: 'pending' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const handleScheduleConfirm = async (data: any) => {
    await appointmentService.create(data);
    await fetchAppointments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Appointments & Consultations
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Outpatient department scheduling, physician slots, and case reviews.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
          <button
            onClick={() => fetchAppointments(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Appointments"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by patient name, doctor, or department..."
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
      />

      {/* Appointment Table */}
      {isLoading && appointments.length === 0 ? (
        <LoadingState message="Loading clinic appointments..." />
      ) : error && appointments.length === 0 ? (
        <ErrorState message={error} onRetry={fetchAppointments} />
      ) : (
        <AppointmentTable appointments={filteredAppointments} />
      )}

      {/* Schedule Appointment Modal */}
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleConfirm}
      />
    </div>
  );
};
