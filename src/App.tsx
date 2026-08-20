import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Screen1IncidentDashboard } from './components/Screen1IncidentDashboard';
import { Screen2OperationalCoordination } from './components/Screen2OperationalCoordination';
import { Screen3TeamsMeeting } from './components/Screen3TeamsMeeting';
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

export default function App() {
  // --- Global Application State ---
  const [incident] = useState<IncidentDetails>(initialIncident);
  const [timeline] = useState<TimelineEvent[]>(initialTimeline);
  const [actions, setActions] = useState<ActionItem[]>(initialActionItems);
  const [vessels, setVessels] = useState<Vessel[]>(initialVessels);
  const [helicopter] = useState<Helicopter>(initialHelicopter);
  const [weather, setWeather] = useState<WeatherData>(initialWeather);
  const [participants] = useState<Participant[]>(initialParticipants);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [currentUser] = useState<User>(initialUsers[0]);

  // --- Layout State ---
  const [expandedScreen, setExpandedScreen] = useState<number | null>(null);

  // --- Real-Time Telemetry Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Move Vessel FCB-01 along GPS route
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

      // 2. Fluctuate weather parameters
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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleUpdateActionStatus = (id: number, status: 'Completed' | 'In Progress' | 'Pending') => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleSendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      role: currentUser.role.split(' ')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

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
      {/* Top Header Navigation */}
      <Header
        onToggleGlobalFullscreen={handleToggleGlobalFullscreen}
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
              vessel={vessels[0]}
              isExpanded={expandedScreen === 1}
              onToggleExpand={() => setExpandedScreen(expandedScreen === 1 ? null : 1)}
            />
          </div>

          {/* SCREEN 2: OPERATIONAL COORDINATION */}
          <div className={expandedScreen === 2 ? 'col-span-1 lg:col-span-3' : 'col-span-1'}>
            <Screen2OperationalCoordination
              vessel={vessels[0]}
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
              vessel={vessels[0]}
              isExpanded={expandedScreen === 3}
              onToggleExpand={() => setExpandedScreen(expandedScreen === 3 ? null : 3)}
              onSendChatMessage={handleSendChatMessage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

