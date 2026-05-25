import React, { useState } from 'react';
import GlassCard from '../common/GlassCard';
import { updateAdminUserRole, deleteAdminUser, banAdminUser, editAdminUser } from '../../services/api';
import { Users, Trash2, Edit2, Shield, ShieldOff, Search, Eye, X } from 'lucide-react';

const UserManagement = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: '', role: 'user' });

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toString().includes(searchTerm)
  );

  const handleBanToggle = async (userId) => {
    try {
      const res = await banAdminUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, is_banned: res.is_banned } : u));
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to toggle ban status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await deleteAdminUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await editAdminUser(selectedUser.id, editForm);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...res.user } : u));
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update user');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Controls Header */}
      <GlassCard className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-indigo-500">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="text-indigo-400" /> User Directory
        </h3>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </GlassCard>

      {/* Main Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/50 text-slate-400 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status & Role</th>
                <th className="px-6 py-4 text-center">Activity</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-medium ${user.is_banned ? 'text-rose-400/50 line-through' : 'text-slate-200'}`}>
                        {user.email}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">ID: #{user.id}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}>
                        {user.role}
                      </span>
                      {user.is_banned && (
                        <span className="px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                          <ShieldOff className="w-3 h-3" /> Banned
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-1 text-xs">
                      <div className="flex justify-between w-24">
                        <span className="text-slate-500">Exams:</span>
                        <span className="font-bold text-emerald-400">{user.exams_count}</span>
                      </div>
                      <div className="flex justify-between w-24">
                        <span className="text-slate-500">Plans:</span>
                        <span className="font-bold text-indigo-400">{user.plans_count}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never logged in'}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleBanToggle(user.id)}
                        className={`p-2 rounded-lg transition ${
                          user.is_banned 
                            ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white'
                        }`}
                        title={user.is_banned ? "Unban User" : "Ban User"}
                      >
                        {user.is_banned ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:text-white hover:bg-rose-500 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-slate-600 mb-4" />
                      <p>No users found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" /> Edit User Profile
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                <select 
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="user">User (Student)</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
