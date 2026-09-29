import React from 'react';
import { Ambulance } from '../../types';
import { Truck, MapPin, User, Navigation, Send, Radio } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface AmbulanceCardProps {
  ambulance: Ambulance;
  onDispatchClick: (ambulance: Ambulance) => void;
}

const statusConfig: Record<string, { barColor: string; border: string; topBar: string }> = {
  available: { barColor: 'bg-emerald-500', border: 'hover:border-emerald-500/30', topBar: '' },
  dispatched: { barColor: 'bg-amber-500', border: 'hover:border-amber-500/30', topBar: 'bg-amber-500/70' },
  en_route: { barColor: 'bg-blue-500', border: 'hover:border-blue-500/30', topBar: 'bg-blue-500/70' },
  at_hospital: { barColor: 'bg-purple-500', border: 'hover:border-purple-500/30', topBar: '' },
  maintenance: { barColor: 'bg-rose-500', border: 'hover:border-rose-500/30', topBar: '' },
};

export const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  ambulance,
  onDispatchClick,
}) => {
  const isAvailable = ambulance.vehicle_status === 'available';
  const isActive = ambulance.vehicle_status === 'dispatched' || ambulance.vehicle_status === 'en_route';
  const cfg = statusConfig[ambulance.vehicle_status] || statusConfig.available;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 ${cfg.border}`}
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0a0f1e 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Active run top stripe */}
      {isActive && cfg.topBar && (
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${cfg.topBar}`} />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg border ${
                isActive
                  ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                  : isAvailable
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-slate-700/40 border-slate-700/30 text-slate-400'
              }`}
            >
              {isActive ? (
                <Radio className="w-5 h-5 animate-pulse" />
              ) : (
                <Truck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                {ambulance.ambulance_code}
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{ambulance.equipment_level}</p>
            </div>
          </div>
          <StatusBadge status={ambulance.vehicle_status} size="xs" pulse={isActive} />
        </div>

        {/* Info rows */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-xs">
            <User className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            <span className="text-slate-400">{ambulance.driver}</span>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-3.5 h-3.5 text-blue-500/60 flex-shrink-0 mt-0.5" />
            <span className="text-slate-400 truncate">{ambulance.location}</span>
          </div>

          {ambulance.destination && (
            <div className="flex items-start gap-2 text-xs">
              <Navigation className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-cyan-300 font-medium truncate">{ambulance.destination}</span>
            </div>
          )}

          {ambulance.current_request && (
            <div
              className="p-2.5 rounded-lg text-[11px] mt-1"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}
            >
              <span className="text-amber-500/70 font-semibold block mb-0.5 text-[10px] uppercase tracking-wider">
                Active Run
              </span>
              <p className="text-amber-200/80 line-clamp-2 leading-relaxed">{ambulance.current_request}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div
        className="px-5 py-3.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <button
          onClick={() => onDispatchClick(ambulance)}
          disabled={!isAvailable}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isAvailable
              ? 'text-white hover:-translate-y-px'
              : 'cursor-not-allowed text-slate-600'
          }`}
          style={
            isAvailable
              ? {
                  background: 'linear-gradient(135deg, #0059c2, #0070f3)',
                  boxShadow: '0 4px 12px rgba(0,112,243,0.30)',
                }
              : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }
          }
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isAvailable ? 'Dispatch Vehicle' : 'Not Available'}</span>
        </button>
      </div>
    </div>
  );
};
