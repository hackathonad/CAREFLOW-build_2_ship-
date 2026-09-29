import React from 'react';
import { Bed, BedStatus } from '../../types';
import { BedDouble, Check, AlertCircle, Wrench, Clock, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface WardOccupancyViewProps {
  beds: Bed[];
  onSelectBed: (bed: Bed) => void;
}

export const WardOccupancyView: React.FC<WardOccupancyViewProps> = ({
  beds,
  onSelectBed,
}) => {
  // Group beds by room
  const bedsByRoom = beds.reduce<Record<string, { roomNumber: string; wardName: string; beds: Bed[] }>>(
    (acc, bed) => {
      const roomKey = bed.room_id || 'unassigned-room';
      if (!acc[roomKey]) {
        acc[roomKey] = {
          roomNumber: bed.room_number || 'Room',
          wardName: bed.ward_name || 'Ward',
          beds: [],
        };
      }
      acc[roomKey].beds.push(bed);
      return acc;
    },
    {}
  );

  const getBedStatusStyle = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400 hover:border-emerald-400';
      case 'occupied':
        return 'border-sky-500/40 bg-sky-950/20 text-sky-400 hover:border-sky-400';
      case 'reserved':
        return 'border-amber-500/40 bg-amber-950/20 text-amber-400 hover:border-amber-400';
      case 'maintenance':
        return 'border-rose-500/40 bg-rose-950/20 text-rose-400 hover:border-rose-400';
      default:
        return 'border-slate-800 bg-slate-900 text-slate-400';
    }
  };

  const getBedIcon = (status: BedStatus) => {
    switch (status) {
      case 'available':
        return <Check className="w-3.5 h-3.5" />;
      case 'occupied':
        return <BedDouble className="w-3.5 h-3.5" />;
      case 'reserved':
        return <Clock className="w-3.5 h-3.5" />;
      case 'maintenance':
        return <Wrench className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Legend */}
      <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-semibold text-slate-300">Live Status Legend:</span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available (Clean)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>Occupied (Inpatient)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Reserved (Transfer Hold)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Maintenance (Calibration)</span>
          </div>
        </div>
      </div>

      {/* Room and Bed Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(bedsByRoom).map(([roomId, roomData]) => (
          <div
            key={roomId}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Room {roomData.roomNumber}
                  </h4>
                  <p className="text-[11px] text-slate-500">{roomData.wardName}</p>
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {roomData.beds.length} {roomData.beds.length === 1 ? 'bed' : 'beds'}
                </span>
              </div>

              {/* Beds Grid inside Room */}
              <div className="grid grid-cols-2 gap-2.5 my-2">
                {roomData.beds.map((bed) => (
                  <button
                    key={bed.id}
                    onClick={() => onSelectBed(bed)}
                    className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.02] flex flex-col justify-between ${getBedStatusStyle(
                      bed.status
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold tracking-tight">
                        {bed.bed_number}
                      </span>
                      {getBedIcon(bed.status)}
                    </div>

                    <div className="min-h-[28px]">
                      {bed.patient_name ? (
                        <p className="text-[11px] font-medium text-slate-200 truncate">
                          {bed.patient_name}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 capitalize">
                          {bed.status}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Click any bed to alter status</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
