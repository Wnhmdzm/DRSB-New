import React, { useState } from 'react';
import { IncidentDetails, TimelineEvent, ActionItem, Vessel, Helicopter, User, UserRole } from '../types';
import { X, Database, Download, Upload, Plus, Trash2, Check, RefreshCw, Lock, Sparkles, FileSpreadsheet } from 'lucide-react';

interface ExcelDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  incident: IncidentDetails;
  timeline: TimelineEvent[];
  actions: ActionItem[];
  vessels: Vessel[];
  helicopter: Helicopter;
  users: User[];
  onSaveData: (updated: {
    incident?: IncidentDetails;
    timeline?: TimelineEvent[];
    actions?: ActionItem[];
    vessels?: Vessel[];
    users?: User[];
  }) => void;
}

export const ExcelDatabaseModal: React.FC<ExcelDatabaseModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  incident,
  timeline,
  actions,
  vessels,
  helicopter,
  users,
  onSaveData
}) => {
  const [activeTab, setActiveTab] = useState<'incident' | 'actions' | 'timeline' | 'vessels' | 'users'>('incident');
  const [autoSync, setAutoSync] = useState(true);

  // Editable local state copies
  const [localIncident, setLocalIncident] = useState<IncidentDetails>({ ...incident });
  const [localActions, setLocalActions] = useState<ActionItem[]>([...actions]);
  const [localTimeline, setLocalTimeline] = useState<TimelineEvent[]>([...timeline]);
  const [localVessels, setLocalVessels] = useState<Vessel[]>([...vessels]);
  const [localUsers, setLocalUsers] = useState<User[]>([...users]);

  if (!isOpen) return null;

  const isReadOnly = currentUser.role === 'Viewer (Observer)';

  const handleSync = () => {
    onSaveData({
      incident: localIncident,
      actions: localActions,
      timeline: localTimeline,
      vessels: localVessels,
      users: localUsers
    });
  };

  const handleFieldChangeIncident = (field: keyof IncidentDetails, value: any) => {
    if (isReadOnly) return;
    const updated = { ...localIncident, [field]: value };
    setLocalIncident(updated);
    if (autoSync) {
      onSaveData({ incident: updated });
    }
  };

  const handleActionCellChange = (id: number, field: keyof ActionItem, value: any) => {
    if (isReadOnly) return;
    const updated = localActions.map((a) => (a.id === id ? { ...a, [field]: value } : a));
    setLocalActions(updated);
    if (autoSync) {
      onSaveData({ actions: updated });
    }
  };

  const handleAddActionRow = () => {
    if (isReadOnly) return;
    const newRow: ActionItem = {
      id: localActions.length + 1,
      action: 'New Emergency Action Item',
      responsible: 'ECC Lead',
      status: 'In Progress'
    };
    const updated = [...localActions, newRow];
    setLocalActions(updated);
    if (autoSync) onSaveData({ actions: updated });
  };

  const handleDeleteActionRow = (id: number) => {
    if (isReadOnly) return;
    const updated = localActions.filter((a) => a.id !== id);
    setLocalActions(updated);
    if (autoSync) onSaveData({ actions: updated });
  };

  const handleTimelineCellChange = (id: string, field: keyof TimelineEvent, value: any) => {
    if (isReadOnly) return;
    const updated = localTimeline.map((t) => (t.id === id ? { ...t, [field]: value } : t));
    setLocalTimeline(updated);
    if (autoSync) onSaveData({ timeline: updated });
  };

  const handleAddTimelineRow = () => {
    if (isReadOnly) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRow: TimelineEvent = {
      id: Date.now().toString(),
      time: timeNow,
      event: 'New status log entry recorded',
      category: 'sitrep'
    };
    const updated = [...localTimeline, newRow];
    setLocalTimeline(updated);
    if (autoSync) onSaveData({ timeline: updated });
  };

  const handleDeleteTimelineRow = (id: string) => {
    if (isReadOnly) return;
    const updated = localTimeline.filter((t) => t.id !== id);
    setLocalTimeline(updated);
    if (autoSync) onSaveData({ timeline: updated });
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === 'actions') {
      csvContent += "No,Action,Responsible,Status\n";
      localActions.forEach(a => {
        csvContent += `"${a.id}","${a.action}","${a.responsible}","${a.status}"\n`;
      });
    } else if (activeTab === 'timeline') {
      csvContent += "Time,Event,Category\n";
      localTimeline.forEach(t => {
        csvContent += `"${t.time}","${t.event}","${t.category}"\n`;
      });
    } else {
      csvContent += "Metric,Value\n";
      csvContent += `Location,${localIncident.location}\nLevel,${localIncident.level}\nAccounted,${localIncident.accountedPersonnel}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `drsb_database_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-slate-900/10">
        {/* Modal Header */}
        <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">
                  EXCEL DATABASE & EMERGENCY DATA MANAGER
                </h3>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-mono px-2 py-0.5 rounded-lg font-bold shadow-xs">
                  Live Reactivity Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Directly edit spreadsheet records to sync upfront dashboard components in real-time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Auto-sync Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 font-medium shadow-xs">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>Auto-Sync Dashboard</span>
            </label>

            {/* Manual Sync Button */}
            <button
              onClick={handleSync}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border border-emerald-500 shadow-xs transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Now</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-xs transition-all"
              title="Export Current Sheet to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Read-Only Alert for Viewers */}
        {isReadOnly && (
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs font-semibold text-amber-800 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <span>Read-Only Mode: You are logged in as a Viewer. Switch to Incident Commander (Admin) or Operations (Editor) role to modify records.</span>
          </div>
        )}

        {/* Excel Tab Bar */}
        <div className="bg-slate-50/80 border-b border-slate-200/80 px-4 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('incident')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'incident'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Sheet 1: Incident & Status</span>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'actions'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Sheet 2: Action Tracker ({localActions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Sheet 3: Timeline & Logs ({localTimeline.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Sheet 4: User Accounts & RBAC ({localUsers.length})</span>
          </button>
        </div>

        {/* Spreadsheet Table Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-50/30 text-xs">
          {/* TAB 1: INCIDENT OVERVIEW */}
          {activeTab === 'incident' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3 font-mono text-[11px] text-emerald-800 flex items-center gap-2 shadow-xs">
                <span className="font-bold">fx:</span>
                <span className="text-slate-900 font-bold">
                  ACCOUNTABILITY_RATE = ({localIncident.accountedPersonnel} / {localIncident.totalPersonnel}) * 100 = 100%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <h4 className="font-bold text-emerald-700 uppercase border-b border-slate-100 pb-2">
                    Primary Incident Key Values
                  </h4>

                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Incident Level:</label>
                      <select
                        value={localIncident.level}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('level', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="LEVEL 1 (LOCAL)">LEVEL 1 (LOCAL)</option>
                        <option value="LEVEL 2 (STABILISING)">LEVEL 2 (STABILISING)</option>
                        <option value="LEVEL 3 (CRISIS)">LEVEL 3 (CRISIS)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Location Facility:</label>
                      <input
                        type="text"
                        value={localIncident.location}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('location', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Field Name:</label>
                      <input
                        type="text"
                        value={localIncident.field}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('field', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs">
                  <h4 className="font-bold text-emerald-700 uppercase border-b border-slate-100 pb-2">
                    Personnel & Muster Counts
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Total Onboard:</label>
                      <input
                        type="number"
                        value={localIncident.totalPersonnel}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('totalPersonnel', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Accounted:</label>
                      <input
                        type="number"
                        value={localIncident.accountedPersonnel}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('accountedPersonnel', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Missing Persons:</label>
                      <input
                        type="number"
                        value={localIncident.missingPersons}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('missingPersons', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Medical Attention:</label>
                      <input
                        type="number"
                        value={localIncident.receivingMedical}
                        disabled={isReadOnly}
                        onChange={(e) => handleFieldChangeIncident('receivingMedical', Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 font-mono focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTION TRACKER */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-bold">Editable Grid (Click cells to modify)</span>
                {!isReadOnly && (
                  <button
                    onClick={handleAddActionRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Action Row</span>
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                      <th className="p-2 border-r border-slate-200/80 w-12 text-center">Row</th>
                      <th className="p-2 border-r border-slate-200/80 w-16 text-center">[A] NO</th>
                      <th className="p-2 border-r border-slate-200/80">[B] ACTION DESCRIPTION</th>
                      <th className="p-2 border-r border-slate-200/80 w-44">[C] RESPONSIBLE</th>
                      <th className="p-2 border-r border-slate-200/80 w-36">[D] STATUS</th>
                      {!isReadOnly && <th className="p-2 text-center w-16">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {localActions.map((act, index) => (
                      <tr key={act.id} className="hover:bg-slate-50/80">
                        <td className="p-2 border-r border-slate-100 text-slate-400 text-center font-mono">{index + 1}</td>
                        <td className="p-2 border-r border-slate-100 text-slate-600 font-mono text-center">{act.id}</td>
                        <td className="p-1 border-r border-slate-100">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={act.action}
                            onChange={(e) => handleActionCellChange(act.id, 'action', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-1 border-r border-slate-100">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={act.responsible}
                            onChange={(e) => handleActionCellChange(act.id, 'responsible', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-blue-700 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-1 border-r border-slate-100">
                          <select
                            value={act.status}
                            disabled={isReadOnly}
                            onChange={(e) => handleActionCellChange(act.id, 'status', e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="Completed">Completed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        {!isReadOnly && (
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteActionRow(act.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 transition"
                              title="Delete Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE & LOGS */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 font-bold">Timeline Event Log Spreadsheet</span>
                {!isReadOnly && (
                  <button
                    onClick={handleAddTimelineRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Event Entry</span>
                  </button>
                )}
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                      <th className="p-2 border-r border-slate-200/80 w-12 text-center">Row</th>
                      <th className="p-2 border-r border-slate-200/80 w-28">[A] TIMESTAMP</th>
                      <th className="p-2 border-r border-slate-200/80">[B] EVENT TITLE</th>
                      {!isReadOnly && <th className="p-2 text-center w-16">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {localTimeline.map((t, index) => (
                      <tr key={t.id} className="hover:bg-slate-50/80">
                        <td className="p-2 border-r border-slate-100 text-slate-400 text-center font-mono">{index + 1}</td>
                        <td className="p-1 border-r border-slate-100">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={t.time}
                            onChange={(e) => handleTimelineCellChange(t.id, 'time', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-blue-700 font-mono text-center focus:bg-white focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        <td className="p-1 border-r border-slate-100">
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={t.event}
                            onChange={(e) => handleTimelineCellChange(t.id, 'event', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                          />
                        </td>
                        {!isReadOnly && (
                          <td className="p-2 text-center">
                            <button
                              onClick={() => handleDeleteTimelineRow(t.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: USERS & RBAC */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px] uppercase">
                      <th className="p-2 border-r border-slate-200/80 w-12 text-center">Row</th>
                      <th className="p-2 border-r border-slate-200/80">[A] NAME</th>
                      <th className="p-2 border-r border-slate-200/80">[B] ROLE (RBAC)</th>
                      <th className="p-2 border-r border-slate-200/80">[C] EMAIL</th>
                      <th className="p-2 border-r border-slate-200/80">[D] DEPARTMENT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {localUsers.map((u, index) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="p-2 border-r border-slate-100 text-slate-400 text-center font-mono">{index + 1}</td>
                        <td className="p-2 border-r border-slate-100 text-slate-900 font-bold">{u.name}</td>
                        <td className="p-2 border-r border-slate-100 text-blue-700 font-bold">{u.role}</td>
                        <td className="p-2 border-r border-slate-100 text-slate-600 font-mono">{u.email}</td>
                        <td className="p-2 border-r border-slate-100 text-slate-500">{u.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
