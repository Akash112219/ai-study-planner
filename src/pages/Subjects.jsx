import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchSubjects, addSubject, deleteSubject, fetchRecommendations } from '../services/api';
import { BookOpen, Plus, Trash2, Brain, AlertTriangle, Clock } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [hoursStudied, setHoursStudied] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!name) return;
    
    try {
      await addSubject({
        name,
        difficulty_level: parseInt(difficulty),
        hours_studied: parseFloat(hoursStudied) || 0
      });
      setName('');
      setDifficulty(3);
      setHoursStudied('');
      loadData();
    } catch (error) {
      console.error("Failed to add subject:", error);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteSubject(id);
      loadData();
    } catch (error) {
      console.error("Failed to delete subject:", error);
    }
  };

  const getInsights = async () => {
    try {
      const data = await fetchRecommendations(10); // Assume 10 hours available
      setRecommendations(data);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    }
  };

  if (isLoading && subjects.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center text-slate-400">Loading Subjects...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-white">
            Subject Management
          </h2>
          <p className="text-slate-400 text-lg">
            Add your subjects and let AI optimize your focus time.
          </p>
        </div>
        <button 
          onClick={getInsights}
          className="btn-primary py-2.5 px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2"
        >
          <Brain className="w-5 h-5" />
          Get AI Insights
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form and List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Add Subject Form */}
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Plus className="text-emerald-400 w-5 h-5" /> Add New Subject
            </h3>
            <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-2">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Chemistry"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Difficulty (1-5)</label>
                <input 
                  type="number" 
                  min="1" max="5"
                  required
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Hours Studied</label>
                <input 
                  type="number" 
                  step="0.5"
                  min="0"
                  value={hoursStudied}
                  onChange={(e) => setHoursStudied(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="md:col-span-4 flex justify-end mt-2">
                <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-6 rounded-lg transition-colors border border-slate-600">
                  Save Subject
                </button>
              </div>
            </form>
          </div>

          {/* Subjects List */}
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BookOpen className="text-blue-400 w-5 h-5" /> Your Subjects
            </h3>
            
            {subjects.length === 0 ? (
              <p className="text-slate-500 italic">No subjects added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects.map(sub => (
                  <div key={sub.id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 relative group">
                    <button 
                      onClick={() => handleDeleteSubject(sub.id)}
                      className="absolute top-4 right-4 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="font-bold text-white mb-1">{sub.name}</h4>
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>Diff: <strong className="text-slate-200">{sub.difficulty_level}/5</strong></span>
                      <span>Studied: <strong className="text-slate-200">{sub.hours_studied}h</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: AI Recommendations */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 h-full border-t-2 border-t-emerald-400 shadow-[0_-5px_20px_rgba(16,185,129,0.15)]">
            <h3 className="text-xl font-semibold text-emerald-300 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6" /> AI Diagnostics
            </h3>

            {!recommendations ? (
              <div className="text-center py-10">
                <p className="text-slate-400 mb-4">Click "Get AI Insights" to analyze your subjects.</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Weak Subjects Alert */}
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                  <h4 className="text-rose-400 font-bold flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" /> Focus Required
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">
                    Based on your difficulty levels vs time invested, you are weakest in:
                  </p>
                  <ul className="list-disc pl-5 text-rose-300 font-medium text-sm space-y-1">
                    {recommendations.weak_subjects.map((ws, i) => <li key={i}>{ws}</li>)}
                  </ul>
                </div>

                {/* Time Distribution */}
                <div>
                  <h4 className="text-white font-bold flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4 text-blue-400" /> Optimal Time Split (Next 10 Hrs)
                  </h4>
                  <div className="space-y-3">
                    {recommendations.time_distribution.map((dist, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300">{dist.subject_name}</span>
                          <span className="text-emerald-400 font-bold">{dist.suggested_hours}h</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full" 
                            style={{ width: `${(dist.suggested_hours / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Subjects;
