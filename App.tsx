
import React, { useState, useCallback, useEffect } from 'react';
import InteractiveMap from './components/InteractiveMap';
import DashboardPanel from './components/DashboardPanel';
import { SearchBar } from './components/SearchBar';
import { AuthModal } from './components/AuthModal';
import { AdminModal } from './components/AdminModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { SafetyModal } from './components/SafetyModal';
import { ChatWidget } from './components/ChatWidget';
import { AboutSection } from './components/AboutSection';
import { GeoLocation, LocationReport, User, ThemeMode, Language } from './types';
import { fetchRealWeather } from './services/weatherService';
import { getActiveSession, logout, subscribeToAuthChanges } from './services/authService';
import { TRANSLATIONS } from './constants';
import { CloudLightning, LogIn, LogOut, ChevronDown, Database, User as UserIcon, Settings as SettingsIcon, Activity, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const App: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<LocationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<GeoLocation | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('blue');
  const [language, setLanguage] = useState<Language>('en');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Auth & UI States
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(prev => {
        if (prev?.id === u?.id) return prev;
        return u;
      });
    });

    const initAuth = async () => {
      try {
        const sessionUser = await getActiveSession();
        if (sessionUser) {
           setUser(prev => prev?.id === sessionUser.id ? prev : sessionUser);
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    };
    initAuth();
    return () => { unsubscribe(); };
  }, []);

  const handleLocationSelect = useCallback(async (loc: GeoLocation) => {
    setSelectedLoc(loc);
    setLoading(true);
    setSelectedReport(null);
    const report = await fetchRealWeather(loc.lat, loc.lng, loc.name);
    setTimeout(() => {
        setSelectedReport(report);
        setLoading(false);
    }, 600);
  }, []);

  const closeDashboard = () => {
    setSelectedReport(null);
    setLoading(false);
    setSelectedLoc(null);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <div className={clsx(
      "min-h-[100dvh] w-screen flex flex-col overflow-x-hidden transition-colors duration-500",
      theme === 'black' ? "bg-black text-white" :
      theme === 'blue' ? "bg-slate-950 text-white" :
      "bg-slate-50 text-slate-900"
    )}>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={setUser} />
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        user={user} 
        onUserUpdate={setUser}
        theme={theme} 
        language={language} 
      />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        theme={theme} 
        setTheme={setTheme} 
        language={language} 
        setLanguage={setLanguage} 
        onOpenSafety={() => setIsSafetyOpen(true)}
      />
      <SafetyModal isOpen={isSafetyOpen} onClose={() => setIsSafetyOpen(false)} theme={theme} language={language} />

      <header className={clsx(
        "h-14 md:h-16 flex items-center justify-between px-3 md:px-6 backdrop-blur-md border-b z-[60] sticky top-0 w-full shadow-lg transition-all duration-300",
        theme === 'black' ? "bg-black/90 border-slate-800" :
        theme === 'blue' ? "bg-slate-900/90 border-slate-800" :
        "bg-white/90 border-slate-200"
      )}>
        {/* Logo Section - Hides on small mobile when search is focused */}
        <div className={clsx(
          "flex items-center gap-2 md:gap-3 shrink-0 transition-all duration-300",
          isSearchFocused ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}>
          <div className={clsx("p-1.5 md:p-2 rounded-lg border", theme === 'white' ? "bg-cyan-50 border-cyan-100" : "bg-cyan-500/10 border-cyan-500/20")}>
            <CloudLightning className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
          </div>
          <div className="flex flex-col">
            <h1 className="font-black text-xs md:text-xl tracking-tighter uppercase leading-none">
              SKY<span className="text-cyan-500">-X</span>
            </h1>
          </div>
        </div>

        {/* Dynamic Search Bar */}
        <div className={clsx(
          "flex-1 transition-all duration-300 mx-2 md:mx-6",
          isSearchFocused ? "max-w-full" : "max-w-[140px] sm:max-w-md"
        )}>
           <SearchBar 
             onLocationSelect={handleLocationSelect} 
             theme={theme} 
             language={language} 
             onFocus={() => setIsSearchFocused(true)}
             onBlur={() => setIsSearchFocused(false)}
           />
        </div>
        
        {/* User Controls */}
        <div className={clsx(
          "flex items-center gap-2 md:gap-4 shrink-0 transition-all duration-300",
          isSearchFocused && window.innerWidth < 640 ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
        )}>
           <button 
             onClick={() => setIsSafetyOpen(true)}
             className={clsx(
               "p-2 rounded-lg border transition-all md:px-3 md:py-1.5 md:flex md:items-center md:gap-2",
               theme === 'white' ? "bg-red-50 text-red-600 border-red-100" : "bg-red-500/10 text-red-400 border-red-500/20"
             )}
           >
              <ShieldAlert className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden lg:inline text-xs font-bold uppercase">{t.safetyGuide}</span>
           </button>
           
           {user ? (
             <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={clsx(
                  "flex items-center gap-2 p-0.5 md:pl-2 md:pr-3 md:py-1.5 border rounded-full transition-all relative",
                  theme === 'white' ? "bg-slate-100 border-slate-200" : "bg-slate-800 border-slate-700"
                )}
              >
                 <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 md:w-8 md:h-8 rounded-full border border-slate-600 object-cover" />
                 <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                 
                 {isUserMenuOpen && (
                  <div className={clsx(
                    "absolute top-full right-0 mt-2 w-56 border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50",
                    theme === 'white' ? "bg-white border-slate-200 text-slate-700" : "bg-slate-900 border-slate-700 text-slate-300"
                  )}>
                     <button onClick={() => setIsProfileOpen(true)} className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-b border-white/5 hover:bg-white/5">
                        <UserIcon className="w-4 h-4 text-cyan-500" /> {t.profile}
                     </button>
                     <button onClick={() => setIsSettingsOpen(true)} className="w-full text-left px-4 py-3 text-sm flex items-center gap-3 border-b border-white/5 hover:bg-white/5">
                        <SettingsIcon className="w-4 h-4 text-slate-400" /> {t.settings}
                     </button>
                     <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 flex items-center gap-3 hover:bg-red-500/5">
                        <LogOut className="w-4 h-4" /> {t.signOut}
                     </button>
                  </div>
                 )}
              </button>
           ) : (
             <button onClick={() => setIsAuthOpen(true)} className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide">
                Sign In
             </button>
           )}
        </div>
      </header>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="relative h-[60dvh] md:h-[calc(100dvh-64px)] shrink-0 overflow-hidden">
          <InteractiveMap onLocationSelect={handleLocationSelect} selectedLocation={selectedLoc} theme={theme} />
          
          {/* Reflexive Telemetry Widget */}
          {!selectedReport && !loading && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-24 md:left-6 md:translate-x-0 z-40 w-[90vw] md:w-64">
              <div className={clsx(
                "backdrop-blur-xl p-3 md:p-4 rounded-2xl border shadow-2xl",
                theme === 'white' ? "bg-white/80 border-slate-200 text-slate-900" : "bg-slate-900/90 border-slate-700 text-white"
              )}>
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
                   <Activity className="w-3 h-3 md:w-4 md:h-4 text-cyan-500" />
                   <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-widest">{t.satInputs}</h3>
                </div>
                <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar md:gap-2">
                  {['INSAT-3DR', 'Sentinel-2', 'H-9'].map((sat) => (
                    <div key={sat} className="flex-shrink-0 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold opacity-80">{sat}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full relative z-10 flex-1 overflow-y-auto">
          <AboutSection theme={theme} />
        </div>
        
        <DashboardPanel report={selectedReport} loading={loading} onClose={closeDashboard} theme={theme} language={language} />
        <ChatWidget report={selectedReport} theme={theme} language={language} />
      </main>
    </div>
  );
};

export default App;
