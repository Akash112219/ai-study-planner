import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchUserProfile, submitIssue, uploadUserProfilePicture } from '../services/api';
import { User, Mail, Shield, AlertCircle, CheckCircle2, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'Loading...',
    email: 'Loading...',
    initials: '...',
    picture: null
  });
  
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    aiSuggestions: true,
    weeklyReport: false,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState(''); // 'idle', 'submitting', 'success', 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile({
          name: data.name,
          email: data.email,
          initials: data.name.substring(0, 2).toUpperCase(),
          picture: data.profile_picture
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    loadProfile();
  }, []);

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setPasswordStatus('error');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setPasswordStatus('error');
      return;
    }

    setPasswordStatus('submitting');
    try {
      await submitIssue('password_change', `REQUESTED_PASSWORD:${newPassword}`);
      setPasswordStatus('success');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordStatus('idle');
        setNewPassword('');
        setConfirmPassword('');
      }, 3000);
    } catch (err) {
      setErrorMsg("Failed to submit request.");
      setPasswordStatus('error');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const data = await uploadUserProfilePicture(file);
      setProfile(prev => ({ ...prev, picture: data.url }));
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload profile picture.");
    }
  };

  return (
    <DashboardLayout>
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold mb-3">Settings</h2>
          <p className="text-slate-400 text-lg">Manage your account, preferences, and security.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl">
        
        {/* Profile Section */}
        <div className="glass-panel p-6 lg:p-8 col-span-1 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            Profile Information
          </h3>
          
          <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-upload').click()}>
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
              
              {profile.picture ? (
                <img src={profile.picture.startsWith('http') ? profile.picture : `http://127.0.0.1:5000${profile.picture}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-slate-600 group-hover:border-emerald-400 transition-colors" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-3xl font-bold text-white border-2 border-slate-600 group-hover:border-emerald-400 transition-colors">
                  {profile.initials}
                </div>
              )}
              
              <div className="absolute inset-0 bg-slate-900/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                <div className="settings-info-box w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 font-medium">
                  {profile.name}
                </div>
                <p className="text-xs text-slate-500 mt-1">Username is generated based on your email.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <div className="settings-info-box w-full bg-slate-800/30 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-400 font-medium">
                  {profile.email}
                </div>
                <p className="text-xs text-slate-500 mt-1">Contact support to change your email address.</p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-700/50">
            <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Password & Security
            </h4>
            <p className="text-sm text-slate-400 mb-4">
              To ensure account security, password changes require admin approval. Click below to submit a secure request.
            </p>
            <button 
              onClick={() => setIsPasswordModalOpen(true)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-white transition-colors font-medium shadow-lg"
            >
              Request Password Change
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8 col-span-1">
          {/* Theme Preferences */}
          <div className="glass-panel p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              Theme Appearance
            </h3>
            
            <div className="space-y-3">
              {['dark', 'light', 'system'].map((t) => (
                <label key={t} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${theme === t ? 'bg-teal-500/10 border-teal-500/50' : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="theme" 
                      value={t} 
                      checked={theme === t}
                      onChange={(e) => setTheme(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${theme === t ? 'border-teal-400' : 'border-slate-500'}`}>
                      {theme === t && <div className="w-2.5 h-2.5 rounded-full bg-teal-400"></div>}
                    </div>
                    <span className="capitalize text-slate-200">{t} Mode</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="glass-panel p-6 relative overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              Notifications
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'studyReminders', title: 'Study Reminders', desc: 'Push notifications before sessions' },
                { key: 'aiSuggestions', title: 'AI Suggestions', desc: 'Alerts when schedule is optimized' },
                { key: 'weeklyReport', title: 'Weekly Reports', desc: 'Email summaries of your progress' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification(item.key)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${notifications[item.key] ? 'bg-indigo-500' : 'bg-slate-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform absolute shadow-md ${notifications[item.key] ? 'translate-x-6' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" /> Secure Request
                </h3>
                <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {passwordStatus === 'success' ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">Request Sent!</h4>
                    <p className="text-slate-400 text-sm">
                      Your password change request has been securely forwarded to the administration. It will take effect once approved.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <p className="text-sm text-slate-400 mb-6">
                      Enter your desired new password. An admin will review and approve your request shortly.
                    </p>
                    
                    {passwordStatus === 'error' && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg flex items-center gap-2 text-rose-400 text-sm">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsPasswordModalOpen(false)}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={passwordStatus === 'submitting'}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                      >
                        {passwordStatus === 'submitting' ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : 'Submit Request'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Settings;
