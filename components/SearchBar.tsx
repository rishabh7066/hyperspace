
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { GeoLocation, ThemeMode, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import clsx from 'clsx';

interface SearchBarProps {
  onLocationSelect: (loc: GeoLocation) => void;
  theme: ThemeMode;
  language: Language;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onLocationSelect, theme, language, onFocus, onBlur }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`);
        const data = await res.json();
        if (data.results) setResults(data.results.filter((r: any) => r.country_code === 'IN'));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (r: any) => {
    onLocationSelect({ lat: r.latitude, lng: r.longitude, name: `${r.name}, ${r.admin1 || r.country}` });
    setQuery(r.name);
    setShowDropdown(false);
    if (onBlur) onBlur();
  };

  const inputBg = theme === 'white' ? "bg-slate-100 border-slate-200 text-slate-900" : "bg-slate-800/50 border-slate-700 text-slate-100";

  return (
    <div ref={wrapperRef} className="relative w-full">
       <div className="relative group">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
         <input 
           type="text" value={query} onChange={(e) => setQuery(e.target.value)} 
           onFocus={() => { setShowDropdown(true); if(onFocus) onFocus(); }}
           onBlur={() => { if(query === '' && onBlur) onBlur(); }}
           placeholder={t.searchPlaceholder}
           className={clsx("block w-full pl-9 pr-8 py-2 border rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all", inputBg)}
         />
         {query.length > 0 && (
           <button onClick={() => { setQuery(''); if(onBlur) onBlur(); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500">
             <X className="h-3 w-3" />
           </button>
         )}
       </div>

       {showDropdown && results.length > 0 && (
         <div className={clsx(
           "absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto backdrop-blur-xl border rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-top-2",
           theme === 'white' ? "bg-white border-slate-200" : "bg-slate-900 border-slate-700"
         )}>
            {results.map((res) => (
              <button key={res.id} onClick={() => handleSelect(res)} className="w-full text-left px-4 py-3 hover:bg-cyan-500/10 flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors">
                <MapPin className="w-4 h-4 text-slate-500" />
                <div className="flex-1 overflow-hidden">
                   <div className="text-xs font-bold truncate">{res.name}</div>
                   <div className="text-[10px] text-slate-500 truncate">{res.admin1 || res.country}</div>
                </div>
              </button>
            ))}
         </div>
       )}
    </div>
  );
};
