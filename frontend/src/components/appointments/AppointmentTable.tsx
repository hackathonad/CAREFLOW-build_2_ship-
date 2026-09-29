import React from 'react';
import { Appointment } from '../../types';
import { DataTable, Column } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { Clock, Calendar } from 'lucide-react';

interface AppointmentTableProps {
  appointments: Appointment[];
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments }) => {
  const columns: Column<Appointment>[] = [
    {
      key: 'patient_name',
      header: 'Patient',
      render: (a) => (
        <span className="font-semibold text-slate-100">{a.patient_name}</span>
      ),
    },
    {
      key: 'doctor_name',
      header: 'Doctor & Department',
      render: (a) => (
        <div className="text-xs">
          <div className="text-slate-200 font-medium">{a.doctor_name}</div>
          <div className="text-[11px] text-slate-500">{a.department}</div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date & Time',
      render: (a) => (
        <div className="text-xs">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{a.date}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-brand-400 font-mono text-[11px] mt-0.5">
            <Clock className="w-3 h-3 text-brand-500" />
            <span>{a.time}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Appointment Type',
      render: (a) => (
        <span className="text-xs text-slate-300 font-medium">{a.type}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => <StatusBadge status={a.status} />,
    },
    {
      key: 'notes',
      header: 'Operational Notes',
      render: (a) => (
        <p className="text-xs text-slate-400 max-w-xs truncate">{a.notes || '-'}</p>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={appointments}
      emptyMessage="No consultations or appointments scheduled"
    />
  );
};
