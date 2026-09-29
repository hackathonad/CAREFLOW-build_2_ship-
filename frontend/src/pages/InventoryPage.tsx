import React, { useEffect, useState } from 'react';
import { inventoryService } from '../services/inventoryService';
import { InventoryItem, InventoryStatus } from '../types';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { RestockModal } from '../components/inventory/RestockModal';
import { FilterBar } from '../components/shared/FilterBar';
import { LoadingState } from '../components/shared/LoadingState';
import { ErrorState } from '../components/shared/ErrorState';
import { PackageSearch, RefreshCw } from 'lucide-react';
import { clientCache } from '../services/api';

export const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => clientCache.get<InventoryItem[]>('/inventory') || []);
  const [isLoading, setIsLoading] = useState(() => !clientCache.has('/inventory'));
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeRestockItem, setActiveRestockItem] = useState<InventoryItem | null>(null);

  const fetchInventory = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        clientCache.invalidate('inventory');
      }
      if (items.length === 0) setIsLoading(true);
      setError(null);
      const data = await inventoryService.getAll({
        status: statusFilter !== 'all' ? (statusFilter as InventoryStatus) : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching inventory:', err);
      if (items.length === 0) {
        setError(err?.message || 'Failed to fetch inventory catalog');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter, categoryFilter]);

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const statusOptions = [
    { label: 'All Items', value: 'all' },
    { label: 'Normal', value: 'normal' },
    { label: 'Low Stock', value: 'low_stock' },
    { label: 'Critical', value: 'critical' },
    { label: 'Out of Stock', value: 'out_of_stock' },
  ];

  const handleRestockConfirm = async (itemId: string, quantity: number) => {
    await inventoryService.restock(itemId, quantity);
    await fetchInventory();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <PackageSearch className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Hospital Supply & Consumables Inventory
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Real-time critical medical stock monitoring, minimum thresholds, and procurement triggers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Categories</option>
            <option value="Gases">Medical Gases & Cryo</option>
            <option value="Fluids">IV Fluids & Solutions</option>
            <option value="PPE">PPE & Hygiene</option>
            <option value="Surgical">Surgical Instruments</option>
            <option value="Consumables">Consumables & Syringes</option>
            <option value="Emergency">Crash Cart & Emergency</option>
          </select>

          <button
            onClick={() => fetchInventory(true)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
            title="Refresh Inventory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by item name or SKU (e.g. MED-OXY-47L)..."
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={statusOptions}
      />

      {/* Inventory Table */}
      {isLoading && items.length === 0 ? (
        <LoadingState message="Checking inventory levels..." />
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={fetchInventory} />
      ) : (
        <InventoryTable
          items={filteredItems}
          onRestockClick={(item) => setActiveRestockItem(item)}
        />
      )}

      {/* Restock Modal */}
      <RestockModal
        item={activeRestockItem}
        isOpen={Boolean(activeRestockItem)}
        onClose={() => setActiveRestockItem(null)}
        onConfirmRestock={handleRestockConfirm}
      />
    </div>
  );
};
