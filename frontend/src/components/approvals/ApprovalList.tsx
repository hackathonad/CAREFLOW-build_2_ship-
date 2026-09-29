import React from 'react';
import { Approval } from '../../types';
import { StatusBadge } from '../shared/StatusBadge';
import { CheckCircle2, XCircle, Clock, ShieldAlert, User } from 'lucide-react';

interface ApprovalListProps {
  approvals: Approval[];
  onResolve: (id: string, status: 'approved' | 'rejected') => void;
}

export const ApprovalList: React.FC<ApprovalListProps> = ({
  approvals,
  onResolve,
}) => {
  if (approvals.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-slate-400 text-sm">
        No administrative or clinical override approvals in this queue.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvals.map((item) => (
        <div
          key={item.id}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
        >
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-bold text-slate-100">{item.action}</span>
              <StatusBadge status={item.risk_level} size="sm" />
              <StatusBadge status={item.status} size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3 text-slate-400" />
                <span>Requested by: {item.requested_by}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {item.approver && (
                <>
                  <span>•</span>
                  <span className="text-slate-400 font-medium">Resolved by: {item.approver}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons for Pending */}
          {item.status === 'pending' && (
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onResolve(item.id, 'rejected')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-rose-800/60 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-semibold transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => onResolve(item.id, 'approved')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Authorize</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
