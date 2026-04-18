import React, { useEffect, useState, useRef, useMemo } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Calendar, Play, Square, Loader2, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EmployeeDashboard: React.FC = () => {
  const { employee } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const fetchHistory = async () => {
    if (!employee?._id) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get(`/attendance/${employee._id}`);
      setHistory(data);
      const todayStr = new Date().toISOString().split('T')[0];
      const found = data.find((r: any) => {
          const recDate = new Date(r.date).toISOString().split('T')[0];
          return recDate === todayStr;
      });
      setTodayRecord(found);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast.error('Could not load attendance history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [employee?._id]);

  const handleAction = async (type: 'in' | 'out') => {
    if (!employee?._id) return;
    setActionLoading(true);
    try {
      if (type === 'in') {
        await api.post('/attendance/check-in', { employeeId: employee._id });
        toast.success('Checked in successfully');
      } else {
        await api.post('/attendance/check-out', { id: todayRecord._id });
        toast.success('Checked out successfully');
      }
      await fetchHistory();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const statsData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyRecords = history.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const presentDays = monthlyRecords.filter(r => r.status === 'PRESENT').length;
    const lateDays = monthlyRecords.filter(r => r.lateArrival).length;
    
    const usedLeaves = history.filter(r => r.status === 'LEAVE').length;
    const remainingLeaves = Math.max(0, 15 - usedLeaves);

    return [
      { label: 'Present Monthly', value: `${presentDays} Days`, icon: CheckCircle2, iconColor: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Late Arrivals',   value: `${lateDays} Occurrences`,  icon: AlertCircle,  iconColor: 'text-amber-600',   bg: 'bg-amber-50'   },
      { label: 'Remaining Leaves',value: `${remainingLeaves} Days`, icon: Calendar,     iconColor: 'text-blue-600',    bg: 'bg-blue-50'    },
    ];
  }, [history]);

  const fmtTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fmtDate = (date: Date | string) =>
    new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });

  const statusStyle = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'LEAVE':   return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:        return 'bg-red-50 text-red-600 border border-red-200';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-stone-400" size={28} />
    </div>
  );

  if (!employee) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 mb-4">
        <UserX size={32} />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">No Employee Profile Found</h3>
      <p className="text-stone-500 max-w-md">
        It looks like your account isn't linked to an employee profile. 
        If you are an administrator, please use the Admin Dashboard to manage the organization.
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen px-6 py-8"
      style={{ background: '#f5f2ec', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .dm-mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-stone-900">
              Good morning, <span className="font-semibold">{employee?.name?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="text-sm text-stone-500 mt-1">Here's your attendance overview for today.</p>
          </div>

          <div
            className="flex items-center gap-4 bg-white border border-stone-200 rounded-full px-5 py-2.5"
            style={{ boxShadow: 'none' }}
          >
            <div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Time</p>
              <p className="dm-mono text-sm font-medium text-stone-800">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="w-px h-7 bg-stone-200" />
            <div className="text-right">
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Date</p>
              <p className="dm-mono text-sm font-medium text-stone-800">{fmtDate(currentTime)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl overflow-hidden flex flex-col">
            <div className="flex-1 p-8">
              <h2 className="text-lg font-semibold text-stone-900 mb-1">Daily Attendance</h2>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                Mark your attendance for today. Check in when your shift starts and check out when you're done.
              </p>

              {!todayRecord ? (
                <button
                  onClick={() => handleAction('in')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 active:scale-95 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  {actionLoading
                    ? <Loader2 className="animate-spin" size={16} />
                    : <Play size={15} fill="white" />}
                  Check In
                </button>
              ) : !todayRecord.checkOutTime ? (
                <button
                  onClick={() => handleAction('out')}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all"
                >
                  {actionLoading
                    ? <Loader2 className="animate-spin" size={16} />
                    : <Square size={15} fill="white" />}
                  Check Out
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold px-6 py-3 rounded-xl">
                  <CheckCircle2 size={16} />
                  Completed for today
                </div>
              )}
            </div>

            <div className="bg-stone-50 border-t border-stone-100 grid grid-cols-3 divide-x divide-stone-100 px-2">
              {[
                {
                  label: 'Check In',
                  value: todayRecord?.checkInTime ? fmtTime(todayRecord.checkInTime) : '-- : --',
                  color: todayRecord?.checkInTime ? 'text-emerald-600' : 'text-stone-400',
                },
                {
                  label: 'Check Out',
                  value: todayRecord?.checkOutTime ? fmtTime(todayRecord.checkOutTime) : '-- : --',
                  color: todayRecord?.checkOutTime ? 'text-orange-600' : 'text-stone-400',
                },
                {
                  label: 'Hours',
                  value: todayRecord?.totalHours ? `${todayRecord.totalHours} hrs` : '0.00 hrs',
                  color: 'text-stone-800',
                },
              ].map((item) => (
                <div key={item.label} className="px-6 py-4">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className={`dm-mono text-base font-medium ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {statsData.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="bg-white border border-stone-200 rounded-2xl px-5 py-4 flex items-center gap-4"
                >
                  <div className={`${stat.bg} ${stat.iconColor} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-lg font-semibold text-stone-900">{stat.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-stone-900">Recent Activity</h3>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Last 3 records</p>
            </div>
            <button 
              onClick={() => navigate('/employee/history')}
              className="group flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-600 transition-colors"
            >
              View Full History
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50">
                  {['Date', 'Status', 'Check In', 'Check Out', 'Hours'].map((h) => (
                    <th key={h} className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest uppercase tracking-widest border-b border-stone-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <AnimatePresence>
                  {history.slice(0, 3).map((record) => (
                    <motion.tr
                      key={record._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-6 py-3.5 text-sm font-semibold text-stone-800">
                        {fmtDate(record.date)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${statusStyle(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${record.checkInTime ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-stone-200'}`} />
                        <span className="dm-mono text-sm text-stone-600">
                          {record.checkInTime ? fmtTime(record.checkInTime) : '-- : --'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${record.checkOutTime ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-stone-200'}`} />
                        <span className="dm-mono text-sm text-stone-600">
                          {record.checkOutTime ? fmtTime(record.checkOutTime) : '-- : --'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-bold text-stone-900 font-mono">
                        {record.totalHours !== undefined && record.totalHours !== null ? record.totalHours.toFixed(2) : <span className="text-stone-300 font-normal">—</span>}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmployeeDashboard;