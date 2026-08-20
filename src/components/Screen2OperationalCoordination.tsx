import React from 'react';
import { Vessel, Helicopter, ActionItem, WeatherData } from '../types';
import { OffshoreMap } from './OffshoreMap';
import { ShieldCheck, Ship, Navigation, Compass, CheckCircle2, Clock, Users, ArrowDown, Maximize2, Minimize2, Radio, Sliders, Layers } from 'lucide-react';

interface Screen2Props {
  vessel: Vessel;
  helicopter: Helicopter;
  actions: ActionItem[];
  weather: WeatherData;
  mapboxToken?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateActionStatus?: (id: number, status: 'Completed' | 'In Progress' | 'Pending') => void;
}

export const Screen2OperationalCoordination: React.FC<Screen2Props> = ({
  vessel,
  helicopter,
  actions,
  weather,
  mapboxToken,
  isExpanded,
  onToggleExpand,
  onUpdateActionStatus
}) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 ${
        isExpanded ? 'fixed inset-4 z-50 overflow-y-auto bg-white p-4 shadow-2xl ring-1 ring-slate-900/10' : 'w-full h-full'
      }`}
    >
      {/* Panel Screen Header */}
      <div className="bg-slate-50/90 px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-600 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold tracking-tight text-slate-900 uppercase truncate">
            SCREEN 2 – OPERATIONAL COORDINATION & TACTICAL LOGISTICS
          </h2>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all shadow-xs shrink-0"
          title={isExpanded ? 'Collapse' : 'Expand Screen 2 to Fullscreen'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto bg-slate-50/40 text-slate-800">
        {/* Top 3 Command Badges Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* 1. MOCC On-Scene Commander */}
          <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-2 flex items-center gap-2 shadow-xs min-w-0">
            <div className="w-7 h-7 rounded-lg bg-purple-600/10 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
              <Radio className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] font-bold text-purple-800 uppercase tracking-tight truncate">MOCC ON-SCENE COMMANDER</div>
              <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 truncate">
                <span>MOCC – Speaking</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              </div>
            </div>
          </div>

          {/* 2. Vessel Status */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-2 flex items-center gap-2 shadow-xs min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/10 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Ship className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] font-bold text-emerald-800 uppercase tracking-tight truncate">VESSEL STATUS</div>
              <div className="text-[11px] font-bold text-slate-900 truncate">{vessel.id} – {vessel.status}</div>
              <div className="text-[9.5px] text-emerald-700 font-medium truncate">ETA: {vessel.eta} | Speed: {vessel.speedKnots} kt</div>
            </div>
          </div>

          {/* 3. Helicopter / Weather */}
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-2 flex items-center gap-2 shadow-xs min-w-0">
            <div className="w-7 h-7 rounded-lg bg-sky-600/10 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] font-bold text-sky-800 uppercase tracking-tight truncate">HELICOPTER / WEATHER</div>
              <div className="text-[11px] font-bold text-slate-900 truncate">{helicopter.status} ({helicopter.conditions})</div>
              <div className="text-[9.5px] text-sky-700 font-medium truncate">Mobilisation: {helicopter.mobilisationTime}</div>
            </div>
          </div>
        </div>

        {/* Tactical Management Analytics Row */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-bold text-slate-900 uppercase">TACTICAL RESOURCE UTILIZATION:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
              Deployment Ratio: <strong className="text-blue-700">92%</strong>
            </span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
              Logistics Velocity: <strong className="text-emerald-700">On Track</strong>
            </span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">
              Comm Security: <strong className="text-purple-700">Encrypted VHF</strong>
            </span>
          </div>
        </div>

        {/* Live Field Positions GIS Map */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-tight min-w-0">
              <Compass className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">FIELD LAYOUT & LIVE TELEMETRY POSITIONS</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono shrink-0">
              GPS: {vessel.coordinates[0].toFixed(3)}°N, {vessel.coordinates[1].toFixed(3)}°E
            </div>
          </div>
          <OffshoreMap vessel={vessel} mapboxToken={mapboxToken} />
        </div>

        {/* Middle Row: Org Structure + Action Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
          {/* Key Persons / Command Structure Org Chart */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase border-b border-slate-100 pb-2 mb-2.5">
              <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">KEY PERSONS / COMMAND STRUCTURE</span>
            </div>

            <div className="flex flex-col items-center space-y-1.5 text-center text-xs">
              {/* Level 1: Incident Commander */}
              <div className="bg-rose-50 border border-rose-200/80 text-rose-900 px-3 py-1.5 rounded-lg font-bold shadow-xs w-full max-w-xs leading-tight">
                <div>Incident Commander</div>
                <div className="text-[10px] text-rose-700 font-medium">(DRSB / Onsite)</div>
              </div>

              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

              {/* Level 2: Operations Section Chief */}
              <div className="bg-blue-50 border border-blue-200/80 text-blue-900 px-3 py-1.5 rounded-lg font-bold shadow-xs w-full max-w-xs leading-tight">
                <div>Operations Section Chief</div>
              </div>

              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />

              {/* Level 3: Chiefs Grid */}
              <div className="grid grid-cols-3 gap-1.5 w-full">
                <div className="bg-sky-50 border border-sky-200/80 text-sky-900 p-1.5 rounded-lg text-[10px] font-bold shadow-xs truncate">
                  HSSE Advisor
                </div>
                <div className="bg-sky-50 border border-sky-200/80 text-sky-900 p-1.5 rounded-lg text-[10px] font-bold shadow-xs truncate">
                  Logistics Chief
                </div>
                <div className="bg-sky-50 border border-sky-200/80 text-sky-900 p-1.5 rounded-lg text-[10px] font-bold shadow-xs truncate">
                  Planning Chief
                </div>
              </div>

              {/* Level 4: Communications */}
              <div className="bg-purple-50 border border-purple-200/80 text-purple-900 px-3 py-1 rounded-lg text-[10px] font-bold w-full max-w-xs shadow-xs truncate">
                Communications / Media Liaison
              </div>
            </div>
          </div>

          {/* Action Tracker Table */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase border-b border-slate-100 pb-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">ACTION TRACKER MATRIX</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] text-slate-800 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                      <th className="py-1.5 px-2">NO.</th>
                      <th className="py-1.5 px-2">ACTION ITEM</th>
                      <th className="py-1.5 px-2">OWNER</th>
                      <th className="py-1.5 px-2 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {actions.map((act) => (
                      <tr key={act.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-1.5 px-2 font-mono text-slate-500 text-[10px]">{act.id}</td>
                        <td className="py-1.5 px-2 text-slate-800 font-medium leading-snug break-words max-w-[180px]">{act.action}</td>
                        <td className="py-1.5 px-2 text-blue-700 text-[10px] font-bold truncate max-w-[100px]">{act.responsible}</td>
                        <td className="py-1.5 px-2 text-center">
                          <button
                            onClick={() => {
                              if (onUpdateActionStatus) {
                                const nextStatus =
                                  act.status === 'Completed'
                                    ? 'In Progress'
                                    : act.status === 'In Progress'
                                    ? 'Pending'
                                    : 'Completed';
                                onUpdateActionStatus(act.id, nextStatus);
                              }
                            }}
                            className="inline-flex items-center gap-1 cursor-pointer hover:scale-105 transition-all"
                            title="Click to toggle status"
                          >
                            {act.status === 'Completed' ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-xs">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Done
                              </span>
                            ) : act.status === 'In Progress' ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200/80 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-xs">
                                Pending
                              </span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Resource Mobilisation & Next Report */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* Resource Mobilisation */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase border-b border-slate-100 pb-1.5 mb-2">
              <Ship className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">RESOURCE MOBILISATION STATUS</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium">
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-800 truncate">Medical team: <span className="text-emerald-700 font-bold">Ready</span></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-800 truncate">FCB-01: <span className="text-emerald-700 font-bold">En route</span></span>
              </div>
            </div>
          </div>

          {/* Next Report Due */}
          <div className="bg-sky-50/80 border border-sky-200/80 rounded-xl p-2.5 shadow-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-sky-800 uppercase tracking-tight truncate">NEXT REPORT DUE</div>
                <div className="text-xs font-bold text-slate-900 truncate">Time: 15:00 hrs</div>
              </div>
            </div>
            <div className="text-right text-[11px] font-bold text-sky-700 shrink-0">
              By: MOCC / ECC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

