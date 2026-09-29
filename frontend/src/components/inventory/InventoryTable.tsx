import React from 'react';
import { InventoryItem } from '../../types';
import { DataTable, Column } from '../shared/DataTable';
import { StatusBadge } from '../shared/StatusBadge';
import { PlusCircle } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onRestockClick: (item: InventoryItem) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onRestockClick,
}) => {
  const columns: Column<InventoryItem>[] = [
    {
      key: 'name',
      header: 'Item & SKU',
      render: (item) => (
        <div>
          <span className="font-semibold text-slate-100">{item.name}</span>
          <div className="font-mono text-[11px] text-slate-500">{item.sku}</div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span className="text-xs text-slate-300 font-medium">{item.category}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Current Stock / Threshold',
      render: (item) => (
        <div className="text-xs">
          <span className="font-mono font-bold text-slate-100">
            {item.quantity} {item.unit}
          </span>
          <span className="text-slate-500 text-[11px] ml-1">
            (Min: {item.minimum_threshold})
          </span>
        </div>
      ),
    },
    {
      key: 'supplier_name',
      header: 'Supplier / Source',
      render: (item) => (
        <div className="text-xs text-slate-300 truncate max-w-xs">
          {item.supplier_name || 'Standard Distributor'}
        </div>
      ),
    },
    {
      key: 'storage_location',
      header: 'Storage Location',
      render: (item) => (
        <div className="text-xs text-slate-400">{item.storage_location}</div>
      ),
    },
    {
      key: 'status',
      header: 'Stock Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: 'actions',
      header: 'Quick Action',
      className: 'text-right',
      render: (item) => (
        <div className="text-right">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRestockClick(item);
            }}
            className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 border border-brand-500/30 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Restock</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="No inventory supplies found matching criteria"
    />
  );
};
