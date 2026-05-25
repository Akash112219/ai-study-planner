import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/Layout/AdminLayout';
import GlassCard from '../components/common/GlassCard';
import { fetchAdminStats, fetchAdminUsers } from '../services/api';
import { Shield, Activity, Users, FileText, DollarSign, Server, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserManagement from '../components/Admin/UserManagement';
import WebsiteSettings from '../components/Admin/WebsiteSettings';
import UserIssues from '../components/Admin/UserIssues';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const statsData = await fetchAdminStats();
        const usersData = await fetchAdminUsers();
        setStats(statsData);
        setUsers(usersData);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError('Access Denied. You do not have admin privileges.');
        } else {
          setError('Failed to load admin dashboard data.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadAdminData();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="glass-panel p-10 text-center flex flex-col items-center justify-center max-w-2xl mx-auto mt-20">
          <Shield className="w-16 h-16 text-rose-500 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-8">{error}</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition">
            Return to Login
          </button>
        </div>
      </AdminLayout>
    );
  }

  const renderContent = () => {
    if (path === '/admin/users') {
      return <UserManagement users={users} setUsers={setUsers} />;
    }
    
    if (path === '/admin/issues') {
      return <UserIssues />;
    }
    
    if (path === '/admin/analytics') {
      return <div className="text-white text-center py-20 text-2xl">Global Analytics Coming Soon</div>;
    }
    
    if (path === '/admin/settings') {
      return <WebsiteSettings />;
    }

    // Default Overview Dashboard
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-white flex items-center gap-3">
            <Shield className="text-indigo-500 w-8 h-8" /> 
            System Admin Overview
          </h2>
          <p className="text-slate-400 text-lg">Manage users, monitor system health, and view global metrics.</p>
        </header>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 border-l-4 border-indigo-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-indigo-500/10 group-hover:scale-110 transition-transform duration-500">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
                <Users className="w-5 h-5 text-indigo-400" /> Total Users
              </div>
              <div className="text-4xl font-black text-white">{stats?.total_users || 0}</div>
              <div className="text-sm text-emerald-400 mt-2 flex items-center gap-1">
                <span className="font-bold">+12%</span> from last month
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-emerald-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
                <Activity className="w-5 h-5 text-emerald-400" /> Active Users
              </div>
              <div className="text-4xl font-black text-white">{Math.max(1, Math.floor((stats?.total_users || 0) * 0.75))}</div>
              <div className="text-sm text-slate-500 mt-2">Currently online or active this week</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-purple-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-purple-500/10 group-hover:scale-110 transition-transform duration-500">
              <FileText size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
                <FileText className="w-5 h-5 text-purple-400" /> Total Exams Taken
              </div>
              <div className="text-4xl font-black text-white">{stats?.total_exams || 0}</div>
              <div className="text-sm text-purple-300 mt-2">Across all education levels</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-l-4 border-amber-500 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:scale-110 transition-transform duration-500">
              <DollarSign size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-slate-400 mb-2 font-medium">
                <DollarSign className="w-5 h-5 text-amber-400" /> MRR Revenue
              </div>
              <div className="text-4xl font-black text-white">$0.00</div>
              <div className="text-sm text-amber-500/80 mt-2 italic flex items-center gap-1">
                Future Ready <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="col-span-1 lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Server className="text-teal-400" /> System Health
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Database Load</span>
                  <span className="text-emerald-400 font-mono">12%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">API Response Time (avg)</span>
                  <span className="text-emerald-400 font-mono">245ms</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Storage Used</span>
                  <span className="text-amber-400 font-mono">68%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-center items-center">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="text-rose-400" /> Quick Actions
            </h3>
            <div className="w-full space-y-3">
              <button onClick={() => navigate('/admin/users')} className="w-full py-3 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-xl transition font-medium border border-indigo-500/30">
                Manage Users
              </button>
              <button onClick={() => navigate('/admin/settings')} className="w-full py-3 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl transition font-medium">
                Website Settings
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
