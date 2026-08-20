import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fieldCoordinates } from '../data/initialData';
import { Vessel } from '../types';
import { Layers, MapPin, Navigation, Maximize2, RefreshCw } from 'lucide-react';

interface OffshoreMapProps {
  vessel: Vessel;
  mapboxToken?: string;
  onSelectPlatform?: (name: string) => void;
  showPipelines?: boolean;
}

export const OffshoreMap: React.FC<OffshoreMapProps> = ({
  vessel,
  mapboxToken,
  onSelectPlatform,
  showPipelines = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const vesselMarkerRef = useRef<L.Marker | null>(null);
  const [activeTileLayer, setActiveTileLayer] = useState<'osm' | 'satellite' | 'dark' | 'mapbox'>('osm');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not already done
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [4.4600, 113.8800],
        zoom: 11,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add selected tile layer
    if (activeTileLayer === 'mapbox' && mapboxToken) {
      L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`,
        { tileSize: 512, zoomOffset: -1, maxZoom: 18, attribution: '© Mapbox' }
      ).addTo(map);
    } else if (activeTileLayer === 'satellite') {
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri' }
      ).addTo(map);
    } else if (activeTileLayer === 'dark') {
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        { attribution: '© CartoDB' }
      ).addTo(map);
    } else {
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap contributors' }
      ).addTo(map);
    }

    // Clear feature markers & lines before re-drawing
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // --- Custom HTML Icons ---
    const createCustomIcon = (
      bgColor: string,
      borderColor: string,
      label: string,
      isPulse = false,
      symbol = '⚓'
    ) => {
      return L.divIcon({
        className: 'custom-map-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            ${isPulse ? `<div style="position: absolute; top: -6px; left: -6px; width: 36px; height: 36px; border-radius: 50%; background: ${bgColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
            <div style="background-color: ${bgColor}; border: 2px solid ${borderColor}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.3); z-index: 2;">
              ${symbol}
            </div>
            <div style="background: rgba(15, 23, 42, 0.9); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; font-family: sans-serif; white-space: nowrap; margin-top: 2px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.4);">
              ${label}
            </div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 14]
      });
    };

    // 1. Shore Base (MOCC)
    const moccIcon = createCustomIcon('#2563eb', '#60a5fa', 'MOCC / Shore Base', false, '🏢');
    L.marker([fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng], { icon: moccIcon })
      .addTo(map)
      .bindPopup('<b>MOCC / Shore Base (Miri)</b><br/>Status: Operational Command Center<br/>Lat: 4.3995 N, Lng: 113.9914 E');

    // 2. SLDP-A Facility (Affected Facility)
    const sldpIcon = createCustomIcon('#dc2626', '#f87171', 'SLDP-A Facility (Affected)', true, '🛢️');
    const sldpMarker = L.marker([fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng], { icon: sldpIcon })
      .addTo(map)
      .bindPopup('<b>SLDP-A Facility (Salbiah Field)</b><br/><span style="color:red; font-weight:bold;">STATUS: LEVEL 2 STABILISING</span><br/>Personnel Onboard: 24/24 Accounted<br/>Source Isolated: YES');

    if (onSelectPlatform) {
      sldpMarker.on('click', () => onSelectPlatform('SLDP-A Facility'));
    }

    // 3. Wellhead Platforms S1, S2, S3 & Subsea Template
    const s1Icon = createCustomIcon('#d97706', '#fbbf24', 'Platform S1 (-6.5 km)', false, '🏗️');
    L.marker([fieldCoordinates.s1.lat, fieldCoordinates.s1.lng], { icon: s1Icon })
      .addTo(map)
      .bindPopup('<b>Wellhead Platform S1</b><br/>Distance to SLDP-A: 6.5 km<br/>Status: Normal');

    const s2Icon = createCustomIcon('#d97706', '#fbbf24', 'Platform S2 (-8.0 km)', false, '🏗️');
    L.marker([fieldCoordinates.s2.lat, fieldCoordinates.s2.lng], { icon: s2Icon })
      .addTo(map)
      .bindPopup('<b>Wellhead Platform S2</b><br/>Distance to SLDP-A: 8.0 km<br/>Status: Normal');

    const s3Icon = createCustomIcon('#d97706', '#fbbf24', 'Platform S3 (-11.5 km)', false, '🏗️');
    L.marker([fieldCoordinates.s3.lat, fieldCoordinates.s3.lng], { icon: s3Icon })
      .addTo(map)
      .bindPopup('<b>Wellhead Platform S3</b><br/>Distance to SLDP-A: 11.5 km<br/>Status: Normal');

    const subseaIcon = createCustomIcon('#0284c7', '#38bdf8', 'Subsea Area (-3.5 km)', false, '⚓');
    L.marker([fieldCoordinates.subsea.lat, fieldCoordinates.subsea.lng], { icon: subseaIcon })
      .addTo(map)
      .bindPopup('<b>Subsea Template Area</b><br/>Distance to SLDP-A: 3.5 km');

    // 4. Vessel Marker FCB-01
    const vesselIcon = createCustomIcon('#16a34a', '#4ade80', `Vessel ${vessel.id}`, true, '🚢');
    vesselMarkerRef.current = L.marker(vessel.coordinates, { icon: vesselIcon })
      .addTo(map)
      .bindPopup(`<b>${vessel.name}</b><br/>Status: ${vessel.status}<br/>Speed: ${vessel.speedKnots} knots<br/>ETA: ${vessel.eta}`);

    // --- Draw Pipelines & Routes ---
    if (showPipelines) {
      // Pipelines (Red solid lines linking platforms)
      const pipelineCoords = [
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng],
        [fieldCoordinates.s1.lat, fieldCoordinates.s1.lng],
        [fieldCoordinates.subsea.lat, fieldCoordinates.subsea.lng],
        [fieldCoordinates.s3.lat, fieldCoordinates.s3.lng],
        [fieldCoordinates.s2.lat, fieldCoordinates.s2.lng],
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
      ];

      L.polyline(pipelineCoords as L.LatLngExpression[], {
        color: '#ef4444',
        weight: 3,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(map);

      // Umbilical / Control Lines (Blue dashed line to shore)
      const umbilicalCoords = [
        [fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng],
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
      ];

      L.polyline(umbilicalCoords as L.LatLngExpression[], {
        color: '#2563eb',
        weight: 2,
        dashArray: '5, 5',
        opacity: 0.9
      }).addTo(map);

      // Vessel Route (Green dashed line)
      const vesselRouteCoords = [
        [fieldCoordinates.moccShoreBase.lat, fieldCoordinates.moccShoreBase.lng],
        vessel.coordinates,
        [fieldCoordinates.sldpA.lat, fieldCoordinates.sldpA.lng]
      ];

      L.polyline(vesselRouteCoords as L.LatLngExpression[], {
        color: '#16a34a',
        weight: 3,
        dashArray: '4, 6',
        opacity: 0.9
      }).addTo(map);
    }

  }, [activeTileLayer, mapboxToken, vessel, showPipelines]);

  // Update vessel position smoothly if coordinates change
  useEffect(() => {
    if (vesselMarkerRef.current) {
      vesselMarkerRef.current.setLatLng(vessel.coordinates);
    }
  }, [vessel.coordinates]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-md transition-all duration-300 ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col bg-white' : 'w-full h-[380px]'}`}>
      {/* Map Control Overlay Header */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 bg-white/85 backdrop-blur-xl px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">
            Salbiah Field Live GIS & Telemetry Map
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tile Layer Selector */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
            <button
              onClick={() => setActiveTileLayer('osm')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${activeTileLayer === 'osm' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              OSM Map
            </button>
            <button
              onClick={() => setActiveTileLayer('satellite')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${activeTileLayer === 'satellite' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveTileLayer('dark')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${activeTileLayer === 'dark' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Dark GIS
            </button>
            {mapboxToken && (
              <button
                onClick={() => setActiveTileLayer('mapbox')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${activeTileLayer === 'mapbox' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Mapbox
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([4.4600, 113.8800], 11);
              }
            }}
            title="Recenter Map"
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 transition-all shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-1" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/85 backdrop-blur-xl px-3 py-2 rounded-xl border border-slate-200/80 text-[10px] text-slate-700 shadow-sm flex flex-wrap gap-3 items-center">
        <span className="font-bold text-slate-500">LEGEND:</span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-rose-300 animate-ping"></span>
          Affected Facility (SLDP-A)
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          Wellhead Platform
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          Vessel (FCB-01)
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-4 h-0.5 bg-rose-500 border-t border-dashed"></span>
          Pipeline / Control Line
        </span>
      </div>
    </div>
  );
};
