import React, { useState } from 'react';
import { IncidentDetails, TimelineEvent, WeatherData, Vessel } from '../types';
import { OffshoreMap } from './OffshoreMap';
import { ShieldAlert, MapPin, Users, Wind, Clock, AlertTriangle, CheckCircle2, Target, FileText, Maximize2, Minimize2, Map, TrendingUp, ShieldCheck, Activity, Award } from 'lucide-react';

interface Screen1Props {
  incident: IncidentDetails;
  timeline: TimelineEvent[];
  weather: WeatherData;
  vessel: Vessel;
  mapboxToken?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const Screen1IncidentDashboard: React.FC<Screen1Props> = ({
  incident,
  timeline,
  weather,
  vessel,
  mapboxToken,
  isExpanded,
  onToggleExpand
}) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'map'>('schematic');

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
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-bold tracking-tight text-slate-900 uppercase truncate">
            SCREEN 1 – INCIDENT DASHBOARD & EXECUTIVE ANALYTICS
          </h2>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all shadow-xs shrink-0"
          title={isExpanded ? 'Collapse' : 'Expand Screen 1 to Fullscreen'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto bg-slate-50/40 text-slate-800">
        {/* Top 4 Primary Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* 1. INCIDENT STATUS */}
          <div className="bg-gradient-to-br from-rose-50/90 to-white border border-rose-200/80 rounded-lg p-2 flex flex-col justify-between shadow-xs min-w-0">
            <div className="flex items-center gap-1 text-slate-600 text-[9px] font-bold uppercase truncate">
              <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
              <span className="truncate">INCIDENT STATUS</span>
            </div>
            <div className="mt-1">
              <div className="inline-block px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wide shadow-xs truncate max-w-full">
                {incident.level}
              </div>
            </div>
          </div>

          {/* 2. LOCATION */}
          <div className="bg-gradient-to-br from-blue-50/90 to-white border border-blue-200/80 rounded-lg p-2 flex flex-col justify-between shadow-xs min-w-0">
            <div className="flex items-center gap-1 text-slate-600 text-[9px] font-bold uppercase truncate">
              <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">LOCATION</span>
            </div>
            <div className="mt-0.5 min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">{incident.location}</div>
              <div className="text-[9.5px] text-blue-600 font-medium truncate">{incident.field}</div>
            </div>
          </div>

          {/* 3. PERSONNEL ACCOUNTABILITY */}
          <div className="bg-gradient-to-br from-emerald-50/90 to-white border border-emerald-200/80 rounded-lg p-2 flex flex-col justify-between shadow-xs min-w-0">
            <div className="flex items-center gap-1 text-slate-600 text-[9px] font-bold uppercase truncate">
              <Users className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">PERSONNEL</span>
            </div>
            <div className="mt-0.5 min-w-0">
              <div className="text-[11px] font-black text-slate-900 truncate">
                {incident.accountedPersonnel} / {incident.totalPersonnel}
              </div>
              <div className="text-[9.5px] text-emerald-700 font-semibold tracking-tight truncate">
                100% Accounted
              </div>
            </div>
          </div>

          {/* 4. ENVIRONMENTAL CONDITION */}
          <div className="bg-gradient-to-br from-sky-50/90 to-white border border-sky-200/80 rounded-lg p-2 flex flex-col justify-between shadow-xs min-w-0">
            <div className="flex items-center gap-1 text-slate-600 text-[9px] font-bold uppercase truncate">
              <Wind className="w-3 h-3 text-sky-600 shrink-0" />
              <span className="truncate">WEATHER METRICS</span>
            </div>
            <div className="mt-0.5 min-w-0">
              <div className="text-[11px] font-bold text-slate-900 truncate">
                Wind {weather.windSpeedKt} kt
              </div>
              <div className="text-[9.5px] text-sky-700 font-medium truncate">
                Sea {weather.seaStateM} m ({weather.windDirection})
              </div>
            </div>
          </div>
        </div>

        {/* Executive Strategic Management Analytics Banner */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                MANAGEMENT PERFORMANCE ANALYTICS
              </h3>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.5 rounded text-[9px] font-bold">
              Real-time Velocity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* KPI 1: Readiness Score */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2 flex items-center gap-2 min-w-0">
              <div className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-200/60 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase truncate">Readiness</div>
                <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                  <span>98.4%</span>
                  <span className="text-[9px] text-emerald-600 font-bold">Optimal</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.4%' }} />
                </div>
              </div>
            </div>

            {/* KPI 2: Containment Index */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2 flex items-center gap-2 min-w-0">
              <div className="p-1 rounded bg-blue-50 text-blue-600 border border-blue-200/60 shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase truncate">Source Containment</div>
                <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                  <span>100% Contained</span>
                  <span className="text-[9px] text-blue-600 font-bold">Isolated</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            {/* KPI 3: Operational Efficiency */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-2 flex items-center gap-2 min-w-0">
              <div className="p-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-200/60 shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[9px] text-slate-500 font-bold uppercase truncate">Efficiency</div>
                <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                  <span>96.8%</span>
                  <span className="text-[9px] text-indigo-600 font-bold">High Speed</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '96.8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row: Incident Timeline + Personnel Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Incident Timeline Card */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px] uppercase tracking-tight border-b border-slate-100 pb-1.5 mb-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">INCIDENT TIMELINE LOG</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-0.5">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-1.5 text-[10px] text-slate-800 bg-slate-50/80 px-2 py-1 rounded border border-slate-200/60 leading-tight">
                  <span className="font-mono text-blue-700 font-bold bg-blue-50 px-1 py-0.2 rounded text-[9px] border border-blue-200/80 shrink-0">
                    {item.time}
                  </span>
                  <span className="font-medium text-slate-800 break-words flex-1 min-w-0">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Casualties / Personnel Impact Card */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] uppercase tracking-tight border-b border-rose-200/60 pb-1.5 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">CASUALTIES & SAFETY AUDIT</span>
            </div>
            <div className="space-y-1 text-[10px] text-slate-800">
              <div className="flex justify-between items-center py-0.5 border-b border-rose-200/40">
                <span className="text-slate-600 font-medium">Missing Persons:</span>
                <span className="font-bold text-emerald-700">{incident.missingPersons === 0 ? '0 (All Accounted)' : incident.missingPersons}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-rose-200/40">
                <span className="text-slate-600 font-medium">Medical Attention:</span>
                <span className="font-bold text-amber-700">{incident.receivingMedical} receiving care</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-rose-200/40">
                <span className="text-slate-600 font-medium">Evacuated Personnel:</span>
                <span className="font-bold text-slate-800">{incident.evacuated} evacuated</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-600 font-medium">Medical Status:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/80 text-[9px] truncate max-w-[160px]">
                  {incident.medicalTransferStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Third Row: Priorities, Objectives & SITREP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Current Priorities */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-emerald-700 font-bold text-[10.5px] uppercase border-b border-slate-100 pb-1 mb-1.5">
              <FileText className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">CURRENT PRIORITIES</span>
            </div>
            <ul className="space-y-1 text-[10px] text-slate-700 font-medium leading-snug">
              {incident.currentPriorities.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="break-words">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Incident Objectives */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-blue-700 font-bold text-[10.5px] uppercase border-b border-slate-100 pb-1 mb-1.5">
              <Target className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">INCIDENT OBJECTIVES</span>
            </div>
            <ul className="space-y-1 text-[10px] text-slate-700 font-medium leading-snug">
              {incident.incidentObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                  <span className="break-words">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest SITREP */}
          <div className="bg-purple-50/40 border border-purple-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center justify-between text-purple-800 font-bold text-[10.5px] uppercase border-b border-purple-200/60 pb-1 mb-1.5">
              <span className="flex items-center gap-1 truncate">
                <FileText className="w-3 h-3 text-purple-600 shrink-0" />
                SITREP NO. {incident.latestSitrepNumber}
              </span>
              <span className="text-[9px] text-purple-700 font-mono shrink-0">Next: {incident.nextSitrepTime}</span>
            </div>
            <div className="space-y-1 text-[10px] text-purple-900 leading-snug">
              {incident.latestSitrepText.map((st, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="w-1 h-1 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                  <span className="break-words">{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Salbiah Field Location Diagram / GIS Map */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-1.5 mb-2 gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Map className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight truncate">
                LAYOUT DIAGRAM – {incident.field || 'OFFSHORE FIELD'}
              </h3>
            </div>
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 text-[9.5px]">
              <button
                onClick={() => setViewMode('schematic')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  viewMode === 'schematic' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Schematic
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-2 py-0.5 rounded font-bold transition-all ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                GIS Map
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <OffshoreMap vessel={vessel} mapboxToken={mapboxToken} />
          ) : (
            <div className="relative bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/80 overflow-hidden min-h-[210px] flex flex-col justify-between">
              {/* Background Coastline Graphic */}
              <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-emerald-100/30 border-l border-emerald-200/50 p-2 flex flex-col justify-between text-right pointer-events-none">
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">
                  MIRI COASTLINE
                </span>
                <span className="text-[10px] font-bold text-emerald-800">Sarawak Waters</span>
              </div>

              {/* Offshore Network Diagram */}
              <div className="relative z-10 grid grid-cols-3 gap-2 items-center my-2">
                {/* S1 Platform */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs text-center truncate max-w-full">
                    WELLHEAD (S1)
                  </div>
                  <span className="text-[9px] text-rose-600 font-mono mt-0.5 font-semibold">-- 6.5 km --</span>
                </div>

                {/* Main SLDP-A Facility (Center Alert) */}
                <div className="flex flex-col items-center col-span-1 min-w-0">
                  <div className="relative bg-rose-600 text-white p-2 rounded-lg shadow-xs text-center max-w-full">
                    <span className="absolute -top-1.5 -right-1 bg-rose-800 text-white text-[7.5px] font-extrabold px-1 py-0.2 rounded-full border border-rose-300 shadow-xs">
                      CONTAINED
                    </span>
                    <div className="text-[10px] font-bold tracking-tight truncate">SLDP-A Facility</div>
                    <div className="text-[8.5px] text-rose-100 font-medium truncate">Salbiah Field</div>
                  </div>
                </div>

                {/* S2 Platform */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs text-center truncate max-w-full">
                    WELLHEAD (S2)
                  </div>
                  <span className="text-[9px] text-rose-600 font-mono mt-0.5 font-semibold">-- 8.0 km --</span>
                </div>

                {/* Subsea Area */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="bg-sky-100/90 border border-sky-300 text-sky-900 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs text-center truncate max-w-full">
                    SUBSEA AREA
                  </div>
                  <span className="text-[9px] text-blue-600 font-mono mt-0.5 font-semibold">-- 3.5 km --</span>
                </div>

                <div className="hidden md:block" />

                {/* S3 Platform */}
                <div className="flex flex-col items-center min-w-0">
                  <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-2 py-0.5 rounded text-[9.5px] font-bold shadow-xs text-center truncate max-w-full">
                    WELLHEAD (S3)
                  </div>
                  <span className="text-[9px] text-rose-600 font-mono mt-0.5 font-semibold">-- 11.5 km --</span>
                </div>
              </div>

              {/* Schematic Legend */}
              <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-slate-600 border-t border-slate-200/80 pt-1 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-rose-500" /> Pipeline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-blue-500 border-t border-dashed" /> Umbilical
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-sky-500 border-t border-dotted" /> Distance
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

