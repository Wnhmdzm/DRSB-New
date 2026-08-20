import React from 'react';
import { FilterState } from '../types';
import { Filter, Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilter: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilter,
  onResetFilters
}) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2 text-xs text-slate-700 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-blue-600">
          <Filter className="w-3.5 h-3.5" />
          <span>Power BI Slicers:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Field Location Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Field:</span>
            <select
              value={filters.field}
              onChange={(e) => onChangeFilter('field', e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Fields</option>
              <option value="Salbiah Field">Salbiah Field</option>
              <option value="Fatimah Field">Fatimah Field</option>
              <option value="Miri Shore Base">Miri Shore Base</option>
            </select>
          </div>

          {/* Incident Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Incident Level:</span>
            <select
              value={filters.incidentLevel}
              onChange={(e) => onChangeFilter('incidentLevel', e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Levels</option>
              <option value="LEVEL 1 (LOCAL)">Level 1 (Local)</option>
              <option value="LEVEL 2 (STABILISING)">Level 2 (Stabilising)</option>
              <option value="LEVEL 3 (CRISIS)">Level 3 (Crisis)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Action Status:</span>
            <select
              value={filters.status}
              onChange={(e) => onChangeFilter('status', e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Time Horizon Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Time Horizon:</span>
            <select
              value={filters.timeHorizon}
              onChange={(e) => onChangeFilter('timeHorizon', e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 font-medium focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm"
            >
              <option value="LIVE">Live Real-Time</option>
              <option value="1H">Past 1 Hour</option>
              <option value="4H">Past 4 Hours</option>
              <option value="FULL">Full Log</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search actions/logs..."
              value={filters.searchTerm}
              onChange={(e) => onChangeFilter('searchTerm', e.target.value)}
              className="bg-slate-100/90 border border-slate-200 rounded-xl pl-8 pr-3 py-1 text-slate-800 placeholder-slate-400 w-36 focus:w-48 focus:bg-white focus:border-blue-500 focus:outline-none transition-all shadow-sm"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 font-semibold transition-all shadow-sm"
            title="Reset Slicers"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
