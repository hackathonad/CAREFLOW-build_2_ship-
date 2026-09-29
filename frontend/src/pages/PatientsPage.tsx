import React, { useEffect, useState } from 'react';
import { patientService } from '../services/patientService';
import { Patient, PatientStatus } from '../types';
import { PatientTable } from '../components/patients/PatientTable';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { AdmitPatientModal } from '../components/patients/AdmitPatientModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { PageHeader } from '../components/shared/PageHeader';
import { Users, UserPlus } from 'lucide-react';
import { clientCache } from '../services/api';

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(() => clientCache.get<Patient[]>('/patients', { status: 'all' }) || clientCache.get<Patient[]>('/patients') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/patients', { status: 'all' }) && !clientCache.has('/patients'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  const fetchPatients = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('patients');
      }
      if (patients.length === 0) setIsLoading(true);
      setError(null);
      const data = await patientService.getAll({
        status: selectedFilter as PatientStatus | 'all',
        search: searchQuery || undefined,
      });
      setPatients(data);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      if (patients.length === 0) {
        setError(err?.message || 'Failed to fetch patients list');
      }
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
      <PageHeader
        icon={Users}
        title="Patient Operations Registry"
        subtitle="Admitted patient status tracking, stay duration metrics, and ward bed allocations."
        iconColor="text-blue-400"
        iconBg="bg-blue-500/10 border-blue-500/20"
        onRefresh={() => fetchPatients(true)}
        isRefreshing={isLoading}
        actions={
          <button
            onClick={() => setIsAdmitModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-xs font-semibold transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(135deg, #0059c2, #0070f3)', boxShadow: '0 4px 12px rgba(0,112,243,0.30)' }}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Admit Patient</span>
          </button>
        }
      />

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
