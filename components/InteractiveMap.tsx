
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap, ZoomControl, Circle } from 'react-leaflet';
import { INDIA_CENTER, DEFAULT_ZOOM, HOTSPOTS } from '../constants';
import { GeoLocation, LocationReport, RiskLevel, ThemeMode } from '../types';
import { fetchRealWeather } from '../services/weatherService';
import { Locate, Loader2, Layers, Check } from 'lucide-react';
import L from 'leaflet';
import clsx from 'clsx';

// Interface definition for InteractiveMap component props
interface InteractiveMapProps {
  onLocationSelect: (loc: GeoLocation) => void;
  selectedLocation: GeoLocation | null;
  theme: ThemeMode;
}

const SATELLITE_BANDS = [
  { id: 'vis', name: 'Optical', filter: 'none' },
  { id: 'ir', name: 'Thermal', filter: 'invert(1) hue-rotate(180deg) saturate(1.2)' },
  { id: 'wv', name: 'Moisture', filter: 'grayscale(100%) sepia(50%)' },
];

const MapEvents = ({ onSelect }: { onSelect: (loc: GeoLocation) => void }) => {
  useMapEvents({ async click(e) { onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }); } });
  return null;
};

const MapUpdater = ({ center }: { center: GeoLocation | null }) => {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo([center.lat, center.lng], map.getZoom() < 10 ? 10 : map.getZoom()); }, [center, map]);
  return null;
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLocationSelect, selectedLocation, theme }) => {
  const [activeBand, setActiveBand] = useState('vis');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { onLocationSelect({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false)
    );
  };

  const currentBand = SATELLITE_BANDS.find(b => b.id === activeBand) || SATELLITE_BANDS[0];

  return (
    <div className="h-full w-full relative z-0">
      <style>{`.leaflet-tile-container img { filter: ${currentBand.filter} !important; transition: filter 0.5s; }`}</style>
      <MapContainer center={[INDIA_CENTER.lat, INDIA_CENTER.lng]} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <MapEvents onSelect={onLocationSelect} />
        <MapUpdater center={selectedLocation} />
      </MapContainer>
      
      {/* Mobile-Friendly Bottom Controls */}
      <div className="absolute bottom-6 right-3 md:top-6 md:right-6 md:bottom-auto z-[1000] flex flex-col items-end gap-3">
        <div className="relative">
          <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className={clsx(
               "p-3 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all active:scale-95",
               theme === 'white' ? "bg-white border-slate-200 text-slate-700" : "bg-slate-900/90 border-slate-700 text-cyan-400"
             )}
          >
             <Layers className="w-5 h-5" />
          </button>
          {isMenuOpen && (
            <div className={clsx(
              "absolute bottom-full right-0 mb-3 md:top-full md:bottom-auto md:mt-3 w-40 rounded-xl border p-2 animate-in fade-in slide-in-from-bottom-2",
              theme === 'white' ? "bg-white border-slate-200" : "bg-slate-950 border-slate-800"
            )}>
              {SATELLITE_BANDS.map(b => (
                <button key={b.id} onClick={() => { setActiveBand(b.id); setIsMenuOpen(false); }} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white/5">
                  {b.name}
                  {activeBand === b.id && <Check className="w-3 h-3 text-cyan-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={handleLocateMe} className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-cyan-400 backdrop-blur-md shadow-2xl active:scale-95">
           {locating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Locate className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default InteractiveMap;
