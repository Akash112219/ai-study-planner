import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchSubjects, fetchImportantQuestions } from '../services/api';
import { FileQuestion, Search, BookOpen, AlertCircle, ArrowRight } from 'lucide-react';

const Questions = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionsData, setQuestionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
        if (data.length > 0) {
          setSelectedSubject(data[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    loadSubjects();
  }, []);

  const handleGenerate = async () => {
    const finalSubject = selectedSubject === 'custom' ? customSubject : selectedSubject;
    if (!finalSubject) {
      alert("Please select or enter a subject.");
      return;
    }

    const topics = topicInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    setIsLoading(true);
    try {
      const data = await fetchImportantQuestions(finalSubject, topics, difficultyFilter, numQuestions);
      setQuestionsData(data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getImportanceColor = (imp) => {
    if (imp.includes('Practice')) return 'text-slate-400';
    if (imp.includes('Important')) return 'text-amber-400';
    if (imp.includes('Must Prepare')) return 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]';
    return 'text-emerald-400';
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-white">
            Practice Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Generate high-yield exam questions using AI.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Search className="text-emerald-400 w-5 h-5" /> Query Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Subject
                </label>
                <select 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors mb-2"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.name}>{sub.name}</option>
                  ))}
                  <option value="custom">-- Custom Subject --</option>
                </select>
                
                {selectedSubject === 'custom' && (
                  <input 
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="E.g. Quantum Computing"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Topics (comma separated, optional)</label>
                <textarea 
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="E.g. Thermodynamics, Newton's Laws"
                  rows={2}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition-colors resize-none mb-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Difficulty</label>
                  <select 
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="all">All Levels</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Questions count</label>
                  <input 
                    type="number" 
                    min="1" max="20"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full btn-primary py-3 px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    <FileQuestion className="w-5 h-5" /> Generate Bank
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8">
          {questionsData ? (
            <div className="glass-panel p-6 h-full flex flex-col">
              <div className="border-b border-slate-700/50 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  <FileQuestion className="text-teal-400 w-6 h-6" /> 
                  {questionsData.subject} Question Bank
                </h3>
                <div className="flex flex-wrap gap-2 text-sm">
                  <span className="text-slate-400">Targeting:</span>
                  {questionsData.topics_analyzed.length > 0 ? (
                    questionsData.topics_analyzed.map((t, i) => (
                      <span key={i} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">General Core Concepts</span>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {questionsData.questions.length === 0 ? (
                  <div className="text-slate-400 text-center py-10">No questions generated. Try different topics.</div>
                ) : (
                  questionsData.questions.map((q, idx) => (
                    <div key={idx} className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors group relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-slate-700 group-hover:bg-emerald-500 transition-colors"></div>
                      
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border ${getDifficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                          </span>
                          {q.previous_appearances && (
                            <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded border text-blue-400 bg-blue-400/10 border-blue-400/20 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Exam Appearances: {q.previous_appearances}x
                            </span>
                          )}
                          {q.exam_probability && (
                            <span className="px-3 py-1 text-xs font-medium uppercase tracking-wider rounded border text-purple-400 bg-purple-400/10 border-purple-400/20 flex items-center gap-1">
                              Probability: {q.exam_probability}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-slate-500 font-mono text-sm">#{(idx + 1).toString().padStart(2, '0')}</span>
                          {q.importance_level && (
                            <span className={`text-[12px] font-bold uppercase tracking-widest ${getImportanceColor(q.importance_level)}`}>
                              {q.importance_level}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-200 text-lg leading-relaxed mb-4">{q.question}</p>
                      
                      {/* Answer and Tip Section */}
                      <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                        <details className="group/details">
                          <summary className="text-sm font-semibold text-emerald-400 cursor-pointer list-none flex items-center gap-2 outline-none">
                            <ArrowRight className="w-4 h-4 transition-transform group-open/details:rotate-90" />
                            Show Solution & Explanation
                          </summary>
                          <div className="mt-4 space-y-4 pl-6 border-l-2 border-emerald-500/30">
                            <div>
                              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">Quick Answer</span>
                              <p className="text-slate-300 text-sm leading-relaxed">{q.answer || 'Answer not available.'}</p>
                            </div>
                            {q.explanation && (
                              <div>
                                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">Explanation</span>
                                <p className="text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">How to Prepare Easily</span>
                              <p className="text-slate-300 text-sm leading-relaxed">{q.preparation_tip || 'Focus on core concepts.'}</p>
                            </div>
                          </div>
                        </details>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                <FileQuestion className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Practice Questions</h3>
              <p className="text-slate-400 max-w-sm">
                Select a subject and optional topics on the left to generate a personalized bank of high-yield practice questions.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Questions;
