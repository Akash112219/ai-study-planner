import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { fetchProgress, fetchStudyPlans, fetchUserProfile } from '../services/api';
import { Mail, Calendar, Book, Activity, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, trend, isPositive, icon }) => (
  <div className="glass-panel p-5 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
    <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-emerald-500/10 transition-colors duration-500">
      {icon}
    </div>
    <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}></path>
      </svg>
      {trend} vs last week
    </div>
  </div>
);

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [progress, setProgress] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [plansData, progressData, profileData] = await Promise.all([
          fetchStudyPlans(),
          fetchProgress(),
          fetchUserProfile()
        ]);
        setPlans(plansData);
        setProgress(progressData);
        setUserProfile(profileData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Compute stats based on actual data
  const totalHours = progress.reduce((sum, p) => sum + parseFloat(p.hours_per_day), 0).toFixed(1);
  const totalPlans = plans.length;
  
  const avgScore = progress.length > 0 
    ? (progress.reduce((sum, p) => sum + p.performance_score, 0) / progress.length).toFixed(1) 
    : 0;

  // Get the next up task from the most recent plan
  let upNext = null;
  if (plans.length > 0) {
    try {
      const latestPlanContent = JSON.parse(plans[0].content);
      if (latestPlanContent.schedule && latestPlanContent.schedule.length > 0) {
        upNext = latestPlanContent.schedule[0];
      }
    } catch (e) {
      console.error("Failed to parse plan content", e);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center text-slate-400">Loading Dashboard Data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-white">
            Welcome back, {userProfile?.name || 'Student'}
          </h2>
          <p className="text-emerald-300/80 text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI is currently optimizing your next 24 hours.
          </p>
        </div>
        <Link to="/planner">
          <button className="btn-primary py-2.5 px-6 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
            Generate New Plan
          </button>
        </Link>
      </header>

      {/* User Profile Card */}
      {userProfile && (
        <div className="glass-panel p-6 mb-8 border-l-4 border-indigo-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <img 
              src={userProfile.profile_picture} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">{userProfile.name}</h3>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400 text-sm mb-4">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {userProfile.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {userProfile.joined_date}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <div className="text-center px-4 border-r border-slate-700">
                <div className="flex items-center gap-1 text-slate-400 text-xs uppercase font-bold mb-1"><Book className="w-4 h-4" /> Subjects</div>
                <div className="text-xl font-bold text-indigo-400">{userProfile.subjects_count}</div>
              </div>
              <div className="text-center px-4 border-r border-slate-700">
                <div className="flex items-center gap-1 text-slate-400 text-xs uppercase font-bold mb-1"><CheckCircle className="w-4 h-4" /> Tests</div>
                <div className="text-xl font-bold text-teal-400">{userProfile.total_tests}</div>
              </div>
              <div className="text-center px-4">
                <div className="flex items-center gap-1 text-slate-400 text-xs uppercase font-bold mb-1"><Activity className="w-4 h-4" /> Avg Score</div>
                <div className="text-xl font-bold text-emerald-400">{userProfile.average_score}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Study Hours Logged" 
          value={`${totalHours}h`} 
          trend="Total" 
          isPositive={true}
          icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path></svg>}
        />
        <StatCard 
          title="Plans Created" 
          value={totalPlans} 
          trend="Total" 
          isPositive={true}
          icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>}
        />
        <StatCard 
          title="Avg Focus Score" 
          value={`${avgScore}%`} 
          trend="Predicted" 
          isPositive={true}
          icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>}
        />
        <StatCard 
          title="Burnout Risk" 
          value={avgScore > 80 ? "Low" : (avgScore > 50 ? "Medium" : "High")} 
          trend="ML AI" 
          isPositive={avgScore > 50}
          icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart / Progress Area */}
        <div className="glass-panel p-6 col-span-1 lg:col-span-2 relative overflow-hidden group">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-slate-100">Study Output vs Optimal Focus</h3>
            <select className="bg-slate-800/50 border border-slate-700 text-sm rounded-lg px-3 py-1.5 text-slate-300 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          {/* Mocked Chart Visualization using CSS */}
          <div className="h-64 flex items-end gap-3 px-2 pt-8 pb-4 relative border-b border-l border-slate-700/50">
            {/* Grid lines */}
            <div className="absolute w-full border-b border-slate-700/30 bottom-1/3 left-0"></div>
            <div className="absolute w-full border-b border-slate-700/30 bottom-2/3 left-0"></div>
            <div className="absolute w-full border-b border-slate-700/30 top-0 left-0"></div>
            
            {/* Bars */}
            {[40, 70, 50, 90, 60, 30, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center group/bar h-full z-10">
                <div className="w-full max-w-sm bg-gradient-to-t from-emerald-600/50 to-teal-400 hover:from-emerald-500 hover:to-teal-300 transition-all duration-300 rounded-t-sm relative cursor-pointer" style={{ height: `${height}%` }}>
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {height / 10} hours
                  </div>
                </div>
                <div className="mt-2 text-xs text-slate-400 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Insights & Next Task */}
        <div className="flex flex-col gap-6">
          
          {/* AI Insights Card */}
          <div className="glass-panel p-6 relative overflow-hidden flex-1 border-t-2 border-t-emerald-400 shadow-[0_-5px_20px_rgba(16,185,129,0.15)]">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              AI Insights
            </h3>
            
            <div className="space-y-4">
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your retention drops by <strong className="text-rose-400">22%</strong> after 90 minutes of continuous study. AI has scheduled 10-minute micro-breaks for today's sessions.
                </p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                <p className="text-sm text-slate-300 leading-relaxed">
                  You scored exceptionally well in Calculus. Diverting 45 mins from Math to Physics to balance your mastery levels.
                </p>
              </div>
            </div>
          </div>

          {/* Up Next Card */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-teal-300 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Up Next
            </h3>
            
            {upNext ? (
              <div className="flex flex-col gap-1 mb-4">
                <div className="text-2xl font-bold text-white">{upNext.title}</div>
                <div className="text-emerald-400 font-medium">{upNext.time} • {upNext.duration}</div>
                <p className="text-slate-400 text-sm mt-2">Next up in your latest AI-generated study plan.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 mb-4">
                <div className="text-lg font-bold text-slate-400">No upcoming tasks</div>
                <p className="text-slate-500 text-sm mt-2">Generate a plan to see your next tasks here.</p>
              </div>
            )}
            
            <Link to="/planner">
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors border border-white/10 flex justify-center items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {upNext ? "Start Session Now" : "Create Plan"}
              </button>
            </Link>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
