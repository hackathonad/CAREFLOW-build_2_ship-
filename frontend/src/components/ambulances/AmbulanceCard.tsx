import React from 'react';
import { Ambulance } from '../../types';
import { Truck, MapPin, User, Navigation, Send } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onDispatchClick: (ambulance: Ambulance) => void;
}

export const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  ambulance,
  onDispatchClick,
}) => {
  const isAvailable = ambulance.vehicle_status === 'available';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-mono">
                {ambulance.ambulance_code}
              </h4>
              <p className="text-[11px] text-slate-500">{ambulance.equipment_level}</p>
            </div>
          </div>
          <StatusBadge status={ambulance.vehicle_status} size="sm" />
        </div>

        <div className="space-y-2 my-3 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Driver: {ambulance.driver}</span>
          </div>

          <div className="flex items-start space-x-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
            <span className="truncate">Current: {ambulance.location}</span>
          </div>

          {ambulance.destination && (
            <div className="flex items-start space-x-2 text-sky-300 font-medium">
              <Navigation className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span className="truncate">Destination: {ambulance.destination}</span>
            </div>
          )}

          {ambulance.current_request && (
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-slate-500 block mb-0.5 font-semibold">Active Run:</span>
              <p className="line-clamp-2">{ambulance.current_request}</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 mt-2">
        <button
          onClick={() => onDispatchClick(ambulance)}
          disabled={!isAvailable}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-2 transition-colors ${
            isAvailable
              ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isAvailable ? 'Dispatch Vehicle' : 'Currently Dispatched'}</span>
        </button>
      </div>
    </div>
  );
};
