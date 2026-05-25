import React from 'react';
import MarketingLayout from '../../components/Layout/MarketingLayout';

const Features = () => {
  const featuresList = [
    { 
      title: "Neural Scheduling Engine", 
      desc: "Our AI analyzes your natural energy peaks and valleys to schedule deep-work tasks precisely when you're most focused.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>,
      color: "emerald"
    },
    { 
      title: "Automated Spaced Repetition", 
      desc: "Never forget what you study. The system automatically injects 15-minute micro-review sessions into your week right before the forgetting curve hits.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>,
      color: "indigo"
    },
    { 
      title: "Dynamic Auto-Rescheduling", 
      desc: "Life happens. If you miss a study session, the AI instantly recalculates your entire week to ensure you still hit your exam deadlines.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
      color: "amber"
    },
    { 
      title: "Deep Work Analytics", 
      desc: "Visualize your true productivity. We track exact hours spent in deep focus versus shallow reading, generating a daily AI Productivity Score.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>,
      color: "teal"
    },
    { 
      title: "Curriculum Parsing", 
      desc: "Upload your syllabus PDF. Our natural language processing model will automatically break it down into granular daily tasks.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
      color: "rose"
    },
    { 
      title: "Focus Mode Integrations", 
      desc: "Syncs directly with your OS. When a study block begins, we automatically block distracting websites and mute non-essential notifications.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>,
      color: "blue"
    }
  ];

  // Helper to map color strings to Tailwind classes since we can't fully construct arbitrary class strings dynamically in Tailwind
  const colorMap = {
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]",
    indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/50 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    teal: "bg-teal-500/20 text-teal-400 border-teal-500/50 group-hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/50 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
  };

  return (
    <MarketingLayout>
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium mb-6">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
            Cognitive Science meets Machine Learning
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            An Unfair Academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Advantage</span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Stop relying on willpower. Our intelligent platform automates the hardest parts of studying—planning, prioritizing, and maintaining focus.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((f, i) => (
            <div 
              key={i} 
              className="group relative p-8 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl hover:-translate-y-2 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Animated Glow Behind Card */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
              
              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border transition-all duration-300 ${colorMap[f.color]}`}>
                {f.icon}
              </div>
              
              <h3 className="text-xl font-bold text-slate-100 mb-4 group-hover:text-white transition-colors">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
};

export default Features;
