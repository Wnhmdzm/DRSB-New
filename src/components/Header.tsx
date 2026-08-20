import React from 'react';
import { Droplet, Maximize } from 'lucide-react';

interface HeaderProps {
  onToggleGlobalFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleGlobalFullscreen
}) => {
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
                EMERGENCY MANAGEMENT TEAM (EMT) DASHBOARD
              </h1>
            </div>
            <p className="text-[10px] text-slate-500 font-medium truncate">
              Baram Junior Cluster (Salbiah & Fatimah Fields) | <span className="text-blue-600 font-semibold">Dialog Resources Sdn. Bhd.</span>
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
          {/* Global Fullscreen Toggle */}
          <button
            onClick={onToggleGlobalFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all shadow-xs"
            title="Expand Dashboard to Full Screen"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};


