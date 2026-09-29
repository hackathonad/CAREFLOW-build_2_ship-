import React, { useState } from 'react';
import { Ambulance } from '../../types';
import { Modal } from '../shared/Modal';
import { Loader2, Navigation } from 'lucide-react';

interface DispatchModalProps {
  ambulance: Ambulance | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDispatch: (
    ambulanceId: string,
    destination: string,
    request: string,
    urgency: 'normal' | 'high' | 'critical'
  ) => Promise<void>;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  ambulance,
  isOpen,
  onClose,
  onConfirmDispatch,
}) => {
  if (!ambulance) return null;

  const [destination, setDestination] = useState('');
  const [request, setRequest] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'high' | 'critical'>('high');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !request.trim()) return;

    try {
      setIsSubmitting(true);
      await onConfirmDispatch(ambulance.id, destination.trim(), request.trim(), urgency);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dispatch Ambulance ${ambulance.ambulance_code}`}
      subtitle={`Driver: ${ambulance.driver} • Location: ${ambulance.location}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Dispatch Waypoint / Destination *
          </label>
          <input
            type="text"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Western Express Highway, Goregaon Flyover"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Emergency Request Description *
          </label>
          <textarea
            rows={2}
            required
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="e.g. Critical trauma casualty pickup; multi-car collision reported"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Urgency Classification
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="normal">Normal (Routine Inter-facility Transfer)</option>
            <option value="high">High (Urgent Emergency Care)</option>
            <option value="critical">Critical (Immediate Code Red Life Support)</option>
          </select>
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
            disabled={isSubmitting || !destination.trim() || !request.trim()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Transmitting Dispatch Route...</span>
              </>
            ) : (
              <span>Confirm & Dispatch</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
