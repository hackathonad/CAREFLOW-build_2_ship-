import React from 'react';
import { Patient } from '../../types';
import { DataTable, Column } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';

interface PatientTableProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  onSelectPatient,
}) => {
  const calculateStay = (admissionDate: string, dischargeDate: string | null) => {
    const start = new Date(admissionDate).getTime();
    const end = dischargeDate ? new Date(dischargeDate).getTime() : Date.now();
    const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  const columns: Column<Patient>[] = [
    {
      key: 'patient_code',
      header: 'Patient ID',
      render: (p) => (
        <span className="font-mono text-[11px] font-bold text-blue-300 px-2 py-0.5 rounded"
          style={{ background: 'rgba(0,112,243,0.12)', border: '1px solid rgba(0,112,243,0.25)' }}>
          {p.patient_code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (p) => (
        <div>
          <span className="font-semibold text-slate-100">{p.name}</span>
          <div className="text-[11px] text-slate-500">{p.gender}, {p.age} yrs</div>
        </div>
      ),
    },
    {
      key: 'ward_name',
      header: 'Ward / Room / Bed',
      render: (p) => (
        <div className="text-xs">
          <div className="text-slate-200 font-medium">{p.ward_name || 'Unassigned'}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {p.room_number || '-'} • Bed: {p.bed_number || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'admission_date',
      header: 'Admission / Stay',
      render: (p) => (
        <div className="text-xs">
          <div className="text-slate-300">
            {new Date(p.admission_date).toLocaleDateString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {calculateStay(p.admission_date, p.discharge_date)}
          </div>
        </div>
      ),
    },
    {
      key: 'doctor_name',
      header: 'Attending Doctor',
      render: (p) => (
        <div className="text-xs">
          <div className="text-slate-200">{p.doctor_name || 'Dr. On-Duty'}</div>
          <div className="text-[11px] text-slate-500">{p.department}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Operational Status',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      key: 'bill_amount',
      header: 'Bill Amount',
      render: (p) => (
        <span className="font-mono text-xs text-slate-200">
          ₹{Number(p.bill_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={patients}
      onRowClick={onSelectPatient}
      emptyMessage="No patient records match the selected operational filters"
    />
  );
};
