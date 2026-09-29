import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { Modal } from '../shared/Modal';
import { Package, Loader2 } from 'lucide-react';

interface RestockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRestock: (itemId: string, quantity: number) => Promise<void>;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmRestock,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(item.minimum_threshold * 2 || 20);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    try {
      setIsSubmitting(true);
      await onConfirmRestock(item.id, Number(quantity));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Restock: ${item.name}`}
      subtitle={`SKU: ${item.sku} • Current Level: ${item.quantity} ${item.unit}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Category:</span>
            <span className="text-slate-200">{item.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Supplier:</span>
            <span className="text-slate-200">{item.supplier_name || 'Standard Distributor'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Safety Threshold:</span>
            <span className="text-amber-400 font-mono font-semibold">
              {item.minimum_threshold} {item.unit}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Restock Quantity to Add ({item.unit}) *
          </label>
          <input
            type="number"
            min={1}
            max={5000}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 font-mono focus:outline-none focus:border-brand-500"
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Projected stock after intake: {item.quantity + Number(quantity)} {item.unit}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || quantity <= 0}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Logging Inward Goods...</span>
              </>
            ) : (
              <span>Confirm Restock</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
