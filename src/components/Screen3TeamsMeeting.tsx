import React, { useState } from 'react';
import { Participant, ChatMessage, WeatherData, Vessel } from '../types';
import { Video, Mic, MicOff, Camera, Share2, MessageSquare, Users, ShieldAlert, Maximize2, Minimize2, CheckCircle2, Volume2, Send, X } from 'lucide-react';

interface Screen3Props {
  participants: Participant[];
  chatMessages: ChatMessage[];
  weather: WeatherData;
  vessel: Vessel;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSendChatMessage: (text: string) => void;
}

export const Screen3TeamsMeeting: React.FC<Screen3Props> = ({
  participants,
  chatMessages,
  weather,
  vessel,
  isExpanded,
  onToggleExpand,
  onSendChatMessage
}) => {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMsgText, setNewMsgText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;
    onSendChatMessage(newMsgText.trim());
    setNewMsgText('');
  };

  return (
    <div
      className={`bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 relative ${
        isExpanded ? 'fixed inset-4 z-50 overflow-y-auto bg-white p-4 shadow-2xl ring-1 ring-slate-900/10' : 'w-full h-full'
      }`}
    >
      {/* Panel Screen Header */}
      <div className="bg-slate-50/90 px-3.5 py-2 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-0.5 rounded-lg bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center gap-1 font-bold text-[10px] px-1.5 py-0.5 shrink-0">
            <span className="w-3.5 h-3.5 bg-indigo-600 rounded text-white flex items-center justify-center font-black">T</span>
            <span>TEAMS</span>
          </div>
          <h2 className="text-xs font-bold tracking-tight text-slate-900 uppercase truncate">
            SCREEN 3 – TEAMS MEETING <span className="text-indigo-600 font-medium text-[10px]">(Live Emergency Command)</span>
          </h2>
        </div>
        <button
          onClick={onToggleExpand}
          className="p-1 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition-all shadow-xs shrink-0"
          title={isExpanded ? 'Collapse' : 'Expand Screen 3 to Fullscreen'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="p-3 space-y-3 flex-1 overflow-y-auto bg-slate-50/40 text-slate-800">
        {/* Top Video Tiles Row */}
        <div className="grid grid-cols-3 gap-2">
          {participants.slice(0, 3).map((p) => (
            <div key={p.id} className="bg-white border border-slate-200/80 rounded-xl p-2 text-center shadow-xs relative overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-200 mx-auto flex items-center justify-center text-indigo-700 font-extrabold text-[10px] mb-1 shadow-xs">
                {p.roleShort}
              </div>
              <div className="text-[10px] font-bold text-slate-900 truncate">{p.name}</div>
              <div className="text-[9px] text-indigo-600 font-semibold truncate">{p.department}</div>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          ))}
        </div>

        {/* Main Active Speaker Box */}
        <div className="bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 border border-indigo-200/80 rounded-xl p-3 shadow-xs relative overflow-hidden min-w-0">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-[11px] uppercase truncate">
              <Volume2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">MOCC ON-SCENE COMMANDER</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0">
              Active Speaker
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Speaker Visual Avatar & Audio Waveform */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-300 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  OSC
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border border-white flex items-center justify-center">
                  <Mic className="w-2 h-2 text-white" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">MOCC On-Scene Commander</div>
                <div className="text-[10px] text-indigo-700 font-semibold flex items-center gap-1.5">
                  <span className="truncate">MOCC – Speaking</span>
                  <span className="flex items-end gap-0.5 h-2.5 shrink-0">
                    <span className="w-0.5 h-full bg-emerald-500" />
                    <span className="w-0.5 h-2/3 bg-emerald-500" />
                    <span className="w-0.5 h-4/5 bg-emerald-500" />
                  </span>
                </div>
              </div>
            </div>

            {/* Role Badges Side List */}
            <div className="space-y-0.5 text-[9px] text-right shrink-0">
              <div className="flex items-center justify-end gap-1">
                <span className="font-semibold text-slate-700">ECC Commander</span>
                <span className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-800 flex items-center justify-center font-bold text-[8px]">IC</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="font-semibold text-slate-700">MOCC Ops</span>
                <span className="w-4 h-4 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-800 flex items-center justify-center font-bold text-[8px]">MO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Live Operations Data + Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* Live Operations Data */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-[11px] uppercase border-b border-slate-100 pb-1.5 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">LIVE OPERATIONS DATA</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-800 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Vessel Status:</span>
                <span className="font-bold text-emerald-700">{vessel.id} En route</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Aviation:</span>
                <span className="font-bold text-blue-700">Available</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Sea State:</span>
                <span className="font-bold text-slate-800">{weather.windSpeedKt} kt / {weather.seaStateM} m</span>
              </div>
            </div>
          </div>

          {/* Resources Panel */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-[11px] uppercase border-b border-slate-100 pb-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">DEPLOYED RESOURCES</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-800 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">Medical team – <strong className="text-emerald-700 font-bold">Ready</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">Spill equipment – <strong className="text-amber-700 font-bold">Standby</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="truncate">Technical specialist – <strong className="text-blue-700 font-bold">Active</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Participants & Action/Decision Log */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* Participants */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
              <span className="text-indigo-800 font-bold text-[11px] uppercase flex items-center gap-1.5 truncate">
                <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                KEY PARTICIPANTS
              </span>
              <span className="text-[9px] text-slate-500 font-mono shrink-0">9 Active</span>
            </div>
            <ul className="space-y-0.5 text-[10px] text-slate-700 font-medium list-disc pl-3.5 leading-snug">
              <li>DRSB Senior Management</li>
              <li>MOCC Operations Team</li>
              <li>ECC / Kuala Lumpur Command</li>
              <li>Offshore OIM & OERT</li>
            </ul>
          </div>

          {/* Action / Decision Log */}
          <div className="bg-indigo-50/50 border border-indigo-200/80 rounded-xl p-2.5 shadow-xs">
            <div className="text-indigo-900 font-bold text-[11px] uppercase border-b border-indigo-200/60 pb-1.5 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate">DECISION LOG</span>
            </div>
            <ul className="space-y-1 text-[10px] text-slate-800 font-medium leading-snug">
              <li className="flex items-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shrink-0" />
                <span className="break-words">SLDP-A source isolated cleanly</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1 shrink-0" />
                <span className="break-words">Facility stable & under control</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                <span className="break-words">Authority notification in progress</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Teams Meeting Controls Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-tight truncate">
            MEETING CONTROLS
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs ${
                cameraOn ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              <Camera className="w-3 h-3" />
              <span>Cam {cameraOn ? 'On' : 'Off'}</span>
            </button>

            <button
              onClick={() => setMicOn(!micOn)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs ${
                micOn ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              {micOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              <span>{micOn ? 'Mic On' : 'Muted'}</span>
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs ${
                screenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <Share2 className="w-3 h-3" />
              <span>{screenSharing ? 'Sharing' : 'Share'}</span>
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all shadow-xs ${
                showChat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
              {chatMessages.length > 0 && (
                <span className="bg-indigo-100 text-indigo-900 font-bold px-1 rounded-full text-[9px]">
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-indigo-50/80 border border-indigo-200/80 p-2 rounded-xl text-center text-[10px] shadow-xs">
          <div className="font-bold text-indigo-900 tracking-wide uppercase">
            DRSB EMERGENCY RESPONSE • COORDINATION • SAFETY
          </div>
        </div>
      </div>

      {/* Slide-over Teams Live Chat Sidebar */}
      {showChat && (
        <div className="absolute top-10 right-0 bottom-0 w-72 bg-white/95 backdrop-blur-2xl border-l border-slate-200/80 shadow-2xl z-40 flex flex-col p-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
            <h4 className="text-[11px] font-bold text-indigo-900 uppercase flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              Teams EMT Live Chat
            </h4>
            <button onClick={() => setShowChat(false)} className="text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mb-2 text-[10px]">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="bg-slate-50 border border-slate-200/80 rounded-lg p-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-indigo-700 mb-0.5">
                  <span className="truncate">{msg.sender} ({msg.role})</span>
                  <span className="text-slate-400 font-mono text-[8px] shrink-0">{msg.time}</span>
                </div>
                <p className="text-slate-800 text-[10px] font-medium leading-snug break-words">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-1 border-t border-slate-200 pt-2">
            <input
              type="text"
              placeholder="Type EMT message..."
              value={newMsgText}
              onChange={(e) => setNewMsgText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-lg transition shadow-xs"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

