import React, { useEffect, useState } from 'react';
import { patientService } from '../services/patientService';
import { Patient, PatientStatus } from '../types';
import { PatientTable } from '../components/patients/PatientTable';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { AdmitPatientModal } from '../components/patients/AdmitPatientModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { Users, UserPlus, RefreshCw } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await patientService.getAll({
        status: selectedFilter as PatientStatus | 'all',
        search: searchQuery || undefined,
      });
      setPatients(data);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      setError(err?.message || 'Failed to fetch patients list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [selectedFilter]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.patient_code.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q)
    );
  });

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Admitted', value: 'admitted' },
    { label: 'Resting', value: 'resting' },
    { label: 'Under Obs', value: 'under_observation' },
    { label: 'Needs Attention', value: 'needs_attention' },
    { label: 'Critical', value: 'critical' },
    { label: 'Discharge Ready', value: 'discharge_ready' },
    { label: 'Discharged', value: 'discharged' },
  ];

  const handleAdmit = async (data: any) => {
    await patientService.create(data);
    await fetchPatients();
  };

  const handleUpdateStatus = async (newStatus: PatientStatus) => {
    if (!selectedPatient) return;
    try {
      const updated = await patientService.update(selectedPatient.id, { status: newStatus });
      setSelectedPatient(updated);
      await fetchPatients();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Patient Operations Registry
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Admitted patient status tracking, stay duration metrics, and ward bed allocations.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsAdmitModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Patient</span>
          </button>
          <button
            onClick={fetchPatients}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by patient name, ID (e.g. PAT-1001), or department..."
        activeFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        filterOptions={filterOptions}
      />

      {/* Content Area */}
      {isLoading && patients.length === 0 ? (
        <LoadingState message="Fetching patient records..." />
      ) : error && patients.length === 0 ? (
        <ErrorState message={error} onRetry={fetchPatients} />
      ) : (
        <PatientTable
          patients={filteredPatients}
          onSelectPatient={(p) => setSelectedPatient(p)}
        />
      )}

      {/* Patient Detail Modal */}
      <PatientDetailModal
        patient={selectedPatient}
        isOpen={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Admit Patient Modal */}
      <AdmitPatientModal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        onAdmit={handleAdmit}
      />
    </div>
  );
};
