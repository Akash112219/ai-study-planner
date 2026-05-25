import React, { useState, useEffect } from 'react';
import { fetchAdminIssues, resolveAdminIssue } from '../../services/api';
import { ShieldAlert, CheckCircle, Clock, Key, MessageSquare, AlertCircle } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const UserIssues = () => {
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const data = await fetchAdminIssues();
      setIssues(data);
    } catch (err) {
      setError('Failed to load user issues.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePassword = async (issueId) => {
    setProcessingId(issueId);
    try {
      // Sending an empty object; the backend will parse the new password from the message
      await resolveAdminIssue(issueId, { status: 'resolved', reply: 'Password successfully updated.' });
      await loadIssues();
    } catch (err) {
      console.error(err);
      alert('Failed to approve password change.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (issueId) => {
    setProcessingId(issueId);
    try {
      await resolveAdminIssue(issueId, { status: 'rejected', reply: 'Request denied by administration.' });
      await loadIssues();
    } catch (err) {
      console.error(err);
      alert('Failed to reject request.');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-t-2 border-indigo-500 rounded-full mx-auto"></div></div>;
  if (error) return <div className="text-center py-20 text-rose-400"><AlertCircle className="w-12 h-12 mx-auto mb-4" />{error}</div>;

  const pendingIssues = issues.filter(i => i.status === 'pending');
  const resolvedIssues = issues.filter(i => i.status !== 'pending');

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white flex items-center gap-3">
          <ShieldAlert className="text-indigo-500 w-8 h-8" /> 
          User Issues & Requests
        </h2>
        <p className="text-slate-400">Review security requests and resolve user issues.</p>
      </header>

      <div className="space-y-8">
        
        {/* Pending Issues */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="text-amber-400 w-5 h-5" /> Action Required ({pendingIssues.length})
          </h3>
          
          {pendingIssues.length === 0 ? (
            <GlassCard className="p-10 text-center text-slate-400 flex flex-col items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500/50 mb-3" />
              <p>All caught up! No pending issues.</p>
            </GlassCard>
          ) : (
            <div className="grid gap-4">
              {pendingIssues.map(issue => (
                <GlassCard key={issue.id} className="p-6 border-l-4 border-amber-500">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {issue.type === 'password_change' ? (
                          <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20 flex items-center gap-1">
                            <Key className="w-3 h-3" /> PASSWORD CHANGE
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> {issue.type.toUpperCase()}
                          </span>
                        )}
                        <span className="text-slate-400 text-sm">Submitted by: <strong className="text-slate-200">{issue.user_email}</strong></span>
                        <span className="text-slate-500 text-sm">{new Date(issue.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      {issue.type === 'password_change' ? (
                        <p className="text-slate-300">
                          User requested a password reset. A new secure password has been provided.
                        </p>
                      ) : (
                        <p className="text-slate-300">
                          {issue.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button 
                        onClick={() => handleReject(issue.id)}
                        disabled={processingId === issue.id}
                        className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleApprovePassword(issue.id)}
                        disabled={processingId === issue.id}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {processingId === issue.id && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                        Approve & Apply
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </section>

        {/* Resolved Issues */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-400 w-5 h-5" /> Recent History
          </h3>
          
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-slate-800/50 text-slate-300 uppercase font-semibold text-xs">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Admin Reply</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {resolvedIssues.map(issue => (
                  <tr key={issue.id} className="hover:bg-slate-800/20 transition">
                    <td className="px-6 py-4 font-medium text-slate-300">{issue.user_email}</td>
                    <td className="px-6 py-4">
                      {issue.type === 'password_change' ? 'Password Reset' : issue.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        issue.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {issue.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 truncate max-w-[200px]">{issue.admin_reply || '-'}</td>
                    <td className="px-6 py-4">{new Date(issue.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {resolvedIssues.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">No resolved issues yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default UserIssues;
