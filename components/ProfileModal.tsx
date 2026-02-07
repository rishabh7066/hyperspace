
import React, { useState, useRef, useMemo } from 'react';
import { X, User as UserIcon, Mail, Shield, Activity, Map, Camera, Check, Upload, Loader2, Sparkles, Palette, Shirt, UserRound, Glasses, Eye, Smile, Star } from 'lucide-react';
import { User, ThemeMode, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { updateUserAvatar } from '../services/authService';
import clsx from 'clsx';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdate: (user: User) => void;
  theme: ThemeMode;
  language: Language;
}

const AVATAR_DATA = {
  genders: [
    { id: 'feminine', label: 'Female', seed: 'Aneka' },
    { id: 'masculine', label: 'Male', seed: 'Felix' },
    { id: 'neutral', label: 'Enby', seed: 'Sasha' }
  ],
  traits: {
    hair: [
      { id: 'shortHair', label: 'Short' },
      { id: 'longHair', label: 'Long' },
      { id: 'bob', label: 'Bob' },
      { id: 'curvy', label: 'Curvy' },
      { id: 'turban', label: 'Turban' },
      { id: 'hijab', label: 'Hijab' },
      { id: 'noHair', label: 'Bald' },
    ],
    eyes: [
      { id: 'default', label: 'Natural' },
      { id: 'happy', label: 'Happy' },
      { id: 'wink', label: 'Wink' },
      { id: 'hearts', label: 'Love' },
      { id: 'closed', label: 'Sleep' },
    ],
    mouth: [
      { id: 'default', label: 'Mid' },
      { id: 'smile', label: 'Smile' },
      { id: 'serious', label: 'Serious' },
      { id: 'twinkle', label: 'Twinkle' },
    ],
    clothing: [
      { id: 'blazerAndShirt', label: 'Suit' },
      { id: 'graphicShirt', label: 'Tee' },
      { id: 'hoodie', label: 'Hoodie' },
      { id: 'overall', label: 'Work' },
    ],
    accessories: [
      { id: 'none', label: 'None' },
      { id: 'kurt', label: 'Style' },
      { id: 'prescription02', label: 'Pro' },
      { id: 'sunglasses', label: 'Sun' },
    ]
  },
  colors: ['2c3e50', 'e74c3c', '3498db', '2ecc71', 'f1c40f', '9b59b6', 'ffffff', '000000']
};

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user, onUserUpdate, theme, language }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'studio'>('info');
  const [studioTab, setStudioTab] = useState<'base' | 'face' | 'hair' | 'gear' | 'style'>('base');
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gender, setGender] = useState<'masculine' | 'feminine' | 'neutral'>('neutral');
  const [top, setTop] = useState('shortHair');
  const [eye, setEye] = useState('default');
  const [mouth, setMouth] = useState('default');
  const [clothes, setClothes] = useState('graphicShirt');
  const [clothingColor, setClothingColor] = useState('3498db');
  const [accessory, setAccessory] = useState('none');

  const previewUrl = useMemo(() => {
    const baseSeed = AVATAR_DATA.genders.find(g => g.id === gender)?.seed || 'Sasha';
    const params = new URLSearchParams({
      seed: baseSeed, top, eyes: eye, mouth, clothing: clothes, clothingColor, accessories: accessory,
      backgroundColor: 'b6e3f4', backgroundType: 'gradientLinear'
    });
    return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
  }, [gender, top, eye, mouth, clothes, clothingColor, accessory]);

  const getTraitThumb = (traitType: string, value: string) => {
    const baseSeed = AVATAR_DATA.genders.find(g => g.id === gender)?.seed || 'Sasha';
    const params = new URLSearchParams({ seed: baseSeed, [traitType]: value, size: '48' });
    return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
  };

  if (!isOpen || !user) return null;

  const handleSaveAvatar = async () => {
    setUpdating(true);
    try {
      const updatedUser = await updateUserAvatar(user.id, previewUrl);
      onUserUpdate(updatedUser);
      setActiveTab('info');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const modalBg = theme === 'black' ? "bg-black border-slate-800 text-white" :
                  theme === 'blue' ? "bg-slate-950 border-slate-800 text-slate-100" :
                  "bg-white border-slate-200 text-slate-900";

  return (
    <div className="fixed inset-0 z-[2500] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className={clsx(
        "relative w-full max-w-lg h-[90dvh] sm:h-[750px] rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl border overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95",
        modalBg
      )}>
        {/* Compact Profile Header */}
        <div className="h-40 md:h-48 bg-gradient-to-br from-indigo-600 to-blue-700 relative flex flex-col items-center justify-center shrink-0">
           <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur-md transition-all z-10">
             <X className="w-5 h-5" />
           </button>
           
           <div className="relative group mt-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 p-1 backdrop-blur-xl border-2 border-white/20 relative">
                 <img 
                    src={activeTab === 'studio' ? previewUrl : user.avatarUrl} 
                    alt={user.name} 
                    className="w-full h-full rounded-full object-cover bg-slate-100 shadow-xl" 
                 />
              </div>
              <button 
                onClick={() => setActiveTab('studio')}
                className="absolute -bottom-1 -right-1 bg-yellow-400 p-2 rounded-full border-4 border-indigo-700 shadow-lg text-blue-900"
              >
                 <Sparkles className="w-3.5 h-3.5" />
              </button>
           </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-2 mx-4 md:mx-8 mt-4 rounded-2xl bg-white/5 border border-white/5">
           <button 
             onClick={() => setActiveTab('info')}
             className={clsx("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all", activeTab === 'info' ? "bg-white text-blue-600 shadow-lg" : "text-slate-500")}
           >
              <UserIcon className="w-4 h-4" /> Info
           </button>
           <button 
             onClick={() => setActiveTab('studio')}
             className={clsx("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all", activeTab === 'studio' ? "bg-yellow-400 text-blue-900 shadow-lg" : "text-slate-500")}
           >
              <Palette className="w-4 h-4" /> Studio
           </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
           {activeTab === 'info' ? (
             <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-4">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Mail className="w-5 h-5" /></div>
                      <div className="overflow-hidden">
                         <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Digital Address</p>
                         <p className="text-sm font-bold truncate">{user.email}</p>
                      </div>
                   </div>
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Shield className="w-5 h-5" /></div>
                      <div>
                         <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Access Privilege</p>
                         <p className="text-sm font-bold">L4 Operational Clearance</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center">
                      <Activity className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
                      <div className="text-2xl font-black">100%</div>
                      <div className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Reliability</div>
                   </div>
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center">
                      <Map className="w-5 h-5 mx-auto mb-2 text-indigo-400" />
                      <div className="text-2xl font-black">09</div>
                      <div className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Deployments</div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-around py-3 bg-white/5 border-y border-white/5 px-2">
                   {[
                     { id: 'base', icon: <UserRound className="w-4 h-4" /> },
                     { id: 'face', icon: <Smile className="w-4 h-4" /> },
                     { id: 'hair', icon: <Palette className="w-4 h-4" /> },
                     { id: 'gear', icon: <Glasses className="w-4 h-4" /> },
                     { id: 'style', icon: <Shirt className="w-4 h-4" /> },
                   ].map((item) => (
                     <button 
                       key={item.id} 
                       onClick={() => setStudioTab(item.id as any)}
                       className={clsx("p-3 rounded-xl transition-all", studioTab === item.id ? "bg-blue-600 text-white shadow-md scale-105" : "text-slate-500")}
                     >
                       {item.icon}
                     </button>
                   ))}
                </div>

                <div className="p-5">
                   {studioTab === 'base' && (
                     <div className="grid grid-cols-3 gap-3">
                        {AVATAR_DATA.genders.map((g) => (
                          <button key={g.id} onClick={() => setGender(g.id as any)} className={clsx("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all", gender === g.id ? "border-blue-500 bg-blue-500/10" : "border-white/5 bg-white/5")}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${g.seed}&size=40`} className="w-10 h-10 rounded-full" />
                            <span className="text-[9px] font-black uppercase">{g.label}</span>
                          </button>
                        ))}
                     </div>
                   )}

                   {studioTab === 'face' && (
                     <div className="grid grid-cols-3 gap-3">
                        {AVATAR_DATA.traits.eyes.map((e) => (
                          <button key={e.id} onClick={() => setEye(e.id)} className={clsx("p-3 rounded-2xl border-2 flex flex-col items-center gap-2", eye === e.id ? "border-blue-500 bg-blue-500/10" : "border-white/5")}>
                            <img src={getTraitThumb('eyes', e.id)} className="w-8 h-8" />
                            <span className="text-[8px] font-bold uppercase">{e.label}</span>
                          </button>
                        ))}
                     </div>
                   )}

                   {studioTab === 'hair' && (
                     <div className="grid grid-cols-3 gap-3">
                        {AVATAR_DATA.traits.hair.map((h) => (
                          <button key={h.id} onClick={() => setTop(h.id)} className={clsx("aspect-square p-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-2", top === h.id ? "border-blue-500 bg-blue-500/10" : "border-white/5")}>
                            <img src={getTraitThumb('top', h.id)} className="w-10 h-10" />
                            <span className="text-[8px] font-bold uppercase truncate w-full text-center">{h.label}</span>
                          </button>
                        ))}
                     </div>
                   )}
                   
                   {/* style and gear simplified for mobile UI space */}
                </div>

                <div className="p-6 md:p-8 bg-black/40 backdrop-blur-2xl border-t border-white/5 sticky bottom-0">
                   <button 
                     onClick={handleSaveAvatar}
                     disabled={updating}
                     className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                   >
                     {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5 stroke-[3]" /> Update Profile</>}
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
