import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Plus, X, Check, XCircle, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const LeaveManagement: React.FC = () => {
  const { user, employee } = useAuth();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'CASUAL'
  });

  const isAdmin = user?.role === 'ADMIN';

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/leaves' : `/leaves/employee/${employee._id}`;
      const { data } = await api.get(endpoint);
      setLeaves(isAdmin ? data.allleaves : data.leave);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employee?._id || isAdmin) fetchLeaves();
  }, [employee?._id, isAdmin]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("End date can't be earlier than start date");
        return;
    }
    
    try {
      await api.post('/leaves/apply', { ...formData, employeeId: employee._id });
      toast.success('Leave applied successfully');
      setShowApplyModal(false);
      setFormData({ startDate: '', endDate: '', reason: '', leaveType: 'CASUAL' });
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply for leave');
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    setActionLoading(id);
    try {
      if (action === 'approve') {
        await api.put(`/leaves/approve/${id}`, {});
        toast.success('Leave approved');
      } else {
        await api.put(`/leaves/reject/${id}`, {});
        toast.error('Leave rejected');
      }
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'PENDING':  return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:         return 'bg-red-50 text-red-600 border border-red-200';
    }
  };

  const leaveTypeStyle = (type: string) => {
    switch (type) {
      case 'SICK':   return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'EARNED': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:       return 'bg-stone-100 text-stone-600 border border-stone-200';
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .lm-root { font-family: 'DM Sans', sans-serif; }
        .lm-input {
          width: 100%;
          background: #f5f2ec;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .lm-input:focus { border-color: #a8a49c; background: #fff; }
        .lm-input::placeholder { color: #b0aca4; }
        .lm-select {
          width: 100%;
          background: #f5f2ec;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .lm-select:focus { border-color: #a8a49c; background: #fff; }
        .lm-textarea {
          width: 100%;
          background: #f5f2ec;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          resize: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .lm-textarea:focus { border-color: #a8a49c; background: #fff; }
        .lm-textarea::placeholder { color: #b0aca4; }
      `}</style>

      <div className="lm-root space-y-8" style={{ background: '#f5f2ec', minHeight: '100%', padding: '2rem' }}>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-stone-900">
              Leave <span className="font-semibold">Management</span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {isAdmin ? 'Review and manage employee leave requests.' : 'Apply for leaves and track your requests.'}
            </p>
          </div>
          {!isAdmin && (
            <button
              onClick={() => setShowApplyModal(true)}
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
            >
              <Plus size={16} />
              Apply for Leave
            </button>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-900">Leave Requests</h3>
            <span className="text-xs text-stone-400 bg-stone-50 border border-stone-200 px-3 py-1 rounded-full">
              {leaves.length} {leaves.length === 1 ? 'request' : 'requests'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50">
                  {isAdmin && <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Employee</th>}
                  <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Dates</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Days</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-14 text-sm text-stone-400">
                      <Loader2 className="animate-spin inline mr-2 text-stone-300" size={16} />
                      Loading requests...
                    </td>
                  </tr>
                ) : leaves.length > 0 ? (
                  <AnimatePresence>
                    {leaves.map((leave) => (
                      <motion.tr
                        key={leave._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                      >
                        {isAdmin && (
                          <td className="px-6 py-4 text-sm font-semibold text-stone-800">
                            {leave.employee?.name}
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${leaveTypeStyle(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-stone-800" style={{ fontFamily: "'DM Mono', monospace" }}>
                            {new Date(leave.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            to {new Date(leave.endDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-stone-800">
                          {leave.totalDays}d
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${statusStyle(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isAdmin && leave.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                disabled={actionLoading === leave._id}
                                onClick={() => handleAction(leave._id, 'approve')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-all disabled:opacity-50"
                              >
                                {actionLoading === leave._id
                                  ? <Loader2 className="animate-spin" size={12} />
                                  : <Check size={12} />}
                                Approve
                              </button>
                              <button
                                disabled={actionLoading === leave._id}
                                onClick={() => handleAction(leave._id, 'reject')}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                              >
                                {actionLoading === leave._id
                                  ? <Loader2 className="animate-spin" size={12} />
                                  : <XCircle size={12} />}
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-stone-400 font-medium">
                              {leave.status !== 'PENDING' ? '—' : 'View'}
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center py-16 text-sm text-stone-400">
                      No leave requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="lm-root relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center">
                    <ClipboardList size={15} className="text-stone-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">Apply for Leave</h3>
                    <p className="text-xs text-stone-400 mt-0.5">Submit a new leave request</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleApply} className="px-7 py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Start Date</label>
                    <input
                      type="date"
                      required
                      className="lm-input"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">End Date</label>
                    <input
                      type="date"
                      required
                      className="lm-input"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Leave Type</label>
                  <select
                    className="lm-select"
                    value={formData.leaveType}
                    onChange={e => setFormData({ ...formData, leaveType: e.target.value })}
                  >
                    <option value="CASUAL">Casual Leave</option>
                    <option value="SICK">Sick Leave</option>
                    <option value="EARNED">Earned Leave</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Reason</label>
                  <textarea
                    required
                    rows={4}
                    className="lm-textarea"
                    placeholder="Describe your reason for leave..."
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  />
                </div>

                <div className="pt-2 flex gap-3 border-t border-stone-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold transition-all active:scale-95"
                  >
                    Send Request
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaveManagement;