import React from 'react';
import { Droplet, Maximize, Edit3, RefreshCw } from 'lucide-react';
import { IncidentDetails } from '../types';

export interface CloudSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  lastUpdated?: string;
}

interface HeaderProps {
  incident?: IncidentDetails;
  cloudSyncStatus?: CloudSyncStatus;
  onToggleGlobalFullscreen: () => void;
  onOpenEditPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  incident,
  cloudSyncStatus = { isConnected: true, isSyncing: false, lastUpdated: 'Live' },
  onToggleGlobalFullscreen,
  onOpenEditPortal
}) => {
  const displayTitle = incident?.title || 'EMERGENCY MANAGEMENT TEAM (EMT) DASHBOARD';
  const displayCluster = incident?.clusterName || 'Baram Junior Cluster (Salbiah & Fatimah Fields)';
  const displayCompany = incident?.companyName || 'Dialog Resources Sdn. Bhd.';

  return (
    <header className="bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs px-3 py-1.5 text-slate-900 sticky top-0 z-50 transition-colors">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-2.5">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-xs text-white shrink-0">
            <Droplet className="w-4 h-4 fill-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs tracking-wider text-blue-600 shrink-0">DRSB</span>
              <h1 className="text-xs md:text-sm font-bold tracking-tight text-slate-900 uppercase truncate">
                {displayTitle}
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              {displayCluster} | <span className="text-blue-600 font-semibold">{displayCompany}</span>
            </p>
          </div>
        </div>

        {/* Center: Safety Pillars / Slogans */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 bg-slate-100/90 rounded-full border border-slate-200/80 text-[10px] font-bold text-slate-600 uppercase tracking-tight shrink-0">
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SAFETY FIRST
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-blue-600 font-bold">COMMUNICATE CLEARLY</span>
          <span className="text-slate-300">•</span>
          <span className="text-amber-600 font-bold">ACT SAFELY</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Cloud Database Sync Badge */}
          <div
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-700"
            title={`Firebase Firestore Connected (Project: drsb-emt). Last synced: ${cloudSyncStatus.lastUpdated || 'Live'}`}
          >
            {cloudSyncStatus.isSyncing ? (
              <>
                <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                <span className="text-blue-700 font-bold">Syncing DB...</span>
              </>
            ) : cloudSyncStatus.isConnected ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-600 font-medium">Cloud DB:</span>
                <span className="font-bold text-emerald-700">drsb-emt</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-amber-700 font-bold">Offline Cache</span>
              </>
            )}
          </div>

          {/* Edit Portal Button on the left side of the expand full screen button */}
          <button
            onClick={onOpenEditPortal}
            id="edit-portal-button"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all border border-blue-700 active:scale-95 cursor-pointer"
            title="Open Data & Information Edit Portal"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          {/* Global Fullscreen Toggle */}
          <button
            onClick={onToggleGlobalFullscreen}
            id="fullscreen-toggle-button"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all shadow-xs cursor-pointer"
            title="Expand Dashboard to Full Screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};


