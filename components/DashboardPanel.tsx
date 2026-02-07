
import React, { useState, useEffect } from 'react';
import { LocationReport, GeminiInsight, RiskLevel, ThemeMode, Language } from '../types';
import { generateDisasterInsight } from '../services/geminiService';
import { WeatherChart } from './Charts';
import { TRANSLATIONS } from '../constants';
import { 
  Wind, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Bot, 
  Loader2,
  X,
  MapPin,
  Cpu,
  Sparkles,
  FileText,
  ChevronUp
} from 'lucide-react';
import clsx from 'clsx';

interface DashboardPanelProps {
  report: LocationReport | null;
  onClose: () => void;
  loading: boolean;
  theme: ThemeMode;
  language: Language;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ report, onClose, loading, theme, language }) => {
  const [insight, setInsight] = useState<GeminiInsight | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const t = TRANSLATIONS[language];

  useEffect(() => { 
    setInsight(null); 
    if (report) setIsExpanded(false); 
  }, [report]);

  if (!report && !loading) return null;

  const panelBg = theme === 'black' ? "bg-black/95 border-slate-800" : theme === 'blue' ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200";
  const textColor = theme === 'white' ? "text-slate-900" : "text-white";

  return (
    <div className={clsx(
      "fixed z-[100] transition-all duration-500 shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col",
      // Mobile: Bottom Sheet logic
      "inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[450px] border-t md:border-t-0 md:border-l",
      // Visibility
      (report || loading) ? "translate-y-0" : "translate-y-full md:translate-y-0 md:translate-x-full",
      // Expanding Height on Mobile
      isExpanded ? "h-[85dvh]" : "h-[350px] md:h-full",
      panelBg
    )}>
      {/* Mobile Handle / Desktop Header */}
      <div 
        className="flex items-center justify-between p-4 md:p-5 border-b border-white/5 cursor-pointer md:cursor-default"
        onClick={() => { if(window.innerWidth < 768) setIsExpanded(!isExpanded); }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg"><Cpu className="text-cyan-400 w-4 h-4 md:w-5 md:h-5" /></div>
          <h2 className={clsx("font-black text-sm md:text-lg uppercase tracking-tight", textColor)}>{t.sectorAnalysis}</h2>
        </div>
        <div className="flex items-center gap-2">
           <button className="md:hidden p-2 text-slate-400">
             <ChevronUp className={clsx("w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
           </button>
           <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
             <X className="w-5 h-5 text-slate-400" />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 space-y-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
             <Loader2 className="w-10 h-10 animate-spin mb-4 text-cyan-500" />
             <p className="font-mono text-[9px] tracking-widest uppercase">Initializing Telemetry...</p>
          </div>
        ) : report ? (
          <>
            <div className="flex justify-between items-start gap-4">
               <div className="flex-1">
                  <h1 className={clsx("text-xl md:text-2xl font-black tracking-tighter uppercase leading-tight mb-1", textColor)}>
                     {report.location.name}
                  </h1>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                     <MapPin className="w-3 h-3 text-cyan-500" />
                     {report.location.lat.toFixed(3)}°, {report.location.lng.toFixed(3)}°
                  </div>
               </div>
               <div className={clsx(
                 "px-3 py-1 rounded-full border font-black text-[10px] uppercase",
                 report.risk.level === RiskLevel.EMERGENCY ? "bg-red-500/10 border-red-500/30 text-red-500" :
                 report.risk.level === RiskLevel.WATCH ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                 "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
               )}>
                  {report.risk.level}
               </div>
            </div>

            {/* Reflexive Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-3">
               {[
                 { label: t.temp, value: `${report.currentWeather.temp}°`, icon: <Thermometer className="w-4 h-4" /> },
                 { label: t.wind, value: `${report.currentWeather.windSpeed}`, icon: <Wind className="w-4 h-4" /> },
                 { label: t.rain, value: `${report.currentWeather.rainfall}`, icon: <CloudRain className="w-4 h-4" /> },
                 { label: t.humidity, value: `${report.currentWeather.humidity}%`, icon: <Droplets className="w-4 h-4" /> }
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center">
                    <div className="text-cyan-500 mb-1">{item.icon}</div>
                    <div className={clsx("text-sm font-black", textColor)}>{item.value}</div>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">{item.label}</span>
                 </div>
               ))}
            </div>

            {/* Chart Area - Scalable */}
            <div className="h-40 md:h-52 bg-white/5 border border-white/5 rounded-3xl p-2 md:p-4">
               <WeatherChart data={report.timelineData} />
            </div>

            {/* AI Action Area */}
            <div className="space-y-4">
               {!insight ? (
                 <button 
                   onClick={async () => { setAnalyzing(true); const r = await generateDisasterInsight(report); setInsight(r); setAnalyzing(false); setIsExpanded(true); }}
                   disabled={analyzing} 
                   className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Bot className="w-5 h-5" /> Run AI Predictor</>}
                 </button>
               ) : (
                 <div className="bg-cyan-950/20 border border-cyan-500/30 p-5 rounded-3xl animate-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <h3 className="font-black text-[10px] uppercase text-cyan-400 tracking-widest">AI Context Insight</h3>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{insight.analysis}</p>
                    <div className="space-y-2">
                       {insight.recommendations.map((rec, i) => (
                         <div key={i} className="flex gap-3 text-[11px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/5 italic">
                            <span className="text-cyan-500 font-black">#{i+1}</span> {rec}
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DashboardPanel;
