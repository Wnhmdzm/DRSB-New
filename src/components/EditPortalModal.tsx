import React, { useState, useEffect } from 'react';
import {
  IncidentDetails,
  TimelineEvent,
  ActionItem,
  Vessel,
  Helicopter,
  WeatherData,
  Participant,
  ChatMessage,
  IncidentLevel
} from '../types';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  Layers,
  Clock,
  CheckSquare,
  Ship,
  CloudSun,
  Users,
  FileText,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sliders,
  Database
} from 'lucide-react';

export interface EditPortalData {
  incident: IncidentDetails;
  timeline: TimelineEvent[];
  actions: ActionItem[];
  vessels: Vessel[];
  helicopter: Helicopter;
  weather: WeatherData;
  participants: Participant[];
  chatMessages: ChatMessage[];
}

interface EditPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EditPortalData;
  onSave: (updatedData: EditPortalData) => void;
  onResetToDefaults: () => void;
}

type TabKey =
  | 'general'
  | 'personnel'
  | 'timeline'
  | 'actions'
  | 'sitrep'
  | 'logistics'
  | 'weather'
  | 'teams';

export const EditPortalModal: React.FC<EditPortalModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onResetToDefaults
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('general');

  // Local draft copies
  const [incident, setIncident] = useState<IncidentDetails>({ ...data.incident });
  const [timeline, setTimeline] = useState<TimelineEvent[]>([...data.timeline]);
  const [actions, setActions] = useState<ActionItem[]>([...data.actions]);
  const [vessels, setVessels] = useState<Vessel[]>([...data.vessels]);
  const [helicopter, setHelicopter] = useState<Helicopter>({ ...data.helicopter });
  const [weather, setWeather] = useState<WeatherData>({ ...data.weather });
  const [participants, setParticipants] = useState<Participant[]>([...data.participants]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([...data.chatMessages]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Sync draft when opened or external data changes
  useEffect(() => {
    if (isOpen) {
      setIncident({ ...data.incident });
      setTimeline([...data.timeline]);
      setActions([...data.actions]);
      setVessels([...data.vessels]);
      setHelicopter({ ...data.helicopter });
      setWeather({ ...data.weather });
      setParticipants([...data.participants]);
      setChatMessages([...data.chatMessages]);
      setHasUnsavedChanges(false);
      setSaveSuccessNotice(false);
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const markChanged = () => setHasUnsavedChanges(true);

  // Handle Save
  const handleSaveAndApply = () => {
    const updated: EditPortalData = {
      incident,
      timeline,
      actions,
      vessels,
      helicopter,
      weather,
      participants,
      chatMessages
    };
    onSave(updated);
    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      onClose();
    }, 450);
  };

  // --- Handlers for Priorities, Objectives, SITREP bullets ---
  const handleAddPriority = () => {
    setIncident((prev) => ({
      ...prev,
      currentPriorities: [...prev.currentPriorities, 'New response priority']
    }));
    markChanged();
  };

  const handleUpdatePriority = (index: number, val: string) => {
    setIncident((prev) => {
      const copy = [...prev.currentPriorities];
      copy[index] = val;
      return { ...prev, currentPriorities: copy };
    });
    markChanged();
  };

  const handleDeletePriority = (index: number) => {
    setIncident((prev) => ({
      ...prev,
      currentPriorities: prev.currentPriorities.filter((_, i) => i !== index)
    }));
    markChanged();
  };

  const handleAddObjective = () => {
    setIncident((prev) => ({
      ...prev,
      incidentObjectives: [...prev.incidentObjectives, 'New strategic incident objective']
    }));
    markChanged();
  };

  const handleUpdateObjective = (index: number, val: string) => {
    setIncident((prev) => {
      const copy = [...prev.incidentObjectives];
      copy[index] = val;
      return { ...prev, incidentObjectives: copy };
    });
    markChanged();
  };

  const handleDeleteObjective = (index: number) => {
    setIncident((prev) => ({
      ...prev,
      incidentObjectives: prev.incidentObjectives.filter((_, i) => i !== index)
    }));
    markChanged();
  };

  const handleAddSitrepBullet = () => {
    setIncident((prev) => ({
      ...prev,
      latestSitrepText: [...prev.latestSitrepText, 'New operational status report update']
    }));
    markChanged();
  };

  const handleUpdateSitrepBullet = (index: number, val: string) => {
    setIncident((prev) => {
      const copy = [...prev.latestSitrepText];
      copy[index] = val;
      return { ...prev, latestSitrepText: copy };
    });
    markChanged();
  };

  const handleDeleteSitrepBullet = (index: number) => {
    setIncident((prev) => ({
      ...prev,
      latestSitrepText: prev.latestSitrepText.filter((_, i) => i !== index)
    }));
    markChanged();
  };

  // --- Handlers for Timeline Events ---
  const handleAddTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'New emergency response event log entry',
      category: 'response'
    };
    setTimeline((prev) => [...prev, newEvent]);
    markChanged();
  };

  const handleUpdateTimeline = (id: string, field: keyof TimelineEvent, val: any) => {
    setTimeline((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: val } : t)));
    markChanged();
  };

  const handleDeleteTimeline = (id: string) => {
    setTimeline((prev) => prev.filter((t) => t.id !== id));
    markChanged();
  };

  const handleMoveTimeline = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === timeline.length - 1)
    )
      return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...timeline];
    const item = copy.splice(index, 1)[0];
    copy.splice(targetIndex, 0, item);
    setTimeline(copy);
    markChanged();
  };

  // --- Handlers for Actions Items ---
  const handleAddAction = () => {
    const nextId = actions.length > 0 ? Math.max(...actions.map((a) => a.id)) + 1 : 1;
    const newAction: ActionItem = {
      id: nextId,
      action: 'Execute containment verification and report to IC',
      responsible: 'OIM / MOCC',
      status: 'In Progress'
    };
    setActions((prev) => [...prev, newAction]);
    markChanged();
  };

  const handleUpdateAction = (id: number, field: keyof ActionItem, val: any) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
    markChanged();
  };

  const handleDeleteAction = (id: number) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
    markChanged();
  };

  // --- Handlers for Vessels ---
  const handleAddVessel = () => {
    const newVessel: Vessel = {
      id: `VESSEL-0${vessels.length + 1}`,
      name: `Support Vessel ${vessels.length + 1}`,
      status: 'En route',
      eta: '16:00',
      speedKnots: 18,
      coordinates: [4.425, 113.91],
      heading: 320
    };
    setVessels((prev) => [...prev, newVessel]);
    markChanged();
  };

  const handleUpdateVessel = (id: string, field: keyof Vessel, val: any) => {
    setVessels((prev) =>
      prev.map((v) => {
        if (v.id !== id) return v;
        if (field === 'coordinates') {
          return { ...v, coordinates: val };
        }
        return { ...v, [field]: val };
      })
    );
    markChanged();
  };

  const handleDeleteVessel = (id: string) => {
    if (vessels.length <= 1) {
      alert('At least one primary vessel is required for the offshore map and tactical display.');
      return;
    }
    setVessels((prev) => prev.filter((v) => v.id !== id));
    markChanged();
  };

  // --- Handlers for Participants ---
  const handleAddParticipant = () => {
    const newP: Participant = {
      id: `p${Date.now()}`,
      name: 'New Incident Responder',
      roleShort: 'SEC',
      department: 'Safety & Security',
      status: 'Connected',
      videoOn: true,
      micOn: true
    };
    setParticipants((prev) => [...prev, newP]);
    markChanged();
  };

  const handleUpdateParticipant = (id: string, field: keyof Participant, val: any) => {
    setParticipants((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: val } : p)));
    markChanged();
  };

  const handleDeleteParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    markChanged();
  };

  // --- Handlers for Chat Messages ---
  const handleAddChatMessage = () => {
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'ECC Incident Commander',
      role: 'IC',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Command directive logged.'
    };
    setChatMessages((prev) => [...prev, newMsg]);
    markChanged();
  };

  const handleUpdateChatMessage = (id: string, field: keyof ChatMessage, val: any) => {
    setChatMessages((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
    markChanged();
  };

  const handleDeleteChatMessage = (id: string) => {
    setChatMessages((prev) => prev.filter((m) => m.id !== id));
    markChanged();
  };

  // Tabs Definition
  const tabs = [
    { id: 'general', label: 'Title & Incident', icon: FileText, badge: null },
    { id: 'personnel', label: 'Personnel & Casualties', icon: Users, badge: `${incident.accountedPersonnel}/${incident.totalPersonnel}` },
    { id: 'timeline', label: 'Timeline Log', icon: Clock, badge: timeline.length },
    { id: 'actions', label: 'Action Items Tracker', icon: CheckSquare, badge: actions.length },
    { id: 'sitrep', label: 'Priorities & SITREP', icon: Sliders, badge: null },
    { id: 'logistics', label: 'Vessels & Helicopter', icon: Ship, badge: vessels.length },
    { id: 'weather', label: 'Weather & Ocean', icon: CloudSun, badge: `${weather.windSpeedKt}kt` },
    { id: 'teams', label: 'Teams Roster & Chat', icon: Users, badge: participants.length }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-6xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden text-slate-900 ring-1 ring-slate-900/10">
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight uppercase">
                  EMT DASHBOARD – DATA & INFORMATION EDIT PORTAL
                </h2>
                {hasUnsavedChanges && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                    Unsaved Changes
                  </span>
                )}
                {saveSuccessNotice && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved & Reflected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Modify, add, or delete any values, titles, or logs. Changes reflect across all screens immediately upon saving.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all dashboard information to baseline default demo values?')) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 shadow-xs"
              title="Reset everything to default values"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Left Vertical Sidebar Tabs + Right Content Editor */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-50/50">
          {/* Navigation Tabs (Sidebar on Desktop, Horizontal Scroll on Mobile) */}
          <div className="w-full md:w-64 bg-slate-100/90 border-b md:border-b-0 md:border-r border-slate-200 p-2 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
            <div className="hidden md:block px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Database Sections
            </div>
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as TabKey)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap md:whitespace-normal text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span className="truncate">{t.label}</span>
                  </div>
                  {t.badge && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isActive ? 'bg-blue-700/70 text-blue-100' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Editor Panels Content Area */}
          <div className="flex-1 p-3 md:p-5 overflow-y-auto bg-white min-w-0">
            {/* ========================================================= */}
            {/* TAB 1: TITLE & GENERAL INCIDENT DETAILS                   */}
            {/* ========================================================= */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Dashboard Titles & Facility Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      Customize the main dashboard banner headline, company name, cluster subtitle, and incident status.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Dashboard Main Title */}
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dashboard Main Title (Header Headline)
                    </label>
                    <input
                      type="text"
                      value={incident.title}
                      onChange={(e) => {
                        setIncident({ ...incident, title: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g. DRSB EMERGENCY MANAGEMENT TEAM (EMT) DASHBOARD"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      value={incident.companyName}
                      onChange={(e) => {
                        setIncident({ ...incident, companyName: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Dialog Resources Sdn. Bhd."
                    />
                  </div>

                  {/* Cluster / Field Name Subtitle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cluster / Subtitle Description
                    </label>
                    <input
                      type="text"
                      value={incident.clusterName}
                      onChange={(e) => {
                        setIncident({ ...incident, clusterName: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Baram Junior Cluster (Salbiah & Fatimah Fields)"
                    />
                  </div>

                  {/* Incident Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Incident Escalation Level
                    </label>
                    <select
                      value={incident.level}
                      onChange={(e) => {
                        setIncident({ ...incident, level: e.target.value as IncidentLevel });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="LEVEL 1 (LOCAL)">LEVEL 1 (LOCAL)</option>
                      <option value="LEVEL 2 (STABILISING)">LEVEL 2 (STABILISING)</option>
                      <option value="LEVEL 3 (CRISIS)">LEVEL 3 (CRISIS)</option>
                    </select>
                  </div>

                  {/* Status Badge Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Status Text Summary
                    </label>
                    <input
                      type="text"
                      value={incident.statusText}
                      onChange={(e) => {
                        setIncident({ ...incident, statusText: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. LEVEL 2 STABILISING"
                    />
                  </div>

                  {/* Facility / Location */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Location / Facility
                    </label>
                    <input
                      type="text"
                      value={incident.location}
                      onChange={(e) => {
                        setIncident({ ...incident, location: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. SLDP-A Facility"
                    />
                  </div>

                  {/* Field Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Offshore Field Name
                    </label>
                    <input
                      type="text"
                      value={incident.field}
                      onChange={(e) => {
                        setIncident({ ...incident, field: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Salbiah Field"
                    />
                  </div>

                  {/* Incident Tracking ID */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Incident Reference ID
                    </label>
                    <input
                      type="text"
                      value={incident.id}
                      onChange={(e) => {
                        setIncident({ ...incident, id: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. INC-2026-0809"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: PERSONNEL & CASUALTIES AUDIT                       */}
            {/* ========================================================= */}
            {activeTab === 'personnel' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Personnel Accountability & Casualties Audit
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live personnel on board (POB), muster reconciliation, medical cases, and evacuation logistics.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Accounted Personnel
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incident.accountedPersonnel}
                      onChange={(e) => {
                        setIncident({ ...incident, accountedPersonnel: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Total POB (Personnel On Board)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incident.totalPersonnel}
                      onChange={(e) => {
                        setIncident({ ...incident, totalPersonnel: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Missing Persons
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incident.missingPersons}
                      onChange={(e) => {
                        setIncident({ ...incident, missingPersons: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none ${
                        incident.missingPersons > 0
                          ? 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Receiving Medical Attention
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incident.receivingMedical}
                      onChange={(e) => {
                        setIncident({ ...incident, receivingMedical: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Evacuated Personnel
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={incident.evacuated}
                      onChange={(e) => {
                        setIncident({ ...incident, evacuated: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Medical Transfer Status
                    </label>
                    <input
                      type="text"
                      value={incident.medicalTransferStatus}
                      onChange={(e) => {
                        setIncident({ ...incident, medicalTransferStatus: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Standby / Medevac arranged"
                    />
                  </div>
                </div>

                {/* Accountability Calculation Banner */}
                <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-700">
                    Personnel Reconciliation Status:
                  </div>
                  <div className="font-bold">
                    {incident.accountedPersonnel === incident.totalPersonnel && incident.missingPersons === 0 ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> 100% Accounted For ({incident.accountedPersonnel}/{incident.totalPersonnel})
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Discrepancy: {incident.totalPersonnel - incident.accountedPersonnel} Unaccounted
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 3: TIMELINE EVENT LOG                                 */}
            {/* ========================================================= */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Incident Timeline Log
                    </h3>
                    <p className="text-xs text-slate-500">
                      Chronological log of alarms, notifications, muster completions, and isolation milestones.
                    </p>
                  </div>
                  <button
                    onClick={handleAddTimelineEvent}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {timeline.map((item, index) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all hover:bg-white"
                    >
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-mono text-slate-400 font-semibold w-5 text-center">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleUpdateTimeline(item.id, 'time', e.target.value)}
                          className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs font-bold text-blue-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="14:00"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={item.event}
                          onChange={(e) => handleUpdateTimeline(item.id, 'event', e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Event description..."
                        />
                      </div>

                      <div className="flex items-center gap-1 shrink-0 justify-end">
                        <button
                          onClick={() => handleMoveTimeline(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveTimeline(index, 'down')}
                          disabled={index === timeline.length - 1}
                          className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTimeline(item.id)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600 transition-all ml-1"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {timeline.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No timeline events logged. Click "Add Event" above to create one.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 4: ACTION ITEMS TRACKER                               */}
            {/* ========================================================= */}
            {activeTab === 'actions' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Action Items & Tactical Task Tracker
                    </h3>
                    <p className="text-xs text-slate-500">
                      Operational tasks assigned across MOCC, ECC, HSSE, and Logistics.
                    </p>
                  </div>
                  <button
                    onClick={handleAddAction}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {actions.map((act) => (
                    <div
                      key={act.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 hover:bg-white transition-all"
                    >
                      <div className="w-7 text-center font-mono text-xs font-bold text-slate-400 shrink-0">
                        #{act.id}
                      </div>

                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5 md:hidden">
                          Action Description
                        </label>
                        <input
                          type="text"
                          value={act.action}
                          onChange={(e) => handleUpdateAction(act.id, 'action', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Action item task..."
                        />
                      </div>

                      <div className="w-full md:w-36 shrink-0">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5 md:hidden">
                          Responsible
                        </label>
                        <input
                          type="text"
                          value={act.responsible}
                          onChange={(e) => handleUpdateAction(act.id, 'responsible', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g. OIM / MOCC"
                        />
                      </div>

                      <div className="w-full md:w-32 shrink-0">
                        <label className="block text-[10px] font-bold text-slate-500 mb-0.5 md:hidden">
                          Status
                        </label>
                        <select
                          value={act.status}
                          onChange={(e) =>
                            handleUpdateAction(act.id, 'status', e.target.value as ActionItem['status'])
                          }
                          className={`w-full px-2 py-1.5 rounded-lg border text-xs font-bold outline-none ${
                            act.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : act.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>

                      <button
                        onClick={() => handleDeleteAction(act.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-all shrink-0 self-end md:self-auto"
                        title="Delete action item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {actions.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No action items created. Click "Add Task" to track emergency tasks.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 5: PRIORITIES, OBJECTIVES & SITREP                    */}
            {/* ========================================================= */}
            {activeTab === 'sitrep' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Incident Priorities, Objectives & SITREP Log
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live operational priorities, core containment objectives, and sitrep bulletin.
                  </p>
                </div>

                {/* Section A: Current Priorities */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Current Priorities List
                    </span>
                    <button
                      onClick={handleAddPriority}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" /> Add Priority
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {incident.currentPriorities.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-700 w-4">{idx + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdatePriority(idx, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <button
                          onClick={() => handleDeletePriority(idx)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Incident Objectives */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-blue-600" /> Incident Objectives List
                    </span>
                    <button
                      onClick={handleAddObjective}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" /> Add Objective
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {incident.incidentObjectives.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-blue-700 w-4">{idx + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                          onClick={() => handleDeleteObjective(idx)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section C: SITREP Details */}
                <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-200 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-purple-200/60 pb-1.5">
                    <span className="text-xs font-bold text-purple-900 uppercase">
                      SITREP Bulletin Details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">
                        SITREP Number
                      </label>
                      <input
                        type="text"
                        value={incident.latestSitrepNumber}
                        onChange={(e) => {
                          setIncident({ ...incident, latestSitrepNumber: e.target.value });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 text-xs font-bold text-purple-900 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="02"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">
                        Next SITREP Scheduled Time
                      </label>
                      <input
                        type="text"
                        value={incident.nextSitrepTime}
                        onChange={(e) => {
                          setIncident({ ...incident, nextSitrepTime: e.target.value });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 text-xs font-bold text-purple-900 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="15:00"
                      />
                    </div>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-purple-900">
                        SITREP Bulletin Bullet Points
                      </label>
                      <button
                        onClick={handleAddSitrepBullet}
                        className="px-2 py-0.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>

                    {incident.latestSitrepText.map((bullet, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => handleUpdateSitrepBullet(idx, e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-purple-300 text-xs text-purple-950 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={() => handleDeleteSitrepBullet(idx)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 6: VESSELS & HELICOPTER LOGISTICS                     */}
            {/* ========================================================= */}
            {activeTab === 'logistics' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase">
                      Marine Vessels & Aviation Support
                    </h3>
                    <p className="text-xs text-slate-500">
                      Vessel positioning, live ETA, speed, and rescue helicopter status.
                    </p>
                  </div>
                  <button
                    onClick={handleAddVessel}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Vessel</span>
                  </button>
                </div>

                {/* Vessels Section */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase">Emergency Support Vessels</div>
                  {vessels.map((v) => (
                    <div
                      key={v.id}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 hover:bg-white transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-blue-700 flex items-center gap-1.5">
                          <Ship className="w-4 h-4 text-blue-600" /> {v.id} – {v.name}
                        </span>
                        <button
                          onClick={() => handleDeleteVessel(v.id)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600 transition-all text-xs flex items-center gap-1"
                          title="Delete vessel"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Vessel ID
                          </label>
                          <input
                            type="text"
                            value={v.id}
                            onChange={(e) => handleUpdateVessel(v.id, 'id', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Vessel Full Name
                          </label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => handleUpdateVessel(v.id, 'name', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Deployment Status
                          </label>
                          <select
                            value={v.status}
                            onChange={(e) =>
                              handleUpdateVessel(v.id, 'status', e.target.value as Vessel['status'])
                            }
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs font-bold bg-white"
                          >
                            <option value="En route">En route</option>
                            <option value="On site">On site</option>
                            <option value="Standby">Standby</option>
                            <option value="Docked">Docked</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Estimated ETA
                          </label>
                          <input
                            type="text"
                            value={v.eta}
                            onChange={(e) => handleUpdateVessel(v.id, 'eta', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs font-bold text-emerald-700 bg-white"
                            placeholder="15:10"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Speed (Knots)
                          </label>
                          <input
                            type="number"
                            value={v.speedKnots}
                            onChange={(e) =>
                              handleUpdateVessel(v.id, 'speedKnots', Number(e.target.value) || 0)
                            }
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Latitude (GPS)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={v.coordinates[0]}
                            onChange={(e) =>
                              handleUpdateVessel(v.id, 'coordinates', [
                                Number(e.target.value) || 0,
                                v.coordinates[1]
                              ])
                            }
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs font-mono bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Longitude (GPS)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={v.coordinates[1]}
                            onChange={(e) =>
                              handleUpdateVessel(v.id, 'coordinates', [
                                v.coordinates[0],
                                Number(e.target.value) || 0
                              ])
                            }
                            className="w-full px-2 py-1 rounded border border-slate-300 text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Helicopter Section */}
                <div className="bg-sky-50/50 rounded-xl p-3 border border-sky-200 space-y-2.5">
                  <div className="text-xs font-bold text-sky-900 uppercase">
                    Aviation / Helicopter Support
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-sky-800 mb-0.5">
                        Helicopter ID / Model
                      </label>
                      <input
                        type="text"
                        value={helicopter.name}
                        onChange={(e) => {
                          setHelicopter({ ...helicopter, name: e.target.value });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-sky-300 text-xs font-bold bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-sky-800 mb-0.5">
                        Flight Readiness Status
                      </label>
                      <select
                        value={helicopter.status}
                        onChange={(e) => {
                          setHelicopter({
                            ...helicopter,
                            status: e.target.value as Helicopter['status']
                          });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-sky-300 text-xs font-bold bg-white"
                      >
                        <option value="Available">Available</option>
                        <option value="Mobilised">Mobilised</option>
                        <option value="Grounded">Grounded</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-sky-800 mb-0.5">
                        Weather Flight Conditions
                      </label>
                      <input
                        type="text"
                        value={helicopter.conditions}
                        onChange={(e) => {
                          setHelicopter({ ...helicopter, conditions: e.target.value });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-sky-300 text-xs bg-white"
                        placeholder="Suitable / Unfavorable"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-sky-800 mb-0.5">
                        Mobilisation Time
                      </label>
                      <input
                        type="text"
                        value={helicopter.mobilisationTime}
                        onChange={(e) => {
                          setHelicopter({ ...helicopter, mobilisationTime: e.target.value });
                          markChanged();
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-sky-300 text-xs font-bold bg-white"
                        placeholder="45 min"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 7: WEATHER & ENVIRONMENTAL METRICS                    */}
            {/* ========================================================= */}
            {activeTab === 'weather' && (
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Environmental & Ocean Weather Metrics
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live meteorological conditions, wind speed, sea state wave height, and atmospheric readings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location Tag
                    </label>
                    <input
                      type="text"
                      value={weather.locationName}
                      onChange={(e) => {
                        setWeather({ ...weather, locationName: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wind Speed (Knots)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={weather.windSpeedKt}
                      onChange={(e) => {
                        setWeather({ ...weather, windSpeedKt: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Wind Direction
                    </label>
                    <input
                      type="text"
                      value={weather.windDirection}
                      onChange={(e) => {
                        setWeather({ ...weather, windDirection: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. ENE, NE, SW"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sea State Height (Meters)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weather.seaStateM}
                      onChange={(e) => {
                        setWeather({ ...weather, seaStateM: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weather.temperatureC}
                      onChange={(e) => {
                        setWeather({ ...weather, temperatureC: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Weather Condition Summary
                    </label>
                    <input
                      type="text"
                      value={weather.conditions}
                      onChange={(e) => {
                        setWeather({ ...weather, conditions: e.target.value });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Partly Cloudy / Fair Waves"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Atmospheric Pressure (hPa)
                    </label>
                    <input
                      type="number"
                      value={weather.pressureHpa}
                      onChange={(e) => {
                        setWeather({ ...weather, pressureHpa: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Relative Humidity (%)
                    </label>
                    <input
                      type="number"
                      value={weather.humidityPct}
                      onChange={(e) => {
                        setWeather({ ...weather, humidityPct: Number(e.target.value) || 0 });
                        markChanged();
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 8: TEAMS PARTICIPANTS & CHAT LOG                      */}
            {/* ========================================================= */}
            {activeTab === 'teams' && (
              <div className="space-y-5">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-sm font-bold text-slate-900 uppercase">
                    Microsoft Teams Meeting Roster & Decision Chat
                  </h3>
                  <p className="text-xs text-slate-500">
                    Emergency management attendees, speaking status, and live decision message log.
                  </p>
                </div>

                {/* Section A: Participants Roster */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase">
                      Meeting Participants Roster
                    </span>
                    <button
                      onClick={handleAddParticipant}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Participant
                    </button>
                  </div>

                  <div className="space-y-2">
                    {participants.map((p) => (
                      <div
                        key={p.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 hover:bg-white"
                      >
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => handleUpdateParticipant(p.id, 'name', e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                          placeholder="Participant Name"
                        />
                        <input
                          type="text"
                          value={p.roleShort}
                          onChange={(e) => handleUpdateParticipant(p.id, 'roleShort', e.target.value)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-300 text-xs font-bold text-center text-blue-700 bg-white uppercase"
                          placeholder="IC/MO"
                        />
                        <input
                          type="text"
                          value={p.department}
                          onChange={(e) => handleUpdateParticipant(p.id, 'department', e.target.value)}
                          className="w-36 px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-700 bg-white"
                          placeholder="Department"
                        />
                        <select
                          value={p.status}
                          onChange={(e) =>
                            handleUpdateParticipant(p.id, 'status', e.target.value as Participant['status'])
                          }
                          className="w-28 px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                        >
                          <option value="Connected">Connected</option>
                          <option value="Speaking">Speaking</option>
                          <option value="Muted">Muted</option>
                        </select>
                        <button
                          onClick={() => handleDeleteParticipant(p.id)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section B: Chat & Decision Log */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase">
                      Emergency Chat & Decision Messages
                    </span>
                    <button
                      onClick={handleAddChatMessage}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Message
                    </button>
                  </div>

                  <div className="space-y-2">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-white border border-slate-200 rounded-lg p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                      >
                        <input
                          type="text"
                          value={msg.time}
                          onChange={(e) => handleUpdateChatMessage(msg.id, 'time', e.target.value)}
                          className="w-16 px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[11px] text-slate-600"
                        />
                        <input
                          type="text"
                          value={msg.sender}
                          onChange={(e) => handleUpdateChatMessage(msg.id, 'sender', e.target.value)}
                          className="w-36 px-2 py-0.5 rounded border border-slate-300 text-xs font-bold text-slate-900"
                        />
                        <input
                          type="text"
                          value={msg.text}
                          onChange={(e) => handleUpdateChatMessage(msg.id, 'text', e.target.value)}
                          className="flex-1 px-2 py-0.5 rounded border border-slate-300 text-xs text-slate-800"
                        />
                        <button
                          onClick={() => handleDeleteChatMessage(msg.id)}
                          className="p-1 rounded hover:bg-rose-100 text-rose-600 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Actions Bar */}
        <div className="px-4 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {hasUnsavedChanges ? (
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> You have unsaved changes in the edit portal.
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> All data is synchronized with the live dashboard.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs"
            >
              Cancel & Exit
            </button>
            <button
              onClick={handleSaveAndApply}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
