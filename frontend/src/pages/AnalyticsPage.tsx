import React, { useEffect, useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsOverview } from '../components/analytics/AnalyticsOverview';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { BarChart3, RefreshCw } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getMetrics();
      setMetrics(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err?.message || 'Failed to fetch operational analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Operational Analytics & Workflow Performance
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Telemetry metrics tracking patient velocity, task turnaround times, and automation decision latencies.
          </p>
        </div>

        <button
          onClick={fetchMetrics}
          disabled={isLoading}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors self-start sm:self-auto"
          title="Refresh Analytics"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
        </button>
      </div>

      {isLoading && !metrics ? (
        <LoadingState message="Aggregating hospital operational analytics..." />
      ) : error && !metrics ? (
        <ErrorState message={error} onRetry={fetchMetrics} />
      ) : (
        <AnalyticsOverview metrics={metrics} />
      )}
    </div>
  );
};
