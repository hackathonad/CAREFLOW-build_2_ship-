import React, { useEffect, useState } from 'react';
import { networkService } from '../services/analyticsService';
import { NetworkFacility } from '../types';
import { NetworkFacilityCard } from '../components/network/NetworkFacilityCard';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { Building2, Globe2, ShieldCheck, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const HospitalNetworkPage: React.FC = () => {
  const [facilities, setFacilities] = useState<NetworkFacility[]>(() => clientCache.get<NetworkFacility[]>('/network/facilities') || []);
  const [ambStats, setAmbStats] = useState<any>(() => clientCache.get('/network/ambulance-reference'));
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/network/facilities'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [facilityTypeFilter, setFacilityTypeFilter] = useState('all');

  const fetchNetworkData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('network');
      }
      if (facilities.length === 0) setIsLoading(true);
      setError(null);
      const [facs, amb] = await Promise.all([
        networkService.getFacilities(),
        networkService.getAmbulanceReference().catch(() => null),
      ]);
      setFacilities(facs);
      setAmbStats(amb);
    } catch (err: any) {
      console.error('Error fetching facilities:', err);
      if (facilities.length === 0) {
        setError(err?.message || 'Failed to load health facilities directory');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const filteredFacilities = facilities.filter((f) => {
    if (
      facilityTypeFilter !== 'all' &&
      !f.facility_type?.toLowerCase().includes(facilityTypeFilter.toLowerCase())
    ) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.district.toLowerCase().includes(q) ||
      f.facility_type.toLowerCase().includes(q)
    );
  });

  const facilityTypeOptions = [
    { label: 'All Facilities', value: 'all' },
    { label: 'Teaching / Tertiary', value: 'Teaching' },
    { label: 'Trauma & General', value: 'Trauma' },
    { label: 'District Hospitals', value: 'District' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              National Health Network & Inter-Facility Directory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Open government reference registry for regional referral triage, bed capacity, and mutual-aid transfers.
          </p>
        </div>

        <button
          onClick={() => fetchNetworkData(true)}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors self-start sm:self-auto"
          title="Refresh Directory"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Government Open Data Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2.5">
          <Globe2 className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-slate-300">
            Reference Data Sources: <strong className="text-slate-100">National Hospital Directory (data.gov.in)</strong> &amp; All India Health Centres (sikkim.data.gov.in)
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-emerald-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Local Resilient Cache Active</span>
        </div>
      </div>

      {/* Regional Ambulance Telemetry Reference */}
      {ambStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block">State Fleet Reference</span>
            <span className="text-sm font-semibold text-slate-200">{ambStats.state}</span>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Public 108 Fleet</span>
            <span className="text-sm font-mono font-semibold text-slate-200">{ambStats.totalPublicAmbulances} units</span>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block">ALS Advanced Units</span>
            <span className="text-sm font-mono font-semibold text-brand-400">{ambStats.alsAmbulances} ALS</span>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block">BLS Basic Units</span>
            <span className="text-sm font-mono font-semibold text-slate-300">{ambStats.blsAmbulances} BLS</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search facility name, district (e.g. Mumbai, Nagpur), or type..."
        activeFilter={facilityTypeFilter}
        onFilterChange={setFacilityTypeFilter}
        filterOptions={facilityTypeOptions}
      />

      {/* Facilities Cards Grid */}
      {isLoading && facilities.length === 0 ? (
        <LoadingState message="Querying public health facilities directory..." />
      ) : error && facilities.length === 0 ? (
        <ErrorState message={error} onRetry={fetchNetworkData} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFacilities.map((facility) => (
            <NetworkFacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      )}
    </div>
  );
};
