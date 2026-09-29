import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { Patient } from '../types';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { StatusBadge } from '../components/shared/StatusBadge';
import {
  ArrowLeft,
  User,
  BedDouble,
  Stethoscope,
  CreditCard,
  Clock,
  Activity,
  Calendar,
} from 'lucide-react';

export const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      patientService
        .getById(id)
        .then((data) => setPatient(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <LoadingState message="Loading patient file..." />;
  if (error || !patient) return <ErrorState message={error || 'Patient not found'} />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb back */}
      <Link
        to="/patients"
        className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patients Registry</span>
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-slate-100">{patient.name}</h1>
              <span className="font-mono text-xs font-semibold text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-900">
                {patient.patient_code}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {patient.gender}, {patient.age} yrs • Department of {patient.department}
            </p>
          </div>
          <StatusBadge status={patient.status} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">Assigned Ward</span>
            <span className="text-sm font-semibold text-slate-200">{patient.ward_name || 'General'}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">Room / Bed</span>
            <span className="text-sm font-semibold text-slate-200">
              {patient.room_number || '-'} / {patient.bed_number || '-'}
            </span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">Attending Physician</span>
            <span className="text-sm font-semibold text-slate-200">{patient.doctor_name || 'Dr. On-Duty'}</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-500 block mb-1">Current Bill</span>
            <span className="text-sm font-mono font-semibold text-emerald-400">
              ₹{Number(patient.bill_amount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
