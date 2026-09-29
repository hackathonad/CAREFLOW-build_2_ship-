import React from 'react';
import { Doctor } from '../../types';
import { Stethoscope, Phone, Clock, Users } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const workloadPercent = Math.min(
    100,
    Math.round((doctor.workload / (doctor.max_workload || 15)) * 100)
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
              {doctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-100">{doctor.name}</h4>
              <p className="text-xs text-slate-400">{doctor.specialization}</p>
            </div>
          </div>
          <StatusBadge status={doctor.availability} size="sm" />
        </div>

        <div className="space-y-1.5 my-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-slate-400">
            <Stethoscope className="w-3.5 h-3.5 text-brand-400" />
            <span>{doctor.department}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Shift: {doctor.shift}</span>
          </div>
          {doctor.contact_phone && (
            <div className="flex items-center space-x-2 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono text-[11px]">{doctor.contact_phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Workload Progress Bar */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>Active Caseload</span>
          </span>
          <span className="font-mono font-semibold text-slate-200">
            {doctor.workload} / {doctor.max_workload} pts
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              workloadPercent > 80
                ? 'bg-rose-500'
                : workloadPercent > 60
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${workloadPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
