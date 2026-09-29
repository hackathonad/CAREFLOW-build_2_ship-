import React from 'react';
import { Doctor } from '../../types';
import { Stethoscope, Phone, Clock, Users, Award } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const workloadPercent = Math.min(
    100,
    Math.round((doctor.workload / (doctor.max_workload || 15)) * 100)
  );

  const isOnDuty = doctor.availability?.toLowerCase().includes('on') && !doctor.availability?.toLowerCase().includes('off') && !doctor.availability?.toLowerCase().includes('leave');

  const initials = doctor.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const barColor =
    workloadPercent > 80 ? 'bg-rose-500' :
    workloadPercent > 60 ? 'bg-amber-500' :
    'bg-emerald-500';

  return (
    <div
      className="group relative overflow-hidden rounded-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.20)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
      }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{
                background: isOnDuty
                  ? 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.08))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isOnDuty ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.08)'}`,
                color: isOnDuty ? '#22d3ee' : '#64748b',
              }}
            >
              {initials}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{doctor.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{doctor.specialization}</p>
            </div>
          </div>
          <StatusBadge status={doctor.availability} size="xs" />
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Stethoscope className="w-3.5 h-3.5 text-cyan-500/60 flex-shrink-0" />
            <span>{doctor.department}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span>Shift: {doctor.shift}</span>
          </div>
          {doctor.contact_phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              <span className="font-mono text-[11px]">{doctor.contact_phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Workload footer */}
      <div className="px-5 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Users className="w-3.5 h-3.5" />
            Active Caseload
          </span>
          <span className={`font-mono font-bold tabular-nums ${workloadPercent > 80 ? 'text-rose-400' : workloadPercent > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {doctor.workload}/{doctor.max_workload}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full progress-bar-track">
          <div
            className={`h-full rounded-full progress-bar-fill ${barColor}`}
            style={{ width: `${workloadPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-slate-700">{workloadPercent}% capacity</span>
          <span className="text-[10px] text-slate-700">{doctor.max_workload - doctor.workload} slots free</span>
        </div>
      </div>
    </div>
  );
};
