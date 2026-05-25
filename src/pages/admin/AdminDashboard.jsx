import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/Layout/AdminLayout';
import { fetchAdminStats } from '../../services/api';
import { Users, FileText, Activity, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel p-6 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform">
    <div className={`absolute -right-6 -top-6 text-${color}-500/10 group-hover:text-${color}-500/20 transition-colors duration-500`}>
      {icon}
    </div>
    <h4 className="text-slate-400 text-sm font-medium mb-1">{title}</h4>
    <div className="text-4xl font-bold text-white mb-2">{value}</div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_exams: 0, total_plans: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <AdminLayout>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ShieldCheck className="text-indigo-400" />
          System Overview
        </h2>
        <p className="text-slate-400">Real-time metrics and platform health.</p>
      </header>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center text-slate-400">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Registered Users" value={stats.total_users} icon={<Users className="w-24 h-24" />} color="indigo" />
          <StatCard title="Total Mock Exams Taken" value={stats.total_exams} icon={<Activity className="w-24 h-24" />} color="purple" />
          <StatCard title="AI Plans Generated" value={stats.total_plans} icon={<FileText className="w-24 h-24" />} color="emerald" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Platform Activity</h3>
          <div className="h-48 border border-dashed border-slate-700 flex items-center justify-center text-slate-500 rounded-xl">
            [Chart Area Placeholder]
          </div>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent System Logs</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
              <span>Admin access granted to test@admin.com</span>
              <span className="text-slate-500">2 mins ago</span>
            </li>
            <li className="flex justify-between items-center text-slate-300 border-b border-slate-800 pb-2">
              <span>Database backup completed successfully</span>
              <span className="text-slate-500">1 hour ago</span>
            </li>
            <li className="flex justify-between items-center text-slate-300">
              <span>New feature flag toggled: "Premium Quiz"</span>
              <span className="text-slate-500">Yesterday</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
