import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchSubjects, fetchStudyRecommendations } from '../services/api';
import { Brain, Calendar, Target, AlertTriangle, ArrowRight, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';

const Recommendations = () => {
  const [subjects, setSubjects] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [progressData, setProgressData] = useState({});
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
        
        // Initialize progress data
        const initialProgress = {};
        data.forEach(sub => {
          initialProgress[sub.name] = 50; // default 50%
        });
        setProgressData(initialProgress);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    loadSubjects();
  }, []);

  const handleProgressChange = (subjectName, value) => {
    setProgressData(prev => ({
      ...prev,
      [subjectName]: parseInt(value)
    }));
  };

  const handleGenerate = async () => {
    if (!examDate) {
      alert("Please select an exam date.");
      return;
    }
    
    setIsLoading(true);
    try {
      const subjectList = subjects.map(s => s.name);
      const data = await fetchStudyRecommendations(progressData, subjectList, examDate);
      setRecommendations(data);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-white">
            Study Recommendations
          </h2>
          <p className="text-slate-400 text-lg">
            Tell the AI how you are doing, and get a smart strategy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Target className="text-blue-400 w-5 h-5" /> Current Status
            </h3>
            
            <div className="mb-6">
              <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Exam Date
              </label>
              <input 
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-4 mb-8">
              <label className="block text-slate-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" /> Mastery Level (%)
              </label>
              
              {subjects.length === 0 ? (
                <p className="text-slate-500 text-sm italic">Please add subjects in the Subjects tab first.</p>
              ) : (
                subjects.map(sub => (
                  <div key={sub.id} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between text-sm text-slate-300 mb-2">
                      <span className="font-medium text-white">{sub.name}</span>
                      <span>{progressData[sub.name]}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0" max="100"
                      value={progressData[sub.name]}
                      onChange={(e) => handleProgressChange(sub.name, e.target.value)}
                      className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || subjects.length === 0}
              className="w-full btn-primary py-3 px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="animate-pulse">Analyzing Data...</span>
              ) : (
                <>
                  <Brain className="w-5 h-5" /> Generate AI Strategy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          {recommendations ? (
            <div className="space-y-6">
              
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel p-6 border-t-2 border-t-rose-400 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 text-rose-500/10 group-hover:text-rose-500/20 transition-colors duration-500">
                    <AlertTriangle className="w-32 h-32" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Critical Priority</p>
                  <h4 className="text-2xl font-bold text-white mb-2">{recommendations.study_first}</h4>
                  <p className="text-rose-300 text-sm">Study this subject first.</p>
                </div>

                <div className="glass-panel p-6 border-t-2 border-t-emerald-400 relative overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500">
                    <TrendingUp className="w-32 h-32" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Predicted Score (if you study 4h/day)</p>
                  <h4 className="text-3xl font-bold text-white mb-2">{recommendations.predicted_overall_performance.toFixed(1)}</h4>
                  <p className="text-emerald-300 text-sm">With {recommendations.days_left} days left.</p>
                </div>
              </div>

              {/* Strategy Breakdown */}
              <div className="glass-panel p-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="text-teal-400 w-5 h-5" /> AI Action Plan
                </h3>
                
                <div className="space-y-4">
                  {recommendations.recommendations.map((rec, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <h4 className="text-white font-bold text-lg">{rec.subject}</h4>
                        <div className="flex gap-3 text-sm mt-1">
                          <span className="text-slate-400">Mastery: {rec.current_progress}%</span>
                          <span className={
                            rec.priority === 'high' ? 'text-rose-400 font-medium' :
                            rec.priority === 'medium' ? 'text-amber-400 font-medium' :
                            'text-emerald-400 font-medium'
                          }>
                            {rec.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                        <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 whitespace-nowrap">
                          <span className="text-emerald-400 font-bold">{rec.suggested_hours} hrs</span>
                          <span className="text-slate-500 text-xs ml-1">/ day</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                <Brain className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Awaiting Data</h3>
              <p className="text-slate-400 max-w-sm">
                Enter your exam date and current mastery levels on the left, then click Generate to see your AI-optimized strategy.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
