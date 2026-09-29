import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Play,
  ClipboardList,
  Bell,
  ShieldCheck,
  Building,
  User,
  BedDouble,
  Stethoscope,
  Calendar,
  Clock,
  Package,
  Truck,
} from 'lucide-react';
import { CommandProcessingResult } from '../../types';
import { MissingRequirements } from './MissingRequirements';
import { ProposedActions } from './ProposedActions';
import { StatusBadge } from '../shared/StatusBadge';

interface CommandResultProps {
  result: CommandProcessingResult;
  onExecuteNow: () => void;
  isExecuting: boolean;
}

export const CommandResult: React.FC<CommandResultProps> = ({
  result,
  onExecuteNow,
  isExecuting,
}) => {
  const { parsed, execution, status, message } = result;

  const getStatusBanner = () => {
    switch (status) {
      case 'executed':
        return {
          bg: 'bg-emerald-950/30 border-emerald-800/60',
          textColor: 'text-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          title: 'Automated Workflow Executed Successfully',
        };
      case 'missing_requirements':
        return {
          bg: 'bg-amber-950/30 border-amber-800/60',
          textColor: 'text-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          title: 'Execution Paused: Missing Operational Parameters',
        };
      case 'analyzed_only':
        return {
          bg: 'bg-sky-950/30 border-sky-800/60',
          textColor: 'text-sky-300',
          icon: <Play className="w-5 h-5 text-sky-400" />,
          title: 'Analysis Complete: Ready for Operational Confirmation',
        };
      default:
        return {
          bg: 'bg-slate-900 border-slate-800',
          textColor: 'text-slate-300',
          icon: <AlertTriangle className="w-5 h-5 text-slate-400" />,
          title: 'Unrecognized Operational Request',
        };
    }
  };

  const banner = getStatusBanner();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl transition-all">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl border ${banner.bg} flex items-start space-x-3 mb-6`}>
        <div className="mt-0.5">{banner.icon}</div>
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${banner.textColor}`}>{banner.title}</h3>
          <p className="mt-0.5 text-xs text-slate-300">{message}</p>
        </div>
        {status === 'analyzed_only' && parsed.missingInformation.length === 0 && (
          <button
            type="button"
            onClick={onExecuteNow}
            disabled={isExecuting}
            className="shrink-0 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Confirm & Execute</span>
          </button>
        )}
      </div>

      {/* Main Grid: Intent & Extracted Entities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Intent Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Detected Intent
            </span>
            <div className="flex items-center gap-1.5">
              {result.providerUsed && (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-brand-950/80 text-brand-300 border border-brand-800/60">
                  {result.providerUsed}
                </span>
              )}
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                {Math.round(parsed.confidence * 100)}% Match
              </span>
            </div>
          </div>

          <div className="text-base font-bold text-slate-100 capitalize">
            {parsed.intent.replace(/_/g, ' ')}
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{parsed.explanation}</p>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Workflow Priority</span>
            <StatusBadge status={parsed.priority} size="sm" />
          </div>
        </div>

        {/* Extracted Entities */}
        <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Extracted Operational Entities
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {parsed.entities.patientName && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <User className="w-3.5 h-3.5 text-brand-400" />
                  <span>Patient</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {parsed.entities.patientName}
                </div>
              </div>
            )}

            {parsed.entities.department && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <Building className="w-3.5 h-3.5 text-sky-400" />
                  <span>Department</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {parsed.entities.department}
                </div>
              </div>
            )}

            {parsed.entities.wardCategory && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <BedDouble className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ward Category</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 uppercase">
                  {parsed.entities.wardCategory}
                </div>
              </div>
            )}

            {parsed.entities.doctorName && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Physician</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {parsed.entities.doctorName}
                </div>
              </div>
            )}

            {parsed.entities.itemName && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>Item</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {parsed.entities.itemName}
                </div>
              </div>
            )}

            {parsed.entities.destination && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <Truck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Destination</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {parsed.entities.destination}
                </div>
              </div>
            )}

            {parsed.entities.time && (
              <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Time Slot</span>
                </div>
                <div className="text-xs font-semibold text-slate-200">
                  {parsed.entities.time}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Missing Requirements Component */}
      <MissingRequirements missing={parsed.missingInformation} />

      {/* Proposed Actions Component */}
      <ProposedActions actions={parsed.requiredActions} />

      {/* Execution Results (When executed) */}
      {execution && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Deterministic State Execution Telemetry
              </span>
            </div>
            {execution.automationRunId && (
              <span className="text-[10px] font-mono text-slate-500">
                Run ID: {execution.automationRunId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Executed Actions */}
            <div>
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Executed Actions
              </h5>
              <ul className="space-y-1.5">
                {execution.executedActions.map((act, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Generated Tasks & Alerts */}
            <div>
              <h5 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Automated Tasks Dispatched
              </h5>
              <ul className="space-y-1.5">
                {execution.tasksCreated.map((task, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-brand-300">
                    <ClipboardList className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">{task}</span>
                  </li>
                ))}
              </ul>

              {execution.notificationsSent.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>{execution.notificationsSent[0]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
