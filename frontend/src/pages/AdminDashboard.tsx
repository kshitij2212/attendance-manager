import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, UserCheck, UserMinus, ClipboardList, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/attendance/stats');
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-stone-300" size={28} />
    </div>
  );

  const stats = [
    {
      name: 'Total Employees',
      value: data?.stats?.totalEmployees ?? 0,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      sub: '+2 from last month',
    },
    {
      name: 'Present Today',
      value: data?.stats?.presentToday ?? 0,
      icon: UserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      sub: '98% attendance rate',
    },
    {
      name: 'On Leave',
      value: data?.stats?.onLeaveToday ?? 0,
      icon: UserMinus,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      sub: '3 scheduled today',
    },
    {
      name: 'Pending Leaves',
      value: data?.stats?.pendingLeaves ?? 0,
      icon: ClipboardList,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      sub: 'Requires attention',
    },
  ];

  const avatarColors = [
    { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { bg: 'bg-blue-50',    text: 'text-blue-700'    },
    { bg: 'bg-amber-50',   text: 'text-amber-700'   },
    { bg: 'bg-rose-50',    text: 'text-rose-700'    },
    { bg: 'bg-stone-100',  text: 'text-stone-600'   },
  ];
  const getAvatarColor = (name: string) =>
    avatarColors[(name?.charCodeAt(0) ?? 0) % avatarColors.length];

  const quickActions = [
    { label: 'Add New Employee',       path: '/admin/employees' },
    { label: 'Review Leave Requests',  path: '/admin/leaves'    },
    { label: 'View Attendance',        path: '/admin/attendance'},
  ];

  return (
    <div
      className="space-y-8 p-8"
      style={{ fontFamily: "'DM Sans', sans-serif", background: '#f5f2ec', minHeight: '100%' }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');`}</style>

      <div>
        <h2 className="text-3xl font-light tracking-tight text-stone-900">
          Admin <span className="font-semibold">Dashboard</span>
        </h2>
        <p className="text-sm text-stone-500 mt-1">Here's what's happening across your organisation today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.3 }}
              className="bg-white border border-stone-200 rounded-2xl px-5 py-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.iconBg} ${stat.iconColor} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  <Icon size={18} />
                </div>
              </div>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">{stat.name}</p>
              <p className="text-3xl font-semibold text-stone-900 mt-1" style={{ fontFamily: "'DM Mono', monospace" }}>
                {stat.value}
              </p>
              <p className="text-xs text-stone-400 mt-2">{stat.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-900">Today's Attendance</h3>
            <button
              onClick={() => navigate('/admin/attendance')}
              className="text-xs text-stone-500 font-medium hover:text-stone-800 transition-colors flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {data?.recentAttendance?.length > 0 ? (
              data.recentAttendance.map((record: any) => {
                const av = getAvatarColor(record.employee?.name || 'U');
                return (
                  <div
                    key={record._id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${av.bg} ${av.text} flex items-center justify-center text-xs font-semibold shrink-0`}>
                        {record.employee?.name?.[0]?.toUpperCase() ?? 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-800">{record.employee?.name}</p>
                        <p className="text-xs text-stone-400">ID: #{record.employee?._id?.slice(-6)}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div className="text-right">
                        <p
                          className="text-sm font-medium text-emerald-600"
                          style={{ fontFamily: "'DM Mono', monospace" }}
                        >
                          {record.checkInTime
                            ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">check in</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        PRESENT
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center text-sm text-stone-400">
                No activity recorded yet today.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-stone-200 rounded-2xl px-5 py-4">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-1">Today</p>
            <p className="text-lg font-semibold text-stone-900">
              {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-stone-100">
              <h3 className="text-base font-semibold text-stone-900">Quick Actions</h3>
              <p className="text-xs text-stone-400 mt-0.5">Navigate to key sections fast.</p>
            </div>
            <div className="px-3 py-3 space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-stone-600 font-medium hover:bg-stone-50 hover:text-stone-900 transition-all text-left group"
                >
                  {action.label}
                  <ArrowRight size={13} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;