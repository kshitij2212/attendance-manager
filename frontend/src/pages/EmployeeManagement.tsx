import React, { useEffect, useState } from 'react';
import api from '../api';
import { UserPlus, Search, Edit2, Trash2, Mail, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLOYEE',
    department: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments/public')
      ]);
      setEmployees(empRes.data);
      setDepts(deptRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('Employee created successfully');
      setShowAddModal(false);
      setFormData({ name: '', email: '', password: '', role: 'EMPLOYEE', department: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) =>
    name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const avatarColors = [
    { bg: 'bg-emerald-50', text: 'text-emerald-700' },
    { bg: 'bg-blue-50',    text: 'text-blue-700'    },
    { bg: 'bg-amber-50',   text: 'text-amber-700'   },
    { bg: 'bg-rose-50',    text: 'text-rose-700'    },
    { bg: 'bg-stone-100',  text: 'text-stone-600'   },
  ];

  const getAvatarColor = (name: string) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .em-root { font-family: 'DM Sans', sans-serif; }
        .em-input {
          width: 100%;
          background: #f5f2ec;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          transition: border-color 0.15s;
        }
        .em-input:focus { border-color: #a8a49c; background: #fff; }
        .em-input::placeholder { color: #b0aca4; }
        .em-select {
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
          transition: border-color 0.15s;
        }
        .em-select:focus { border-color: #a8a49c; background: #fff; }
      `}</style>

      <div className="em-root space-y-8" style={{ background: '#f5f2ec', minHeight: '100%', padding: '2rem' }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-stone-900">
              Employee <span className="font-semibold">Management</span>
            </h2>
            <p className="text-sm text-stone-500 mt-1">Manage your workforce and organisation structure.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-700 active:scale-95 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl flex items-center gap-3 px-4 py-3">
          <Search size={16} className="text-stone-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent border-none outline-none w-full text-sm text-stone-800 placeholder:text-stone-400 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-stone-400 hover:text-stone-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-semibold text-stone-900">All Employees</h3>
            <span className="text-xs text-stone-400 bg-stone-50 border border-stone-200 px-3 py-1 rounded-full">
              {filteredEmployees.length} {filteredEmployees.length === 1 ? 'member' : 'members'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50">
                  {['Employee', 'Role', 'Department', 'Actions'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-6 py-3 text-[10px] font-semibold text-stone-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-14 text-sm text-stone-400">
                      Loading employees...
                    </td>
                  </tr>
                ) : filteredEmployees.length > 0 ? (
                  <AnimatePresence>
                    {filteredEmployees.map((emp) => {
                      const av = getAvatarColor(emp.name);
                      const isAdmin = emp.user?.role === 'ADMIN';
                      return (
                        <motion.tr
                          key={emp._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-t border-stone-100 hover:bg-stone-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl ${av.bg} ${av.text} flex items-center justify-center text-xs font-semibold shrink-0`}>
                                {getInitials(emp.name)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-stone-900">{emp.name}</p>
                                <p className="text-xs text-stone-400">{emp.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-semibold px-2 py-1 rounded-md border ${
                              isAdmin
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {emp.user?.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-stone-500 font-medium">
                            {emp.department?.name || <span className="text-stone-300">—</span>}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all">
                                <Edit2 size={14} />
                              </button>
                              <button className="p-2 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-14 text-sm text-stone-400">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2 }}
              className="em-root relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-semibold text-stone-900">Add New Employee</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Fill in the details to create an account.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="px-7 py-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    className="em-input"
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      className="em-input"
                      style={{ paddingLeft: '2.25rem' }}
                      placeholder="rohan@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Password</label>
                  <input
                    type="password"
                    required
                    className="em-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Role</label>
                  <select
                    className="em-select"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Department</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <select
                      className="em-select"
                      style={{ paddingLeft: '2.25rem' }}
                      value={formData.department}
                      onChange={e => setFormData({ ...formData, department: e.target.value })}
                      required
                    >
                      <option value="">Select a department</option>
                      {depts.map(d => (
                        <option key={d._id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-2 pt-2 flex gap-3 border-t border-stone-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-700 text-white text-sm font-semibold transition-all active:scale-95"
                  >
                    Create Account
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

export default EmployeeManagement;