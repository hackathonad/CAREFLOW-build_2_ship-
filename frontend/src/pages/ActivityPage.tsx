import React, { useEffect, useState } from 'react';
import { activityService } from '../services/analyticsService';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { History, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const ActivityPage: React.FC = () => {
  const [items, setItems] = useState<any[]>(() => clientCache.get('/activity/timeline') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/activity/timeline'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const fetchActivity = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('activity');
      }
      if (items.length === 0) setIsLoading(true);
      setError(null);
      const data = await activityService.getTimeline();
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching activity log:', err);
      if (items.length === 0) {
        setError(err?.message || 'Failed to fetch operational activity log');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      entityFilter === 'all' || item.entityType?.toLowerCase() === entityFilter.toLowerCase();
    if (!matchesFilter) return false;

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.action?.toLowerCase().includes(q) ||
      item.source?.toLowerCase().includes(q) ||
      item.entityType?.toLowerCase().includes(q)
    );
  });

  const filterOptions = [
    { label: 'All Events', value: 'all' },
    { label: 'Patients', value: 'patient' },
    { label: 'Beds', value: 'bed' },
    { label: 'Inventory', value: 'inventory' },
    { label: 'Ambulances', value: 'ambulance' },
    { label: 'Approvals', value: 'approval' },
    { label: 'Tasks', value: 'task' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Operational Event & Audit Log
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Chronological, immutable operational event timeline tracking state changes and autonomous workflow runs.
          </p>
        </div>

        <button
          onClick={() => fetchActivity(true)}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors self-start sm:self-auto"
          title="Refresh Log"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search event action, source, or entity ID..."
        activeFilter={entityFilter}
        onFilterChange={setEntityFilter}
        filterOptions={filterOptions}
      />

      {/* Timeline View */}
      {isLoading && items.length === 0 ? (
        <LoadingState message="Fetching operational audit stream..." />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={fetchActivity} />
      ) : (
        <ActivityTimeline items={filteredItems} />
      )}
    </div>
  );
};
