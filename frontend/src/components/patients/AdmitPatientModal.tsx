import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Loader2 } from 'lucide-react';

interface AdmitPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdmit: (data: {
    name: string;
    age: number;
    gender: string;
    department: string;
    wardCategory: string;
  }) => Promise<void>;
}

export const AdmitPatientModal: React.FC<AdmitPatientModalProps> = ({
  isOpen,
  onClose,
  onAdmit,
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(45);
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('Cardiology');
  const [wardCategory, setWardCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onAdmit({ name, age, gender, department, wardCategory });
      setName('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intake New Patient"
      subtitle="CareFlow AI will automatically allocate optimal bed and assign duty physician."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Patient Full Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Vikram Singhania"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
            <input
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Admitting Department *
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="Cardiology">Cardiology</option>
            <option value="Emergency & Trauma">Emergency & Trauma</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="General Surgery">General Surgery</option>
            <option value="Intensive Care Unit">Intensive Care Unit</option>
            <option value="Nephrology">Nephrology</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Preferred Ward Category
          </label>
          <select
            value={wardCategory}
            onChange={(e) => setWardCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="general">General Ward</option>
            <option value="semi_premium">Semi-Private Room</option>
            <option value="premium">Executive Suite</option>
            <option value="icu">ICU / Intensive Care</option>
            <option value="emergency">Emergency Bay</option>
            <option value="observation">Short Stay Observation</option>
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
            disabled={isSubmitting || !name.trim()}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Allocating Bed & Physician...</span>
              </>
            ) : (
              <span>Confirm Admission</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
