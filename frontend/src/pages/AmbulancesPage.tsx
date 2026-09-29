import React, { useEffect, useState } from 'react';
import { ambulanceService } from '../services/ambulanceService';
import { Ambulance, AmbulanceStatus } from '../types';
import { AmbulanceCard } from '../components/ambulances/AmbulanceCard';
import { DispatchModal } from '../components/ambulances/DispatchModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { Truck, RefreshCw } from 'lucide-react';

export const AmbulancesPage: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeDispatchAmbulance, setActiveDispatchAmbulance] = useState<Ambulance | null>(null);

  const fetchAmbulances = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await ambulanceService.getAll(
        statusFilter !== 'all' ? (statusFilter as AmbulanceStatus) : undefined
      );
      setAmbulances(data);
    } catch (err: any) {
      console.error('Error fetching ambulances:', err);
      setError(err?.message || 'Failed to fetch ambulance fleet data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, [statusFilter]);

  const filteredAmbulances = ambulances.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.ambulance_code.toLowerCase().includes(q) ||
      a.driver.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q)
    );
  });

  const statusOptions = [
    { label: 'All Fleet', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Dispatched', value: 'dispatched' },
    { label: 'En Route', value: 'en_route' },
    { label: 'At Hospital', value: 'at_hospital' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  const handleConfirmDispatch = async (
    id: string,
    destination: string,
    request: string,
    urgency: 'normal' | 'high' | 'critical'
  ) => {
    await ambulanceService.dispatch(id, destination, request, urgency);
    await fetchAmbulances();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Ambulance Fleet & Emergency Dispatch
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time emergency telemetry, active transit routes, and trauma triage coordination.
          </p>
        </div>

        <button
          onClick={fetchAmbulances}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors self-start sm:self-auto"
          title="Refresh Fleet"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by vehicle code (e.g. AMB-101), driver, or location..."
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
      />

      {/* Ambulance Cards Grid */}
      {isLoading && ambulances.length === 0 ? (
        <LoadingState message="Connecting to fleet GPS & telemetry..." />
      ) : error && ambulances.length === 0 ? (
        <ErrorState message={error} onRetry={fetchAmbulances} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAmbulances.map((amb) => (
            <AmbulanceCard
              key={amb.id}
              ambulance={amb}
              onDispatchClick={(a) => setActiveDispatchAmbulance(a)}
            />
          ))}
        </div>
      )}

      {/* Dispatch Modal */}
      <DispatchModal
        ambulance={activeDispatchAmbulance}
        isOpen={Boolean(activeDispatchAmbulance)}
        onClose={() => setActiveDispatchAmbulance(null)}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
};
