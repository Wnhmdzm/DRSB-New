import React, { useState } from 'react';
import { X, Key, Wind, Map, CheckCircle2, RefreshCw } from 'lucide-react';
import { fetchOpenWeatherData } from '../services/weatherService';
import { WeatherData } from '../types';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  openWeatherKey: string;
  mapboxToken: string;
  onSaveKeys: (weatherKey: string, mapboxToken: string) => void;
  onWeatherFetched: (data: WeatherData) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  openWeatherKey,
  mapboxToken,
  onSaveKeys,
  onWeatherFetched
}) => {
  const [localWeatherKey, setLocalWeatherKey] = useState(openWeatherKey);
  const [localMapboxToken, setLocalMapboxToken] = useState(mapboxToken);
  const [testingWeather, setTestingWeather] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestOpenWeather = async () => {
    setTestingWeather(true);
    setTestStatus('Connecting to OpenWeatherMap API...');
    try {
      const data = await fetchOpenWeatherData(localWeatherKey);
      if (data.isLiveApi) {
        setTestStatus(`Success! Connected to OpenWeather API. Weather: ${data.conditions}, Wind: ${data.windSpeedKt} kt`);
        onWeatherFetched(data);
      } else {
        setTestStatus('API key invalid or limit reached. Using realistic live fallback simulation.');
      }
    } catch (e) {
      setTestStatus('Connection failed. Using realistic live fallback weather simulation.');
    } finally {
      setTestingWeather(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys(localWeatherKey, localMapboxToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-sky-500/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 px-5 py-3 border-b border-sky-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600/30 border border-sky-400/50 flex items-center justify-center text-sky-300">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                THIRD-PARTY API INTEGRATION
              </h3>
              <p className="text-[11px] text-slate-300">
                OpenWeatherMap & Mapbox GIS Credentials
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          {/* OpenWeatherMap Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sky-300 flex items-center gap-1.5 uppercase">
                <Wind className="w-4 h-4 text-sky-400" />
                OpenWeatherMap API Key:
              </label>
              <button
                type="button"
                onClick={handleTestOpenWeather}
                disabled={testingWeather}
                className="text-[10px] bg-sky-900 hover:bg-sky-800 text-sky-200 px-2 py-1 rounded font-bold border border-sky-700 flex items-center gap-1"
              >
                {testingWeather && <RefreshCw className="w-3 h-3 animate-spin" />}
                Test Live API
              </button>
            </div>
            <input
              type="text"
              placeholder="Paste OpenWeatherMap API Key..."
              value={localWeatherKey}
              onChange={(e) => setLocalWeatherKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
            {testStatus && (
              <div className="text-[11px] text-sky-300 font-medium bg-sky-950/60 p-2 rounded border border-sky-800">
                {testStatus}
              </div>
            )}
          </div>

          {/* Mapbox Token Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
            <label className="font-bold text-sky-300 flex items-center gap-1.5 uppercase">
              <Map className="w-4 h-4 text-sky-400" />
              Mapbox Access Token:
            </label>
            <input
              type="text"
              placeholder="pk.eyJ1I..."
              value={localMapboxToken}
              onChange={(e) => setLocalMapboxToken(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono placeholder-slate-600 focus:outline-none focus:border-sky-500"
            />
            <p className="text-[10px] text-slate-400">
              Optional: OpenStreetMap & Esri Satellite map layers are active out-of-the-box without key requirements.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold py-2.5 rounded-lg shadow-lg transition"
          >
            Save & Update API Feeds
          </button>
        </form>
      </div>
    </div>
  );
};
