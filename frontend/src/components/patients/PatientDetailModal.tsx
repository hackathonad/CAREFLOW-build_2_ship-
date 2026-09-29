import React from 'react';
import { Patient } from '../../types';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../shared/StatusBadge';
import {
  User,
  Calendar,
  BedDouble,
  Stethoscope,
  CreditCard,
  Phone,
  Clock,
  Pill,
  Activity,
  ClipboardList,
} from 'lucide-react';

interface PatientDetailModalProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (newStatus: any) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!patient) return null;

  const calculateStay = (admissionDate: string, dischargeDate: string | null) => {
    const start = new Date(admissionDate).getTime();
    const end = dischargeDate ? new Date(dischargeDate).getTime() : Date.now();
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.name} (${patient.patient_code})`}
      subtitle={`Department of ${patient.department} • Admitted ${new Date(
        patient.admission_date
      ).toLocaleDateString()}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status & Quick Action Row */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Current Operational Status:</span>
            <StatusBadge status={patient.status} />
          </div>

          {onUpdateStatus && (
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400">Change Status:</span>
              <select
                value={patient.status}
                onChange={(e) => onUpdateStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="admitted">Admitted</option>
                <option value="resting">Resting</option>
                <option value="under_observation">Under Observation</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
                <option value="discharge_ready">Discharge Ready</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>
          )}
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>Length of Stay</span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {calculateStay(patient.admission_date, patient.discharge_date)}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bill Accrued</span>
            </div>
            <div className="text-sm font-mono font-semibold text-emerald-400">
              ₹{Number(patient.bill_amount).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <BedDouble className="w-3.5 h-3.5 text-sky-400" />
              <span>Assigned Bed</span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {patient.bed_number || 'None'}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800">
            <div className="flex items-center space-x-1 text-[11px] text-slate-400 mb-1">
              <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
              <span>Attending Doctor</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 truncate">
              {patient.doctor_name || 'Dr. On-Duty'}
            </div>
          </div>
        </div>

        {/* Location & Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Ward & Facility Location
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Ward:</span>
                <span className="text-slate-200 font-medium">{patient.ward_name || 'General Inpatient'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Number:</span>
                <span className="text-slate-200 font-mono">{patient.room_number || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bed Unit:</span>
                <span className="text-slate-200 font-mono">{patient.bed_number || '-'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Emergency Contact (Operational)
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Contact:</span>
                <span className="text-slate-200 font-medium">{patient.emergency_contact || 'Registered Next of Kin'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="text-slate-200 font-mono">{patient.emergency_phone || '+91-98000-00000'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Timeline & Intake Record */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-brand-400" />
            <span>Operational Event History</span>
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
              <span className="text-slate-500 font-mono">{new Date(patient.admission_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <span>Patient record initiated via CareFlow AI intake</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span className="text-slate-500 font-mono">10m later</span>
              <span>Bed {patient.bed_number || 'allocated'} locked and telemetry activated</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500 font-mono">Today</span>
              <span>Current operational status updated to: {patient.status.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
