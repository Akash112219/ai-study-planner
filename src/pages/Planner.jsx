import React, { useState } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import GlassCard from '../components/common/GlassCard';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import DatePicker from '../components/common/DatePicker';
import { generateStudyPlan } from '../services/api';
import useApi from '../hooks/useApi';

const Planner = () => {
  const [formData, setFormData] = useState({
    class_program: 'BS Program',
    subjects: '',
    weak_subjects: '',
    strong_subjects: '',
    daily_hours: '4',
    wake_up_time: '06:00',
    sleep_time: '22:00',
    school_time: '08:00-14:00',
    tuition_time: '',
    daily_activities: '',
    exam_date: '',
    break_preferences: 'Pomodoro',
    study_goal: 'Top Grades',
  });
  
  const [successMsg, setSuccessMsg] = useState('');
  
  const { execute: executeGeneratePlan, data: planData, isLoading: isGenerating, error: errorMsg, reset: resetApiState } = useApi(generateStudyPlan);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    resetApiState();
    const result = await executeGeneratePlan(formData);
    if (result.success) {
      setSuccessMsg(result.data.message);
    }
  };

  const schedule = planData?.schedule;

  return (
    <DashboardLayout>
      <header className="mb-10">
        <h2 className="text-4xl font-bold mb-3 text-slate-100">AI Smart Study Planner</h2>
        <p className="text-slate-400 text-lg">Input your complete routine and let AI optimize your entire day.</p>
      </header>

      {!schedule ? (
        <div className="max-w-4xl mx-auto">
          <GlassCard hoverEffect={false} className="relative z-10 p-8">
            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Class / Program</label>
                  <select name="class_program" value={formData.class_program} onChange={handleChange} className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors">
                    <option value="9th Class">9th Class</option>
                    <option value="10th Class">10th Class</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="BS Program">BS Program</option>
                    <option value="Masters">Master's</option>
                    <option value="MPhil">MPhil</option>
                    <option value="PhD">PhD</option>
                    <option value="GED">GED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Study Goal</label>
                  <select name="study_goal" value={formData.study_goal} onChange={handleChange} className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors">
                    <option value="Pass">Pass the Exam</option>
                    <option value="Top Grades">Achieve Top Grades</option>
                    <option value="Exam Prep">Intensive Exam Prep</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Subjects & Strengths</h4>
                <Input label="All Subjects (comma separated)" name="subjects" value={formData.subjects} onChange={handleChange} required placeholder="Math, Physics, English" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Weak Subjects" name="weak_subjects" value={formData.weak_subjects} onChange={handleChange} placeholder="e.g. Physics" />
                  <Input label="Strong Subjects" name="strong_subjects" value={formData.strong_subjects} onChange={handleChange} placeholder="e.g. English" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Time Constraints</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Wake-up Time" type="time" name="wake_up_time" value={formData.wake_up_time} onChange={handleChange} required />
                  <Input label="Sleep Time" type="time" name="sleep_time" value={formData.sleep_time} onChange={handleChange} required />
                  <Input label="School/College Timing" name="school_time" value={formData.school_time} onChange={handleChange} placeholder="08:00 - 14:00" />
                  <Input label="Tuition/Job Timing" name="tuition_time" value={formData.tuition_time} onChange={handleChange} placeholder="16:00 - 18:00 (Optional)" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Plan Preferences</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Daily Available Study Hours" type="number" min="1" max="16" name="daily_hours" value={formData.daily_hours} onChange={handleChange} required />
                  <DatePicker label="Target Exam Date" name="exam_date" value={formData.exam_date} onChange={handleChange} required />
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Break Preference</label>
                    <select name="break_preferences" value={formData.break_preferences} onChange={handleChange} className="w-full h-[50px] bg-slate-800/50 border border-slate-700 rounded-xl px-4 text-white outline-none focus:border-purple-500 transition-colors">
                      <option value="Pomodoro">Pomodoro (25m study / 5m break)</option>
                      <option value="Long Blocks">Long Blocks (2h study / 15m break)</option>
                    </select>
                  </div>
                  <Input label="Daily Activities" name="daily_activities" value={formData.daily_activities} onChange={handleChange} placeholder="Gym, Gaming, etc." />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isGenerating}>
                  Generate Complete Daily Study Plan
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div>
              <h3 className="text-2xl font-bold text-emerald-400">Your Complete Daily Study Plan is Ready</h3>
              <p className="text-slate-400 mt-1">Customized for {formData.class_program} with {planData.health_plan?.sleep} sleep.</p>
            </div>
            <Button variant="outline" onClick={() => resetApiState()}>Create New Plan</Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Timeline Column */}
            <div className="xl:col-span-2 space-y-8">
              {Object.entries(
                  schedule.reduce((acc, session) => {
                    if (!acc[session.date]) acc[session.date] = [];
                    acc[session.date].push(session);
                    return acc;
                  }, {})
                ).map(([date, sessions], dayIdx) => (
                  <GlassCard key={date} hoverEffect={false} className="p-6">
                    <div className="sticky top-0 z-20 mb-6 flex justify-between items-center bg-slate-900 border border-slate-700/50 px-4 py-2 rounded-xl shadow-lg backdrop-blur text-sm font-bold text-slate-300">
                      <span className="text-lg">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg font-mono">Day {dayIdx + 1}</span>
                    </div>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                      {sessions.map((session) => (
                        <div key={session.id} className="relative flex items-center group">
                          
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 shadow shrink-0 z-10 ${session.type === 'study' ? 'bg-emerald-500' : session.type === 'meal' ? 'bg-amber-500' : session.type === 'commitment' ? 'bg-purple-500' : 'bg-slate-700'}`}>
                            {session.type === 'study' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                          </div>
                          
                          <div className={`ml-6 w-full p-4 rounded-xl border backdrop-blur shadow-sm transition-all hover:-translate-y-1 ${session.type === 'study' ? 'border-emerald-500/30 bg-emerald-900/10' : session.type === 'meal' ? 'border-amber-500/30 bg-amber-900/10' : session.type === 'commitment' ? 'border-purple-500/30 bg-purple-900/10' : 'border-slate-700/50 bg-slate-800/40'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-semibold uppercase tracking-wider ${session.type === 'study' ? 'text-emerald-400' : session.type === 'meal' ? 'text-amber-400' : session.type === 'commitment' ? 'text-purple-400' : 'text-slate-400'}`}>
                                {session.duration}
                              </span>
                              <span className="text-slate-400 text-xs font-medium bg-slate-900/50 px-2 py-1 rounded">{session.time}</span>
                            </div>
                            <h4 className="text-slate-200 font-medium text-lg">{session.title}</h4>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                ))}
            </div>

            {/* AI Insights Sidebar */}
            <div className="space-y-6">
              <GlassCard className="border-t-4 border-t-amber-400">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> Performance Plan
                </h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li className="flex gap-2"><span className="text-amber-400">▸</span> {planData.performance_plan?.daily_revision}</li>
                  <li className="flex gap-2"><span className="text-amber-400">▸</span> {planData.performance_plan?.weekly_cycle}</li>
                  <li className="flex gap-2"><span className="text-amber-400">▸</span> {planData.performance_plan?.mistake_analysis}</li>
                  <li className="flex gap-2"><span className="text-amber-400">▸</span> {planData.performance_plan?.viva_prep}</li>
                </ul>
              </GlassCard>

              <GlassCard className="border-t-4 border-t-rose-400">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">❤️</span> Health & Energy Plan
                </h3>
                <ul className="space-y-3 text-slate-300 text-sm">
                  <li className="flex gap-2"><span className="text-rose-400">▸</span> {planData.health_plan?.hydration}</li>
                  <li className="flex gap-2"><span className="text-rose-400">▸</span> {planData.health_plan?.exercise}</li>
                  <li className="flex gap-2"><span className="text-rose-400">▸</span> {planData.health_plan?.sleep}</li>
                  <li className="flex gap-2"><span className="text-rose-400">▸</span> {planData.health_plan?.mental}</li>
                </ul>
              </GlassCard>

              <GlassCard className="border-t-4 border-t-indigo-400">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-2xl">🧠</span> Smart Recommendations
                </h3>
                <div className="space-y-3">
                  {planData.recommendations?.map((rec, i) => (
                    <div key={i} className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm">
                      {rec}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="border-t-4 border-t-emerald-400 text-center">
                <h3 className="text-lg font-bold text-slate-300 mb-2">Exam Prediction</h3>
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                  {planData.predictedScore?.toFixed(1)}%
                </div>
                <p className="text-slate-400 text-sm mt-2">Estimated score based on this intensive routine.</p>
              </GlassCard>
            </div>
            
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Planner;

