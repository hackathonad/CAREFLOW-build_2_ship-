import React, { useEffect, useState } from 'react';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { Stethoscope, RefreshCw } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await doctorService.getAll({
        availability: availabilityFilter !== 'all' ? availabilityFilter : undefined,
        department: departmentFilter !== 'all' ? departmentFilter : undefined,
      });
      setDoctors(data);
    } catch (err: any) {
      console.error('Error fetching doctors:', err);
      setError(err?.message || 'Failed to fetch doctor roster');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [availabilityFilter, departmentFilter]);

  const filteredDoctors = doctors.filter((doc) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialization.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q)
    );
  });

  const availabilityOptions = [
    { label: 'All Staff', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Busy', value: 'busy' },
    { label: 'On Call', value: 'on_call' },
    { label: 'Off Duty', value: 'off_duty' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-sky-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Doctors & Clinical Duty Roster
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time physician workload balancing, shift schedules, and departmental availability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Departments</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Emergency & Trauma">Emergency & Trauma</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Intensive Care Unit">Intensive Care Unit</option>
            <option value="Nephrology">Nephrology</option>
          </select>

          <button
            onClick={fetchDoctors}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Roster"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by physician name, specialty, or department..."
        activeFilter={availabilityFilter}
        onFilterChange={setAvailabilityFilter}
        filterOptions={availabilityOptions}
      />

      {/* Grid of Doctor Cards */}
      {isLoading && doctors.length === 0 ? (
        <LoadingState message="Fetching physician caseloads..." />
      ) : error && doctors.length === 0 ? (
        <ErrorState message={error} onRetry={fetchDoctors} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
};
