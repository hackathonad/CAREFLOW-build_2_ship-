import React from 'react';
import { NetworkFacility } from '../../types';
import { Building2, MapPin, BedDouble, Truck, Phone, ExternalLink } from 'lucide-react';

interface NetworkFacilityCardProps {
  facility: NetworkFacility;
}

export const NetworkFacilityCard: React.FC<NetworkFacilityCardProps> = ({ facility }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{facility.name}</h4>
              <p className="text-[11px] text-slate-400">{facility.facility_type}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {facility.ownership}
          </span>
        </div>

        <div className="space-y-2 my-3 text-xs text-slate-300">
          <div className="flex items-center space-x-2 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>
              {facility.district}, {facility.state} ({facility.pincode})
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 my-2 text-center">
            <div className="p-1.5 rounded bg-slate-950">
              <span className="text-[10px] text-slate-500 block">Total Beds</span>
              <span className="font-mono font-bold text-slate-200">{facility.total_beds}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950">
              <span className="text-[10px] text-slate-500 block">ICU Units</span>
              <span className="font-mono font-bold text-brand-400">{facility.icu_beds}</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950">
              <span className="text-[10px] text-slate-500 block">Ambulances</span>
              <span className="font-mono font-bold text-slate-200">{facility.ambulance_count}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Phone className="w-3 h-3 text-slate-500" />
              <span className="font-mono text-[11px]">{facility.contact_phone}</span>
            </div>
            {facility.emergency_services && (
              <span className="text-[10px] text-emerald-400 font-medium">
                24x7 Emergency Ready
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Government Data Source Attribution */}
      <div className="pt-3 border-t border-slate-800/80 mt-2 flex items-center justify-between text-[10px] text-slate-500">
        <span className="truncate">Source: {facility.source_attribution}</span>
        <ExternalLink className="w-3 h-3 text-slate-600 shrink-0 ml-1" />
      </div>
    </div>
  );
};
