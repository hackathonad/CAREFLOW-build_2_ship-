import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, Zap, ShieldCheck } from 'lucide-react';

interface AnalyticsOverviewProps {
  metrics: any;
}

export const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ metrics }) => {
  const patientTrends = metrics?.patientTrends || [];
  const taskEfficiency = metrics?.taskEfficiency || {
    completedToday: 24,
    avgCompletionMinutes: 38,
    slaCompliancePercent: 96,
  };
  const automationPerf = metrics?.automationPerformance || {
    totalRunsThisWeek: 182,
    successRatePercent: 98.4,
    avgDecisionLatencyMs: 420,
  };

  const maxAdmissions = Math.max(...patientTrends.map((t: any) => t.admissions), 30);

  return (
    <div className="space-y-6">
      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Automation Success Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-100 font-mono">
            {automationPerf.successRatePercent}%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {automationPerf.totalRunsThisWeek} operations executed this week
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Avg Automation Latency
            </span>
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-100 font-mono">
            {automationPerf.avgDecisionLatencyMs} ms
          </div>
          <p className="mt-1 text-xs text-slate-400">
            End-to-end NLP parse to database state commit
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Task SLA Compliance
            </span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-100 font-mono">
            {taskEfficiency.slaCompliancePercent}%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Average task turnaround: {taskEfficiency.avgCompletionMinutes} minutes
          </p>
        </div>
      </div>

      {/* Patient Inflow & Discharge Weekly Trends Bar Visual */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Patient Inflow & Discharge Velocity (Weekly)
            </h3>
            <p className="text-xs text-slate-400">
              Operational intake vs clearance rates across all hospital wards
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-brand-500" />
              <span className="text-slate-300">Admissions</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-slate-700" />
              <span className="text-slate-300">Discharges</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-300">Emergency Intake</span>
            </div>
          </div>
        </div>

        {/* Weekly Bar Chart Visualizer */}
        <div className="grid grid-cols-7 gap-3 items-end h-48 pt-6">
          {patientTrends.map((t: any) => {
            const admHeight = Math.round((t.admissions / maxAdmissions) * 100);
            const disHeight = Math.round((t.discharges / maxAdmissions) * 100);
            const emHeight = Math.round((t.emergency / maxAdmissions) * 100);

            return (
              <div key={t.day} className="flex flex-col items-center h-full justify-end">
                <div className="flex items-end space-x-1 w-full justify-center h-full pb-2">
                  <div
                    className="w-3.5 bg-brand-500 rounded-t transition-all hover:bg-brand-400"
                    style={{ height: `${admHeight}%` }}
                    title={`Admissions: ${t.admissions}`}
                  />
                  <div
                    className="w-3.5 bg-slate-700 rounded-t transition-all hover:bg-slate-600"
                    style={{ height: `${disHeight}%` }}
                    title={`Discharges: ${t.discharges}`}
                  />
                  <div
                    className="w-3.5 bg-rose-500 rounded-t transition-all hover:bg-rose-400"
                    style={{ height: `${emHeight}%` }}
                    title={`Emergency: ${t.emergency}`}
                  />
                </div>
                <span className="text-xs font-mono font-medium text-slate-400 border-t border-slate-800 w-full pt-1 text-center">
                  {t.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
