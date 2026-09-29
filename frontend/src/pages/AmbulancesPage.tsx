import React, { useEffect, useState } from 'react';
import { ambulanceService } from '../services/ambulanceService';
import { Ambulance, AmbulanceStatus } from '../types';
import { AmbulanceCard } from '../components/ambulances/AmbulanceCard';
import { DispatchModal } from '../components/ambulances/DispatchModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { PageHeader } from '../components/shared/PageHeader';
import { Truck } from 'lucide-react';
import { clientCache } from '../services/api';

export const AmbulancesPage: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(() => clientCache.get<Ambulance[]>('/ambulances') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/ambulances'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeDispatchAmbulance, setActiveDispatchAmbulance] = useState<Ambulance | null>(null);

  const fetchAmbulances = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('ambulances');
      }
      if (ambulances.length === 0) setIsLoading(true);
      setError(null);
      const data = await ambulanceService.getAll(
        statusFilter !== 'all' ? (statusFilter as AmbulanceStatus) : undefined
      );
      setAmbulances(data);
    } catch (err: any) {
      console.error('Error fetching ambulances:', err);
      if (ambulances.length === 0) {
        setError(err?.message || 'Failed to fetch ambulance fleet data');
      }
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
      <PageHeader
        icon={Truck}
        title="Ambulance Fleet & Emergency Dispatch"
        subtitle="Emergency telemetry, active transit routes, and trauma triage coordination."
        iconColor="text-amber-400"
        iconBg="bg-amber-500/10 border-amber-500/20"
        onRefresh={() => fetchAmbulances(true)}
        isRefreshing={isLoading}
      />

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
