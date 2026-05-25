import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchSubjects, generateMockTest, submitMockTest } from '../services/api';
import { ScrollText, Search, BookOpen, AlertCircle, ArrowRight, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

const ExamPaper = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [educationLevel, setEducationLevel] = useState('BS Program');
  const [examMode, setExamMode] = useState('Theory Only');
  const [questionCount, setQuestionCount] = useState(10);
  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Test Mode States
  const [isTestMode, setIsTestMode] = useState(false);
  const [flattenedQuestions, setFlattenedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [testResult, setTestResult] = useState(null);

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

  useEffect(() => {
    let timer;
    if (isTestMode && !isTestFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestMode && !isTestFinished) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [isTestMode, isTestFinished, timeLeft]);

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
    setIsTestMode(false);
    setIsTestFinished(false);
    
    try {
      const data = await generateMockTest(finalSubject, topics, difficultyFilter, questionCount, educationLevel, examMode);
      setExamData(data);
      
      const flat = [
        ...data.paper.mcqs.map(q => ({...q, type: 'MCQ'})),
        ...data.paper.short_questions.map(q => ({...q, type: 'Short'})),
        ...data.paper.long_questions.map(q => ({...q, type: 'Long'}))
      ];
      setFlattenedQuestions(flat);
    } catch (error) {
      console.error("Failed to fetch exam paper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTest = () => {
    setIsTestMode(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsTestFinished(false);
    setTimeLeft(flattenedQuestions.length * 60); // 1 minute per question default
  };

  const handleAnswerSelect = (answer) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < flattenedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    try {
      const answersDict = {};
      flattenedQuestions.forEach((q, idx) => {
        if (q.type === 'MCQ') {
          answersDict[q.id] = userAnswers[idx];
        }
      });
      
      const correctMcqAnswers = {};
      flattenedQuestions.forEach(q => {
        if (q.type === 'MCQ') {
          correctMcqAnswers[q.id] = q.correct_answer;
        }
      });
      
      const result = await submitMockTest(examData.session_id, answersDict, correctMcqAnswers);
      setTestResult(result.result);
      setIsTestFinished(true);
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("Error submitting test. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
    if (imp.includes('Practice')) return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    if (imp.includes('Important')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    if (imp.includes('Must Prepare')) return 'text-rose-400 bg-rose-400/10 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
    return 'text-slate-400';
  };

  const isTopQuestion = (q) => {
    if (q.importance && q.importance.includes('Must Prepare')) return true;
    if (q.exam_probability && parseInt(q.exam_probability) > 85) return true;
    return false;
  };

  const renderSolution = (q) => (
    <div className="mt-4 bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
      <details className="group/details" open={isTestFinished}>
        <summary className="text-sm font-semibold text-emerald-400 cursor-pointer list-none flex items-center gap-2 outline-none">
          <ArrowRight className="w-4 h-4 transition-transform group-open/details:rotate-90" />
          Reveal Correct Answer
        </summary>
        <div className="mt-4 space-y-4 pl-6 border-l-2 border-emerald-500/30">
          <div>
            <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">Answer</span>
            <p className="text-slate-200 text-sm leading-relaxed">{q.correct_answer}</p>
          </div>
          {q.explanation && (
            <div>
              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">Explanation</span>
              <p className="text-slate-400 text-sm leading-relaxed italic">{q.explanation}</p>
            </div>
          )}
        </div>
      </details>
    </div>
  );

  const renderTestInterface = () => {
    const q = flattenedQuestions[currentQuestionIndex];
    if (!q) return null;

    return (
      <div className="glass-panel p-8 h-full flex flex-col relative">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Question {currentQuestionIndex + 1} of {flattenedQuestions.length}
            </h3>
            <span className="text-slate-400 text-sm">{q.type} Type</span>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-full border border-slate-600">
            <Clock className={`w-5 h-5 ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-rose-500' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className={`flex-1 p-6 rounded-xl border ${isTopQuestion(q) ? 'bg-slate-800/80 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-slate-800/40 border-slate-700/50'}`}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${getDifficultyColor(q.difficulty)}`}>
              {q.difficulty}
            </span>
            {q.importance && (
              <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border flex items-center gap-1 ${getImportanceColor(q.importance)}`}>
                {q.importance}
              </span>
            )}
          </div>
          
          <p className="text-xl text-white mb-8 leading-relaxed">{q.question}</p>

          {q.type === 'MCQ' ? (
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(opt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    userAnswers[currentQuestionIndex] === opt 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${
                      userAnswers[currentQuestionIndex] === opt ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className={userAnswers[currentQuestionIndex] === opt ? 'text-white font-medium' : 'text-slate-300'}>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div>
              <textarea 
                value={userAnswers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerSelect(e.target.value)}
                placeholder="Type your detailed answer here..."
                rows={6}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <button 
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>

          {currentQuestionIndex === flattenedQuestions.length - 1 ? (
            <button 
              onClick={handleSubmitTest}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" /> Submit Test
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!testResult) return null;

    return (
      <div className="glass-panel p-8 h-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Test Completed!</h2>
          <p className="text-slate-400 text-lg">Here is your automated breakdown.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
            <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Score</h4>
            <p className="text-3xl font-bold text-emerald-400">{testResult.obtained_marks} / 100</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
            <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Percentage</h4>
            <p className="text-3xl font-bold text-indigo-400">{testResult.percentage}%</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-center">
            <h4 className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">Weak Topics</h4>
            <p className="text-sm font-bold text-purple-400 mt-2">{testResult.weak_topics}</p>
          </div>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-xl border border-slate-700 mb-10">
          <h4 className="text-lg font-bold text-white mb-2">AI Feedback & Improvements</h4>
          <p className="text-slate-300 leading-relaxed">{testResult.improvement_suggestions}</p>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Detailed Review</h3>
        <div className="space-y-6">
          {flattenedQuestions.map((q, idx) => {
            const isCorrect = q.type === 'MCQ' ? userAnswers[idx] === q.correct_answer : null;
            
            return (
              <div key={idx} className={`p-6 rounded-xl border bg-slate-800/40 ${isCorrect === true ? 'border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]' : isCorrect === false ? 'border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'border-slate-700'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-sm font-bold">Q{idx + 1}</span>
                    <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-slate-700 text-slate-300 border border-slate-600">{q.type}</span>
                  </div>
                  {isCorrect !== null && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-white mb-4">{q.question}</p>
                
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-4">
                  <span className="text-xs uppercase text-slate-500 font-bold tracking-wider block mb-1">Your Answer</span>
                  <p className={`${!userAnswers[idx] ? 'text-slate-600 italic' : 'text-slate-300'}`}>
                    {userAnswers[idx] || "No answer provided"}
                  </p>
                </div>

                {renderSolution(q)}
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => { setIsTestFinished(false); setIsTestMode(false); }}
            className="px-8 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors"
          >
            Exit to Exam Generator
          </button>
        </div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="glass-panel p-6 h-full flex flex-col">
      <div className="border-b border-slate-700/50 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <ScrollText className="text-indigo-400 w-6 h-6" /> 
            {examData.subject} Practice Exam
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Topic Focus:</span>
            <span className="bg-slate-800 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 font-medium">
              {examData.topic_focus}
            </span>
          </div>
        </div>
        
        <button 
          onClick={startTest}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
        >
          <PlayCircle className="w-5 h-5" /> Start Test Mode
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-10 pr-2">
        
        {/* Section 1: MCQs */}
        <section>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-l-4 border-emerald-500 pl-3">
            Section A: Multiple Choice
          </h4>
          <div className="space-y-4">
            {examData.paper.mcqs.map((q, idx) => (
              <div key={`mcq-${idx}`} className={`exam-card p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isTopQuestion(q) ? 'bg-slate-800/80 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-400' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'}`}>
                {isTopQuestion(q) && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-indigo-500"></div>}
                
                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {q.importance && (
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border flex items-center gap-1 ${getImportanceColor(q.importance)}`}>
                        {q.importance}
                      </span>
                    )}
                    {q.exam_probability && (
                      <span className="px-2 py-0.5 text-xs font-medium uppercase rounded border text-indigo-400 bg-indigo-400/10 border-indigo-400/30">
                        Prob: {q.exam_probability}
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-bold rounded border text-purple-300 bg-purple-500/20 border-purple-500/30">
                      {q.type} ({q.marks} Marks)
                    </span>
                    {q.past_paper_frequency > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold uppercase rounded border text-emerald-300 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse">
                        🔥 Repeated {q.past_paper_frequency}x ({q.years_repeated})
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-sm font-bold">Q{idx + 1}</span>
                </div>
                
                <p className={`text-lg mb-4 ${isTopQuestion(q) ? 'text-white' : 'text-slate-200'}`}>{q.question}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-slate-300 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-slate-400">
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      {opt}
                    </div>
                  ))}
                </div>
                {renderSolution(q)}
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Short Questions */}
        <section>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-l-4 border-amber-500 pl-3">
            Section B: Short Answer
          </h4>
          <div className="space-y-4">
            {examData.paper.short_questions.map((q, idx) => (
              <div key={`short-${idx}`} className={`exam-card p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isTopQuestion(q) ? 'bg-slate-800/80 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-400' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'}`}>
                {isTopQuestion(q) && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 to-orange-500"></div>}
                
                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {q.importance && (
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border flex items-center gap-1 ${getImportanceColor(q.importance)}`}>
                        {q.importance}
                      </span>
                    )}
                    {q.exam_probability && (
                      <span className="px-2 py-0.5 text-xs font-medium uppercase rounded border text-indigo-400 bg-indigo-400/10 border-indigo-400/30">
                        Prob: {q.exam_probability}
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-bold rounded border text-amber-300 bg-amber-500/20 border-amber-500/30">
                      {q.type} ({q.marks} Marks)
                    </span>
                    {q.past_paper_frequency > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold uppercase rounded border text-emerald-300 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse">
                        🔥 Repeated {q.past_paper_frequency}x ({q.years_repeated})
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-sm font-bold">Q{idx + 1}</span>
                </div>
                <p className={`text-lg mb-4 ${isTopQuestion(q) ? 'text-white' : 'text-slate-200'}`}>{q.question}</p>
                {renderSolution(q)}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Long Questions */}
        <section>
          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-l-4 border-rose-500 pl-3">
            Section C: Long Answer / Essay
          </h4>
          <div className="space-y-4">
            {examData.paper.long_questions.map((q, idx) => (
              <div key={`long-${idx}`} className={`exam-card p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${isTopQuestion(q) ? 'bg-slate-800/80 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:border-rose-400' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600'}`}>
                {isTopQuestion(q) && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-rose-500 to-pink-500"></div>}
                
                <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {q.importance && (
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded border flex items-center gap-1 ${getImportanceColor(q.importance)}`}>
                        {q.importance}
                      </span>
                    )}
                    {q.exam_probability && (
                      <span className="px-2 py-0.5 text-xs font-medium uppercase rounded border text-indigo-400 bg-indigo-400/10 border-indigo-400/30">
                        Prob: {q.exam_probability}
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-bold rounded border text-rose-300 bg-rose-500/20 border-rose-500/30">
                      {q.type} ({q.marks} Marks)
                    </span>
                    {q.past_paper_frequency > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold uppercase rounded border text-emerald-300 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse">
                        🔥 Repeated {q.past_paper_frequency}x ({q.years_repeated})
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 font-mono text-sm font-bold">Q{idx + 1}</span>
                </div>
                <p className={`text-lg mb-4 ${isTopQuestion(q) ? 'text-white' : 'text-slate-200'}`}>{q.question}</p>
                {renderSolution(q)}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-emerald-400 tracking-tight">
            Mock Exam Generator
          </h2>
          <p className="text-slate-400 text-lg">
            Create structured test papers (MCQs, Short & Long questions).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form (Hidden during test mode) */}
        {!isTestMode && !isTestFinished && (
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Search className="text-purple-400 w-5 h-5" /> Exam Setup
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Subject
                  </label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors mb-2"
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
                      placeholder="E.g. Computer Science"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-sm mb-2">Focus Topic (optional)</label>
                  <textarea 
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="E.g. Machine Learning"
                    rows={2}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors resize-none mb-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Education Level</label>
                    <select 
                      value={educationLevel}
                      onChange={(e) => setEducationLevel(e.target.value)}
                      className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      <option value="9th Class">9th Class</option>
                      <option value="10th Class">10th Class</option>
                      <option value="11th Class">11th Class</option>
                      <option value="12th Class">12th Class</option>
                      <option value="1st Year Practical">1st Year Practical</option>
                      <option value="2nd Year Practical">2nd Year Practical</option>
                      <option value="GED (American System)">GED (American System)</option>
                      <option value="ADP">ADP</option>
                      <option value="BS Program">BS Program</option>
                      <option value="Masters">Masters</option>
                      <option value="MPhil">MPhil</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Exam Mode</label>
                    <select 
                      value={examMode}
                      onChange={(e) => setExamMode(e.target.value)}
                      className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      <option value="Theory Only">Theory Only</option>
                      <option value="Practical Only">Practical Only</option>
                      <option value="Mixed Exam Mode">Mixed Exam Mode</option>
                      <option value="Viva Only">Viva Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Difficulty</label>
                    <select 
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors appearance-none"
                    >
                      <option value="all">All Levels</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Total Questions</label>
                    <input 
                      type="number" 
                      min="1" max="100"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden bg-slate-800 rounded-xl p-[2px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity bg-[length:200%_auto] animate-gradient"></div>
                  <div className="relative bg-slate-900 w-full h-full rounded-[10px] py-4 px-6 flex items-center justify-center gap-3 group-hover:bg-slate-900/80 transition-colors">
                    {isLoading ? (
                      <span className="text-white font-bold animate-pulse tracking-wide">Synthesizing Exam...</span>
                    ) : (
                      <>
                        <ScrollText className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" /> 
                        <span className="text-white font-bold tracking-wide">Generate Paper</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Panel */}
        <div className={isTestMode || isTestFinished ? "col-span-12" : "lg:col-span-8"}>
          {examData ? (
            isTestFinished ? renderResults() :
            isTestMode ? renderTestInterface() : 
            renderPreview()
          ) : (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-700/50">
                <ScrollText className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Mixed Mock Exams</h3>
              <p className="text-slate-400 max-w-sm">
                Generate a full structured exam paper containing Multiple Choice, Short, and Long answer questions to test your knowledge.
              </p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ExamPaper;
