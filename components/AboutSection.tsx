
import React from 'react';
import { 
  Info, 
  Target, 
  Cpu, 
  Rocket, 
  Users, 
  Github, 
  Linkedin, 
  Mail, 
  Globe,
  Zap,
  ShieldCheck,
  BarChart3,
  Map as MapIcon
} from 'lucide-react';
import { ThemeMode } from '../types';
import clsx from 'clsx';

interface AboutSectionProps {
  theme: ThemeMode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme }) => {
  const isWhite = theme === 'white';
  
  const highlights = [
    { icon: <Zap className="w-5 h-5" />, text: "Real-time sector risk analysis from live weather data" },
    { icon: <MapIcon className="w-5 h-5" />, text: "Interactive satellite map with location monitoring" },
    { icon: <ShieldCheck className="w-5 h-5" />, text: "Smart risk scoring using environmental indicators" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Live display of temperature, wind, rain, and humidity" },
    { icon: <Target className="w-5 h-5" />, text: "Focused on preventive awareness and rapid response" },
  ];

  const sectionBg = isWhite ? "bg-slate-50 border-slate-200" : "bg-slate-900 border-slate-800";
  const cardBg = isWhite ? "bg-white shadow-sm border-slate-100" : "bg-black/40 border-white/5";
  const textColor = isWhite ? "text-slate-900" : "text-white";
  const mutedColor = isWhite ? "text-slate-600" : "text-slate-400";

  return (
    <section className={clsx("py-20 px-6 border-t", sectionBg)}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  <Info className="w-6 h-6 text-cyan-500" />
                </div>
                <h2 className={clsx("text-3xl font-black uppercase tracking-tight", textColor)}>
                  About Predictive <span className="text-cyan-500">Sky-X</span>
                </h2>
              </div>
              <p className={clsx("text-lg leading-relaxed", mutedColor)}>
                Predictive Sky-X is an intelligent disaster response grid that uses real-time 
                environmental data to identify potential risk zones and support faster, 
                data-driven decisions for authorities and citizens.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className={clsx("text-xs font-black uppercase tracking-[0.2em] text-cyan-500", isWhite ? "" : "opacity-80")}>
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((h, i) => (
                  <div key={i} className={clsx("p-4 rounded-2xl flex items-start gap-3 transition-transform hover:scale-[1.02]", cardBg)}>
                    <div className="mt-0.5 text-cyan-500">{h.icon}</div>
                    <span className={clsx("text-sm font-medium", textColor)}>{h.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className={clsx("p-8 rounded-[2.5rem] border space-y-6", cardBg)}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <h4 className={clsx("text-xs font-black uppercase tracking-widest", textColor)}>Technology Stack</h4>
                </div>
                <p className={clsx("text-sm font-mono flex flex-wrap gap-x-2 gap-y-1", mutedColor)}>
                  <span>React</span> • <span>Node.js</span> • <span>Supabase</span> • <span>Weather APIs</span> • <span>Mapbox</span> • <span>Tailwind CSS</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-cyan-500" />
                  <h4 className={clsx("text-xs font-black uppercase tracking-widest", textColor)}>Mission</h4>
                </div>
                <p className={clsx("text-sm leading-relaxed", mutedColor)}>
                  Make disaster awareness proactive, accessible, and data-driven.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Rocket className="w-4 h-4 text-cyan-500" />
                  <h4 className={clsx("text-xs font-black uppercase tracking-widest", textColor)}>Built For</h4>
                </div>
                <p className={clsx("text-sm leading-relaxed", mutedColor)}>
                  Hackathon project for national disaster preparedness using predictive intelligence.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-cyan-500" />
                  <h4 className={clsx("text-xs font-black uppercase tracking-widest", textColor)}>Team</h4>
                </div>
                <p className={clsx("text-sm font-bold", textColor)}>Team Predictive Coders</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <h4 className={clsx("text-xs font-black uppercase tracking-widest", textColor)}>Contact</h4>
                </div>
                <div className="flex gap-4">
                  <a href="#" className="p-2 bg-slate-500/10 rounded-lg hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all" title="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-500/10 rounded-lg hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all" title="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 bg-slate-500/10 rounded-lg hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all" title="Email">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className={clsx("text-xs font-mono uppercase tracking-[0.3em]", mutedColor)}>
            © 2026 Predictive Sky-X — National Disaster Response Grid
          </p>
        </div>
      </div>
    </section>
  );
};
