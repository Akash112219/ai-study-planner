import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  AreaChart, Area, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { fetchProgress, fetchExamAnalytics } from '../services/api';
import { AlertCircle, Target, TrendingUp, BrainCircuit } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl">
        <p className="text-slate-200 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [progressData, setProgressData] = useState([]);
  const [examAnalytics, setExamAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [progData, examData] = await Promise.all([
        fetchProgress(),
        fetchExamAnalytics()
      ]);
      
      const formatted = progData.reverse().map((item, index) => ({
        name: `Day ${index + 1}`,
        hours: item.hours_per_day,
        productivity: Math.round(item.performance_score)
      }));
      setProgressData(formatted);
      setExamAnalytics(examData);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            Student Analytics
          </h2>
          <p className="text-slate-400 text-lg">Detailed insights into your exam performance and study metrics.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* KPI Cards */}
            <div className="glass-panel p-6 border-l-4 border-emerald-500 hover:bg-slate-800/80 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-emerald-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Avg Exam Score</h4>
              <p className="text-4xl font-bold text-white">{examAnalytics?.performance_score}%</p>
            </div>

            <div className="glass-panel p-6 border-l-4 border-rose-500 hover:bg-slate-800/80 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-rose-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-rose-400" />
                </div>
              </div>
              <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Weak Subjects</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {examAnalytics?.weak_subjects?.length > 0 ? (
                  examAnalytics.weak_subjects.map(sub => (
                    <span key={sub} className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full text-sm border border-rose-500/30">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">No weak subjects detected.</span>
                )}
              </div>
            </div>

            <div className="glass-panel p-6 border-l-4 border-indigo-500 hover:bg-slate-800/80 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Strong Subjects</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {examAnalytics?.strong_subjects?.length > 0 ? (
                  examAnalytics.strong_subjects.map(sub => (
                    <span key={sub} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-sm border border-indigo-500/30">
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">None yet. Keep practicing!</span>
                )}
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="glass-panel p-8 mb-8 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <BrainCircuit className="text-emerald-400 w-6 h-6" /> 
              AI Improvement Suggestions
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed max-w-3xl border-l-2 border-emerald-500/50 pl-4">
              {examAnalytics?.improvement_suggestions}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Historical Score Chart */}
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                Historical Progress Model
              </h3>
              
              <div className="h-64 w-full relative z-10">
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="productivity" name="Productivity (%)" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                    No timeline data yet.
                  </div>
                )}
              </div>
            </div>

            {/* Study Hours Chart */}
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
                Study Hours Log
              </h3>
              
              <div className="h-64 w-full relative z-10">
                {progressData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="hours" name="Study Hours" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                    Waiting for data...
                  </div>
                )}
              </div>
            </div>

          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
