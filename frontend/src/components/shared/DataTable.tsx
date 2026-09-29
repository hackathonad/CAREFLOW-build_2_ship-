import React from 'react';
import { Database } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  keyExtractor?: (item: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No records found matching criteria',
  keyExtractor,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-14 rounded-xl text-center"
        style={{ border: '1px dashed rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Database className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="table-container rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <table className="w-full text-left text-sm text-slate-200 data-table">
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ background: 'rgba(10,15,30,0.95)' }}>
          {data.map((item, idx) => {
            const key = keyExtractor ? keyExtractor(item) : item.id || idx;
            return (
              <tr
                key={key}
                onClick={() => onRowClick && onRowClick(item)}
                className={`border-b transition-colors duration-100 ${
                  onRowClick
                    ? 'cursor-pointer'
                    : ''
                }`}
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => {
                  if (onRowClick) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
