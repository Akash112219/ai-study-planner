import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { fetchUserProfile } from '../services/api';
import { User, Mail, Lock, KeyRound, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
        setUsername(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    // Mock API call
    setTimeout(() => {
      alert("Profile details updated successfully!");
      setIsUpdatingProfile(false);
    }, 1000);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    setIsUpdatingPassword(true);
    // Mock API call
    setTimeout(() => {
      alert("Password updated successfully!");
      setCurrentPassword('');
      setNewPassword('');
      setIsUpdatingPassword(false);
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert("A password reset link has been sent to your email address.");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <header className="mb-8">
        <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
          Account Profile
        </h2>
        <p className="text-slate-400 text-lg">Manage your personal details and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Card (Left Column) */}
        <div className="lg:col-span-4">
          <div className="glass-panel p-8 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full pointer-events-none"></div>
            <img 
              src={profile?.profile_picture || "https://api.dicebear.com/7.x/notionists/svg?seed=Default&backgroundColor=10b981"} 
              alt="Profile avatar" 
              className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4"
            />
            <h3 className="text-2xl font-bold text-white mb-1">{profile?.name}</h3>
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Premium Member
            </p>
            
            <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-left space-y-3">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold">Joined</span>
                <p className="text-slate-300 font-medium">{profile?.joined_date}</p>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-xs text-slate-500 uppercase font-bold">Total Tests</span>
                <p className="text-slate-300 font-medium">{profile?.total_tests} Attempts</p>
              </div>
              <div className="pt-2 border-t border-slate-700">
                <span className="text-xs text-slate-500 uppercase font-bold">Avg Score</span>
                <p className="text-emerald-400 font-bold">{profile?.average_score}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Forms (Right Column) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* General Information Form */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
              <User className="w-5 h-5 text-indigo-400" />
              General Information
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6 relative z-10">
              <div>
                <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                  User Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                  Email Address (Gmail/etc)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Form */}
          <div className="glass-panel p-8 relative overflow-hidden">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-700/50 pb-4">
              <Lock className="w-5 h-5 text-rose-400" />
              Security Settings
            </h3>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6 relative z-10">
              <div>
                <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2 flex items-center gap-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  type="submit" 
                  disabled={isUpdatingPassword}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold border border-slate-600 transition-all disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </button>
                
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
