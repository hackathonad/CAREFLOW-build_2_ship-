import React from 'react';
import { Task } from '../../types';
import { DataTable, Column } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { Clock, CheckCircle } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onToggleComplete?: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onToggleComplete }) => {
  const columns: Column<Task>[] = [
    {
      key: 'title',
      header: 'Task Title & Description',
      render: (t) => (
        <div>
          <span className="font-semibold text-slate-100">{t.title}</span>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.description}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department / Staff',
      render: (t) => (
        <div className="text-xs">
          <div className="text-slate-200 font-medium">{t.department}</div>
          <div className="text-[11px] text-slate-500">{t.assigned_employee}</div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => <StatusBadge status={t.priority} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      key: 'due_time',
      header: 'Due Deadline',
      render: (t) => (
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{new Date(t.due_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      key: 'source_workflow',
      header: 'Source',
      render: (t) => (
        <span className="text-[11px] text-slate-500 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          {t.source_workflow}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      className: 'text-right',
      render: (t) =>
        onToggleComplete && t.status !== 'completed' ? (
          <div className="text-right">
            <button
              onClick={() => onToggleComplete(t)}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Mark Done</span>
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={tasks}
      emptyMessage="No operational tasks registered"
    />
  );
};
