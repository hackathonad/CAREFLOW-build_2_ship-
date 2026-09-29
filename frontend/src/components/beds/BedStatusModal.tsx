import React, { useState } from 'react';
import { Bed, BedStatus } from '../../types';
import { Modal } from '../shared/Modal';
import { StatusBadge } from '../shared/StatusBadge';
import { BedDouble, Check, Wrench, Clock, Loader2 } from 'lucide-react';

interface BedStatusModalProps {
  bed: Bed | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (bedId: string, status: BedStatus, patientName?: string) => Promise<void>;
}

export const BedStatusModal: React.FC<BedStatusModalProps> = ({
  bed,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!bed) return null;

  const [selectedStatus, setSelectedStatus] = useState<BedStatus>(bed.status);
  const [patientName, setPatientName] = useState(bed.patient_name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await onUpdateStatus(bed.id, selectedStatus, patientName.trim() || undefined);
      onClose();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Bed ${bed.bed_number} Details`}
      subtitle={`${bed.ward_name || 'Ward'} • Room ${bed.room_number || '-'}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Current Status:</span>
          <StatusBadge status={bed.status} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Change Bed State
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['available', 'occupied', 'reserved', 'maintenance'] as BedStatus[]).map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left capitalize transition-colors ${
                  selectedStatus === st
                    ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {selectedStatus === 'occupied' && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Assigned Patient Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>
        )}

        {bed.notes && (
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Biomedical notes:</span> {bed.notes}
          </div>
        )}

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
            disabled={isUpdating}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Updating Bed...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
