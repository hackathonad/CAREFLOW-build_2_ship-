import React, { useEffect, useState } from 'react';
import { bedService } from '../services/bedService';
import { Bed, Ward, BedStatus } from '../types';
import { WardOccupancyView } from '../components/beds/WardOccupancyView';
import { BedStatusModal } from '../components/beds/BedStatusModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { BedDouble, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const BedsPage: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>(() => clientCache.get<Bed[]>('/beds') || []);
  const [wards, setWards] = useState<Ward[]>(() => clientCache.get<Ward[]>('/beds/wards') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/beds'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [activeBedModal, setActiveBedModal] = useState<Bed | null>(null);

  const fetchBedData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('beds');
      }
      if (beds.length === 0) setIsLoading(true);
      setError(null);
      const [bedsData, wardsData] = await Promise.all([
        bedService.getBeds(),
        bedService.getWards(),
      ]);
      setBeds(bedsData);
      setWards(wardsData);
    } catch (err: any) {
      console.error('Error fetching beds:', err);
      if (beds.length === 0) {
        setError(err?.message || 'Failed to fetch ward & bed data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBedData();
  }, []);

  const filteredBeds = beds.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (selectedWard !== 'all' && b.ward_id !== selectedWard) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bed_number.toLowerCase().includes(q) ||
      (b.ward_name && b.ward_name.toLowerCase().includes(q)) ||
      (b.patient_name && b.patient_name.toLowerCase().includes(q))
    );
  });

  const statusOptions = [
    { label: 'All Beds', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Maintenance', value: 'maintenance' },
  ];

  const handleUpdateBedStatus = async (
    bedId: string,
    status: BedStatus,
    patientName?: string
  ) => {
    // Optimistic Update: immediately update UI state and client cache (0ms perceived latency)
    setBeds((prev) => {
      const updated = prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status,
              patient_name: status === 'occupied' ? patientName : undefined,
            }
          : b
      );
      clientCache.set('/beds', undefined, updated);
      return updated;
    });

    // Background sync to backend & database
    try {
      await bedService.updateBedStatus(bedId, status, patientName);
    } catch (err) {
      console.error('Failed to sync bed status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <BedDouble className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Beds & Wards Matrix
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time ward occupancy, room bed pods, and state allocation controls.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Ward Selector Dropdown */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.category.toUpperCase()})
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchBedData(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Bed Status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search bed code (e.g. ICU-B1), patient name, or room..."
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
      />

      {/* Matrix View */}
      {isLoading && beds.length === 0 ? (
        <LoadingState message="Loading ward occupancy topology..." />
      ) : error && beds.length === 0 ? (
        <ErrorState message={error} onRetry={fetchBedData} />
      ) : (
        <WardOccupancyView
          beds={filteredBeds}
          onSelectBed={(b) => setActiveBedModal(b)}
        />
      )}

      {/* Bed Status Modal */}
      <BedStatusModal
        bed={activeBedModal}
        isOpen={Boolean(activeBedModal)}
        onClose={() => setActiveBedModal(null)}
        onUpdateStatus={handleUpdateBedStatus}
      />
    </div>
  );
};
