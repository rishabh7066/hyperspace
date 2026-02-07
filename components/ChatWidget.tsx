
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2, Maximize2, Minimize2, Info } from 'lucide-react';
import { LocationReport, ThemeMode, Language } from '../types';
import { createChatSession } from '../services/chatService';
import { GenerateContentResponse } from '@google/genai';
import clsx from 'clsx';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatWidgetProps {
  report: LocationReport | null;
  theme: ThemeMode;
  language: Language;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ report, theme, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Namaste! I am your Sky-X Climate Assistant. How can I help you interpret the satellite data today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize or update chat context when report changes
  useEffect(() => {
    try {
      chatRef.current = createChatSession(report);
    } catch (e) {
      console.warn("Chat failed to initialize", e);
    }
  }, [report, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      if (!chatRef.current) {
         chatRef.current = createChatSession(report);
      }
      
      if (!chatRef.current) {
        throw new Error("Chat service unavailable (Missing API Key)");
      }
      
      const response = await chatRef.current.sendMessageStream({ message: userMsg });
      let fullText = "";
      
      // Add a placeholder message for streaming
      setMessages(prev => [...prev, { role: 'model', text: "" }]);

      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Chat Error:", error);
      let errorMsg = "I encountered a synchronization error with the neural grid. Please try again.";
      if (error instanceof Error && error.message.includes("API Key")) {
        errorMsg = "System Error: Gemini API Key is missing. Please configure the environment.";
      }
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const containerClasses = clsx(
    "fixed bottom-6 right-6 z-[3000] flex flex-col transition-all duration-300 ease-in-out",
    isOpen ? (isExpanded ? "w-[90vw] h-[80vh] md:w-[600px] md:h-[700px]" : "w-[350px] h-[500px]") : "w-14 h-14"
  );

  const panelBg = theme === 'white' ? "bg-white/90 border-slate-200" : "bg-slate-950/90 border-cyan-500/30";
  const textColor = theme === 'white' ? "text-slate-900" : "text-white";

  return (
    <div className={containerClasses}>
      {isOpen ? (
        <div className={clsx(
          "flex flex-col h-full rounded-2xl border shadow-2xl backdrop-blur-xl overflow-hidden animate-in zoom-in-95",
          panelBg
        )}>
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500 rounded-lg text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className={clsx("text-sm font-bold", textColor)}>Sky-X Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Neural Link Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
               <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
               </button>
               <button onClick={() => setIsOpen(false)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                 <X className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div key={idx} className={clsx("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}>
                <div className={clsx(
                  "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-cyan-600 text-white rounded-tr-none" 
                    : theme === 'white' ? "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none" : "bg-white/5 border border-white/10 text-slate-200 rounded-tl-none"
                )}>
                  {msg.text || (loading && idx === messages.length - 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : null)}
                </div>
                {msg.role === 'model' && (
                  <span className="text-[9px] font-bold text-cyan-500 mt-1 ml-1 flex items-center gap-1 uppercase tracking-tighter">
                    <Sparkles className="w-2.5 h-2.5" /> AI Insight
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
             {['Explain Risks', 'Satellite Bands', 'Climate Trends'].map(action => (
               <button 
                 key={action}
                 onClick={() => setInput(action)}
                 className="whitespace-nowrap px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 transition-colors"
               >
                 {action}
               </button>
             ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about climate telemetry..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-700 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all hover:scale-110 active:scale-90 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Bot className="w-7 h-7 text-white relative z-10" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-slate-950 rounded-full flex items-center justify-center animate-bounce">
             <span className="text-[8px] font-bold text-white leading-none">!</span>
          </div>
          
          {/* Pulse Rings */}
          <span className="absolute h-full w-full rounded-full bg-cyan-400 opacity-20 animate-ping"></span>
        </button>
      )}
    </div>
  );
};
