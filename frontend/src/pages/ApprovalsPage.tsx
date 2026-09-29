import React, { useEffect, useState } from 'react';
import { approvalService } from '../services/approvalService';
import { Approval, ApprovalStatus } from '../types';
import { ApprovalList } from '../components/approvals/ApprovalList';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<Approval[]>(() => clientCache.get<Approval[]>('/approvals', { status: 'pending' }) || clientCache.get<Approval[]>('/approvals') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/approvals', { status: 'pending' }) && !clientCache.has('/approvals'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('pending');

  const fetchApprovals = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('approvals');
      }
      if (approvals.length === 0) setIsLoading(true);
      setError(null);
      const data = await approvalService.getAll(
        statusFilter !== 'all' ? (statusFilter as ApprovalStatus) : undefined
      );
      setApprovals(data);
    } catch (err: any) {
      console.error('Error fetching approvals:', err);
      if (approvals.length === 0) {
        setError(err?.message || 'Failed to fetch approvals queue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  const filteredApprovals = approvals.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.action.toLowerCase().includes(q) ||
      a.requested_by.toLowerCase().includes(q) ||
      a.reason.toLowerCase().includes(q)
    );
  });

  const statusOptions = [
    { label: 'Pending Approvals', value: 'pending' },
    { label: 'Authorized', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'All Records', value: 'all' },
  ];

  const handleResolve = async (id: string, status: 'approved' | 'rejected') => {
    await approvalService.resolve(id, status, 'Medical Superintendent / Admin');
    await fetchApprovals();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Operational Approvals & Risk Overrides
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Administrative governance for high-cost procurements, ward over-capacity triage, and staffing exceptions.
          </p>
        </div>

        <button
          onClick={() => fetchApprovals(true)}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors self-start sm:self-auto"
          title="Refresh Approvals"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search approval action, requester, or justification..."
        activeFilter={statusFilter}
        onFilterChange={(v) => setStatusFilter(v as any)}
        filterOptions={statusOptions}
      />

      {/* Approvals List */}
      {isLoading && approvals.length === 0 ? (
        <LoadingState message="Loading approval requests..." />
      ) : error && approvals.length === 0 ? (
        <ErrorState message={error} onRetry={fetchApprovals} />
      ) : (
        <ApprovalList approvals={filteredApprovals} onResolve={handleResolve} />
      )}
    </div>
  );
};
