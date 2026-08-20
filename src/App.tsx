import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Screen1IncidentDashboard } from './components/Screen1IncidentDashboard';
import { Screen2OperationalCoordination } from './components/Screen2OperationalCoordination';
import { Screen3TeamsMeeting } from './components/Screen3TeamsMeeting';
import { EditPortalModal, EditPortalData } from './components/EditPortalModal';
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
  EMTDashboardFirestoreState,
  DEFAULT_EMT_STATE
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

  // --- Cloud Sync Status ---
  const [cloudSyncStatus, setCloudSyncStatus] = useState<{
    isConnected: boolean;
    isSyncing: boolean;
    lastUpdated?: string;
  }>({
    isConnected: true,
    isSyncing: false,
    lastUpdated: 'Connecting...'
  });

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

  // --- 1. Real-Time Firebase Firestore Subscription ---
  useEffect(() => {
    // Test initial connection
    testFirestoreConnection().then((connected) => {
      setCloudSyncStatus((prev) => ({
        ...prev,
        isConnected: connected
      }));
    });

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
            lastUpdated: remoteState.lastUpdated || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      },
      (error) => {
        console.warn('Firebase sync warning:', error);
        setCloudSyncStatus((prev) => ({
          ...prev,
          isConnected: false,
          isSyncing: false
        }));
      }
    );

    return () => unsubscribe();
  }, []);

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
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
      } catch (e) {
        console.error('Error saving action status to Firestore:', e);
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
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
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));
      } catch (e) {
        console.error('Error saving chat message to Firestore:', e);
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
      }
    },
    [currentUser.name, currentUser.role]
  );

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
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      } catch (err) {
        console.error('Failed to save to Firebase Firestore:', err);
        setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
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
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
    } catch (e) {
      console.error('Error resetting Firestore state:', e);
      setCloudSyncStatus((prev) => ({ ...prev, isSyncing: false }));
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
      />

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
    </div>
  );
}
