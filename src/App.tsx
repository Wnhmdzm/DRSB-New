import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header, CloudSyncStatus } from './components/Header';
import { Screen1IncidentDashboard } from './components/Screen1IncidentDashboard';
import { Screen2OperationalCoordination } from './components/Screen2OperationalCoordination';
import { Screen3TeamsMeeting } from './components/Screen3TeamsMeeting';
import { EditPortalModal, EditPortalData } from './components/EditPortalModal';
import { FirebaseDiagnosticsModal } from './components/FirebaseDiagnosticsModal';
import { ShieldAlert, ExternalLink, RefreshCw, X } from 'lucide-react';
import {
  initialIncident,
  initialTimeline,
  initialActionItems,
  initialVessels,
  initialHelicopter,
  initialWeather,
  initialParticipants,
  initialChatMessages,
  initialUsers,
  fieldCoordinates
} from './data/initialData';
import {
  IncidentDetails,
  TimelineEvent,
  ActionItem,
  Vessel,
  Helicopter,
  WeatherData,
  Participant,
  ChatMessage,
  User
} from './types';
import {
  subscribeToDashboardState,
  saveDashboardState,
  resetDashboardStateInFirestore,
  testFirestoreConnection,
  fetchLiveDashboardState,
  EMTDashboardFirestoreState,
  DEFAULT_EMT_STATE,
  FirestoreErrorInfo
} from './firebase';

// Local storage fallback helpers
const getSavedState = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`drsb_emt_${key}`);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
  }
  return fallback;
};

const saveState = <T,>(key: string, data: T) => {
  try {
    localStorage.setItem(`drsb_emt_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
};

export default function App() {
  // --- Global Application State with Local & Firebase Persistence ---
  const [incident, setIncident] = useState<IncidentDetails>(() =>
    getSavedState<IncidentDetails>('incident', initialIncident)
  );
  const [timeline, setTimeline] = useState<TimelineEvent[]>(() =>
    getSavedState<TimelineEvent[]>('timeline', initialTimeline)
  );
  const [actions, setActions] = useState<ActionItem[]>(() =>
    getSavedState<ActionItem[]>('actions', initialActionItems)
  );
  const [vessels, setVessels] = useState<Vessel[]>(() =>
    getSavedState<Vessel[]>('vessels', initialVessels)
  );
  const [helicopter, setHelicopter] = useState<Helicopter>(() =>
    getSavedState<Helicopter>('helicopter', initialHelicopter)
  );
  const [weather, setWeather] = useState<WeatherData>(() =>
    getSavedState<WeatherData>('weather', initialWeather)
  );
  const [participants, setParticipants] = useState<Participant[]>(() =>
    getSavedState<Participant[]>('participants', initialParticipants)
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    getSavedState<ChatMessage[]>('chatMessages', initialChatMessages)
  );
  const [currentUser] = useState<User>(initialUsers[0]);

  // --- Cloud Sync Status & Diagnostics State ---
  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>({
    isConnected: true,
    isSyncing: false,
    isPermissionError: false,
    lastUpdated: 'Connecting...'
  });
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [dismissWarningBanner, setDismissWarningBanner] = useState<boolean>(false);
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

  // --- Modal & Layout State ---
  const [isEditPortalOpen, setIsEditPortalOpen] = useState<boolean>(false);
  const [expandedScreen, setExpandedScreen] = useState<number | null>(null);

  // Ref to hold the latest state for cloud sync operations without stale closures
  const stateRef = useRef<EMTDashboardFirestoreState>({
    incident,
    timeline,
    actions,
    vessels,
    helicopter,
    weather,
    participants,
    chatMessages
  });

  useEffect(() => {
    stateRef.current = {
      incident,
      timeline,
      actions,
      vessels,
      helicopter,
      weather,
      participants,
      chatMessages
    };
  }, [incident, timeline, actions, vessels, helicopter, weather, participants, chatMessages]);

  // Function to re-test connection
  const checkCloudConnectivity = useCallback(async () => {
    const res = await testFirestoreConnection();
    setCloudSyncStatus((prev) => ({
      ...prev,
      isConnected: res.ok,
      isPermissionError: res.isPermissionError || false,
      errorMessage: res.message
    }));
    if (!res.ok) {
      setLastSyncError(res.message);
    }
  }, []);

  // --- 1. Real-Time Firebase Firestore Subscription ---
  useEffect(() => {
    // Test initial connection
    checkCloudConnectivity();

    // Subscribe to live Firestore state changes
    const unsubscribe = subscribeToDashboardState(
      (remoteState) => {
        if (remoteState) {
          if (remoteState.incident) {
            setIncident(remoteState.incident);
            saveState('incident', remoteState.incident);
          }
          if (remoteState.timeline) {
            setTimeline(remoteState.timeline);
            saveState('timeline', remoteState.timeline);
          }
          if (remoteState.actions) {
            setActions(remoteState.actions);
            saveState('actions', remoteState.actions);
          }
          if (remoteState.vessels && remoteState.vessels.length > 0) {
            setVessels(remoteState.vessels);
            saveState('vessels', remoteState.vessels);
          }
          if (remoteState.helicopter) {
            setHelicopter(remoteState.helicopter);
            saveState('helicopter', remoteState.helicopter);
          }
          if (remoteState.weather) {
            setWeather(remoteState.weather);
            saveState('weather', remoteState.weather);
          }
          if (remoteState.participants && remoteState.participants.length > 0) {
            setParticipants(remoteState.participants);
            saveState('participants', remoteState.participants);
          }
          if (remoteState.chatMessages) {
            setChatMessages(remoteState.chatMessages);
            saveState('chatMessages', remoteState.chatMessages);
          }

          setCloudSyncStatus({
            isConnected: true,
            isSyncing: false,
            isPermissionError: false,
            lastUpdated: remoteState.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          setLastSyncError(null);
        }
      },
      (error: FirestoreErrorInfo) => {
        const isPerm = error.code === 'permission-denied' || error.error.toLowerCase().includes('permission');
        setCloudSyncStatus((prev) => ({
          ...prev,
          isConnected: false,
          isSyncing: false,
          isPermissionError: isPerm,
          errorMessage: error.error
        }));
        setLastSyncError(error.error);
      }
    );

    return () => unsubscribe();
  }, [checkCloudConnectivity]);

  // --- 2. Real-Time Vessel Movement & Weather Telemetry Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Move Vessel FCB-01 smoothly on map
      setVessels((prev) =>
        prev.map((v) => {
          if (v.id === 'FCB-01') {
            const startLat = fieldCoordinates.moccShoreBase.lat;
            const startLng = fieldCoordinates.moccShoreBase.lng;
            const targetLat = fieldCoordinates.sldpA.lat;
            const targetLng = fieldCoordinates.sldpA.lng;

            // Interpolate coordinate step
            let nextLat = v.coordinates[0] + (targetLat - startLat) * 0.015;
            let nextLng = v.coordinates[1] + (targetLng - startLng) * 0.015;

            // Loop position if near target
            if (Math.abs(nextLat - targetLat) < 0.005) {
              nextLat = startLat;
              nextLng = startLng;
            }

            return {
              ...v,
              coordinates: [nextLat, nextLng]
            };
          }
          return v;
        })
      );

      // Fluctuate weather parameters slightly
      setWeather((prev) => {
        const deltaWind = (Math.random() - 0.5) * 0.8;
        const newWind = Number(Math.max(10, Math.min(22, prev.windSpeedKt + deltaWind)).toFixed(1));
        const newSea = Number((0.8 + newWind * 0.033).toFixed(1));
        return {
          ...prev,
          windSpeedKt: Math.round(newWind),
          seaStateM: newSea,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // --- 3. Handlers for Actions, Chat & Edit Portal (with Real-Time Cloud Save) ---

  const handleUpdateActionStatus = useCallback(
    async (id: number, status: 'Completed' | 'In Progress' | 'Pending') => {
      const updatedActions = stateRef.current.actions.map((a) =>
        a.id === id ? { ...a, status } : a
      );
      setActions(updatedActions);
      saveState('actions', updatedActions);

      // Push update to Firebase Firestore
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      try {
        await saveDashboardState(
          {
            ...stateRef.current,
            actions: updatedActions
          },
          `${currentUser.name} (Action status change)`
        );
        setCloudSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          isConnected: true,
          isPermissionError: false,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
      } catch (e: any) {
        console.error('Error saving action status to Firestore:', e);
        const isPerm = e?.code === 'permission-denied' || String(e?.error || e).includes('permission');
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, isPermissionError: isPerm }));
        setLastSyncError(e?.error || String(e));
      }
    },
    [currentUser.name]
  );

  const handleSendChatMessage = useCallback(
    async (text: string) => {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: currentUser.name,
        role: currentUser.role.split(' ')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text
      };
      const updatedMessages = [...stateRef.current.chatMessages, newMsg];
      setChatMessages(updatedMessages);
      saveState('chatMessages', updatedMessages);

      // Push update to Firebase Firestore
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      try {
        await saveDashboardState(
          {
            ...stateRef.current,
            chatMessages: updatedMessages
          },
          `${currentUser.name} (Chat message)`
        );
        setCloudSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          isConnected: true,
          isPermissionError: false,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
      } catch (e: any) {
        console.error('Error saving chat message to Firestore:', e);
        const isPerm = e?.code === 'permission-denied' || String(e?.error || e).includes('permission');
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false, isPermissionError: isPerm }));
        setLastSyncError(e?.error || String(e));
      }
    },
    [currentUser.name, currentUser.role]
  );

  const handleRefreshFromCloud = useCallback(async () => {
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      const data = await fetchLiveDashboardState();
      if (data) {
        if (data.incident) {
          setIncident(data.incident);
          saveState('incident', data.incident);
        }
        if (data.timeline) {
          setTimeline(data.timeline);
          saveState('timeline', data.timeline);
        }
        if (data.actions) {
          setActions(data.actions);
          saveState('actions', data.actions);
        }
        if (data.vessels && data.vessels.length > 0) {
          setVessels(data.vessels);
          saveState('vessels', data.vessels);
        }
        if (data.helicopter) {
          setHelicopter(data.helicopter);
          saveState('helicopter', data.helicopter);
        }
        if (data.weather) {
          setWeather(data.weather);
          saveState('weather', data.weather);
        }
        if (data.participants && data.participants.length > 0) {
          setParticipants(data.participants);
          saveState('participants', data.participants);
        }
        if (data.chatMessages) {
          setChatMessages(data.chatMessages);
          saveState('chatMessages', data.chatMessages);
        }
        setCloudSyncStatus({
          isConnected: true,
          isSyncing: false,
          isPermissionError: false,
          lastUpdated: data.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setLastSyncError(null);
      } else {
        await checkCloudConnectivity();
      }
    } catch (e: any) {
      console.error('Error fetching live dashboard state:', e);
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      setLastSyncError(e?.message || String(e));
    }
  }, [checkCloudConnectivity]);

  const handleSavePortalData = useCallback(
    async (updated: EditPortalData) => {
      // 1. Immediately apply to local React state for instantaneous UI response
      setIncident(updated.incident);
      setTimeline(updated.timeline);
      setActions(updated.actions);
      setVessels(updated.vessels);
      setHelicopter(updated.helicopter);
      setWeather(updated.weather);
      setParticipants(updated.participants);
      setChatMessages(updated.chatMessages);

      // 2. Persist to localStorage cache
      saveState('incident', updated.incident);
      saveState('timeline', updated.timeline);
      saveState('actions', updated.actions);
      saveState('vessels', updated.vessels);
      saveState('helicopter', updated.helicopter);
      saveState('weather', updated.weather);
      saveState('participants', updated.participants);
      saveState('chatMessages', updated.chatMessages);

      // 3. Persist to Firebase Firestore database to broadcast to all connected dashboards
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
      try {
        await saveDashboardState(
          {
            incident: updated.incident,
            timeline: updated.timeline,
            actions: updated.actions,
            vessels: updated.vessels,
            helicopter: updated.helicopter,
            weather: updated.weather,
            participants: updated.participants,
            chatMessages: updated.chatMessages
          },
          currentUser.name
        );
        setCloudSyncStatus({
          isConnected: true,
          isSyncing: false,
          isPermissionError: false,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
        setLastSyncError(null);
      } catch (err: any) {
        console.error('Failed to save to Firebase Firestore:', err);
        const isPerm = err?.code === 'permission-denied' || String(err?.error || err).includes('permission');
        setCloudSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          isConnected: false,
          isPermissionError: isPerm
        }));
        setLastSyncError(err?.error || String(err));
        throw err;
      }
    },
    [currentUser.name]
  );

  const handleResetToDefaults = useCallback(async () => {
    setIncident(initialIncident);
    setTimeline(initialTimeline);
    setActions(initialActionItems);
    setVessels(initialVessels);
    setHelicopter(initialHelicopter);
    setWeather(initialWeather);
    setParticipants(initialParticipants);
    setChatMessages(initialChatMessages);

    localStorage.removeItem('drsb_emt_incident');
    localStorage.removeItem('drsb_emt_timeline');
    localStorage.removeItem('drsb_emt_actions');
    localStorage.removeItem('drsb_emt_vessels');
    localStorage.removeItem('drsb_emt_helicopter');
    localStorage.removeItem('drsb_emt_weather');
    localStorage.removeItem('drsb_emt_participants');
    localStorage.removeItem('drsb_emt_chatMessages');

    // Reset in Firestore
    setCloudSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      await resetDashboardStateInFirestore();
      setCloudSyncStatus({
        isConnected: true,
        isSyncing: false,
        isPermissionError: false,
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      setLastSyncError(null);
    } catch (e: any) {
      console.error('Error resetting Firestore state:', e);
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      setLastSyncError(e?.error || String(e));
    }
  }, []);

  const handleToggleGlobalFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Header Navigation with Cloud Sync Status */}
      <Header
        incident={incident}
        cloudSyncStatus={cloudSyncStatus}
        onToggleGlobalFullscreen={handleToggleGlobalFullscreen}
        onOpenEditPortal={() => setIsEditPortalOpen(true)}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onRefreshSync={handleRefreshFromCloud}
      />

      {/* Top Sync Warning Banner (Visible if Firestore Rules block access) */}
      {cloudSyncStatus.isPermissionError && !dismissWarningBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white px-4 py-2 text-xs shadow-md flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="font-bold shrink-0">Multi-Device Cloud Sync Blocked:</span>
            <span className="text-amber-100 truncate">
              Firebase Security Rules are rejecting writes on project <code className="bg-black/20 px-1.5 py-0.5 rounded font-mono font-bold">drsb-emt</code>. Changes won't reflect on other laptops until rules are published.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDiagnosticsOpen(true)}
              className="px-2.5 py-1 rounded bg-white text-slate-900 font-bold hover:bg-slate-100 transition-colors shadow-xs cursor-pointer text-[11px]"
            >
              View 2-Minute Fix Guide
            </button>
            <button
              onClick={() => setDismissWarningBanner(true)}
              className="p-1 hover:bg-white/20 rounded transition-colors text-white/80 hover:text-white cursor-pointer"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid Area */}
      <main className="flex-1 p-2 md:p-3 max-w-[1720px] w-full mx-auto">
        {/* 3 Main Panel Screens Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 items-stretch min-h-[calc(100vh-65px)]">
          {/* SCREEN 1: INCIDENT DASHBOARD */}
          <div className={expandedScreen === 1 ? 'col-span-1 lg:col-span-3' : 'col-span-1'}>
            <Screen1IncidentDashboard
              incident={incident}
              timeline={timeline}
              weather={weather}
              vessel={vessels[0] || initialVessels[0]}
              isExpanded={expandedScreen === 1}
              onToggleExpand={() => setExpandedScreen(expandedScreen === 1 ? null : 1)}
            />
          </div>

          {/* SCREEN 2: OPERATIONAL COORDINATION */}
          <div className={expandedScreen === 2 ? 'col-span-1 lg:col-span-3' : 'col-span-1'}>
            <Screen2OperationalCoordination
              vessel={vessels[0] || initialVessels[0]}
              helicopter={helicopter}
              actions={actions}
              weather={weather}
              isExpanded={expandedScreen === 2}
              onToggleExpand={() => setExpandedScreen(expandedScreen === 2 ? null : 2)}
              onUpdateActionStatus={handleUpdateActionStatus}
            />
          </div>

          {/* SCREEN 3: MICROSOFT TEAMS MEETING */}
          <div className={expandedScreen === 3 ? 'col-span-1 lg:col-span-3' : 'col-span-1'}>
            <Screen3TeamsMeeting
              participants={participants}
              chatMessages={chatMessages}
              weather={weather}
              vessel={vessels[0] || initialVessels[0]}
              isExpanded={expandedScreen === 3}
              onToggleExpand={() => setExpandedScreen(expandedScreen === 3 ? null : 3)}
              onSendChatMessage={handleSendChatMessage}
            />
          </div>
        </div>
      </main>

      {/* Full-Featured Data & Information Edit Portal */}
      <EditPortalModal
        isOpen={isEditPortalOpen}
        onClose={() => setIsEditPortalOpen(false)}
        data={{
          incident,
          timeline,
          actions,
          vessels,
          helicopter,
          weather,
          participants,
          chatMessages
        }}
        onSave={handleSavePortalData}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Firebase Cloud Sync Diagnostics Modal */}
      <FirebaseDiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        lastError={lastSyncError}
        onRefreshSync={handleRefreshFromCloud}
      />
    </div>
  );
}
