import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Search, Loader2, ArrowLeft, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AttendanceLogs: React.FC = () => {
  const { user, employee } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/attendance' : `/attendance/${employee._id}`;
      const { data } = await api.get(endpoint);
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [employee?._id, isAdmin]);

  const filteredLogs = logs.filter(log => {
    const searchStr = searchTerm.toLowerCase();
    const empName = log.employee?.name?.toLowerCase() || '';
    const dateStr = new Date(log.date).toLocaleDateString().toLowerCase();
    const status = log.status?.toLowerCase() || '';
    return empName.includes(searchStr) || dateStr.includes(searchStr) || status.includes(searchStr);
  });

  const fmtTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fmtDate = (date: Date | string) =>
    new Date(date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const statusStyle = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'LEAVE':   return 'bg-blue-50 text-blue-700 border border-blue-200';
      default:        return 'bg-red-50 text-red-600 border border-red-200';
    }
  };

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#f5f2ec' }}>
      <div className="max-w-6xl mx-auto space-y-6">
      
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="group flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-wider mb-2"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <h1 className="text-3xl font-light text-stone-900 tracking-tight">
              Attendance <span className="font-semibold">History Logs</span>
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {isAdmin ? 'Complete overview of organization-wide attendance.' : 'Detailed record of your check-in history.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-all">
                <Download size={14} />
                Export CSV
             </button>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name, date, or status..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/5 transition-all text-stone-800 placeholder:text-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-600 hover:bg-stone-50 transition-all">
                <Filter size={15} />
                Filters
             </button>
             <button 
               onClick={fetchLogs}
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition-all"
             >
                Refresh
             </button>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">Date</th>
                  {isAdmin && <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">Employee</th>}
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">Check In</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100">Check Out</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 text-right">Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-20 text-center">
                       <Loader2 className="animate-spin text-stone-400 mx-auto" size={32} />
                       <p className="text-sm text-stone-400 mt-4">Fetching logs...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  <AnimatePresence>
                    {filteredLogs.map((record, i) => (
                      <motion.tr 
                        key={record._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.5) }}
                        className="hover:bg-stone-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                           <p className="text-sm font-semibold text-stone-800">{fmtDate(record.date)}</p>
                           <p className="text-[10px] text-stone-400 uppercase mt-0.5 tracking-wide">Regular Shift</p>
                        </td>
                        {isAdmin && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-600">
                                {record.employee?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-stone-800">{record.employee?.name}</p>
                                <p className="text-[10px] text-stone-400">ID: #{record.employee?._id?.slice(-6)}</p>
                              </div>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${statusStyle(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${record.checkInTime ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-stone-200'}`} />
                             <span className={`text-sm font-medium ${record.checkInTime ? 'text-stone-700' : 'text-stone-300'}`}>
                               {record.checkInTime ? fmtTime(record.checkInTime) : '-- : --'}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${record.checkOutTime ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' : 'bg-stone-200'}`} />
                             <span className={`text-sm font-medium ${record.checkOutTime ? 'text-stone-700' : 'text-stone-300'}`}>
                               {record.checkOutTime ? fmtTime(record.checkOutTime) : '-- : --'}
                             </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-sm font-bold text-stone-900 font-mono">
                             {record.totalHours !== undefined && record.totalHours !== null ? record.totalHours.toFixed(2) : '0.00'}
                             <span className="text-[10px] text-stone-400 font-sans font-normal ml-1">HRS</span>
                           </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="py-20 text-center text-stone-400">
                       <Calendar size={40} className="mx-auto mb-4 opacity-10" />
                       <p className="text-sm font-medium">No attendance records found.</p>
                       <p className="text-xs mt-1">Try adjusting your search filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
             <p className="text-xs text-stone-500 font-medium">
                Showing {filteredLogs.length} records total
             </p>
             <div className="flex items-center gap-1.5">
                <button disabled className="px-3 py-1.5 text-[10px] font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase cursor-not-allowed">Prev</button>
                <div className="w-px h-3 bg-stone-200 mx-1" />
                <button disabled className="px-3 py-1.5 text-[10px] font-bold text-stone-400 hover:text-stone-600 transition-colors uppercase cursor-not-allowed">Next</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceLogs;
