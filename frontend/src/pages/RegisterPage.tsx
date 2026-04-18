import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [depts, setDepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const { data } = await api.get('/departments/public');
        setDepts(data);
      } catch (err) {
        console.error('Failed to fetch departments');
      }
    };
    fetchDepts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { ...formData, role: 'EMPLOYEE' });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .reg-root { font-family: 'DM Sans', sans-serif; }
        .reg-input {
          width: 100%;
          background: #fff;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-input:focus {
          border-color: #a8a49c;
          box-shadow: 0 0 0 3px rgba(168,164,156,0.12);
        }
        .reg-input::placeholder { color: #c0bbb3; }
        .reg-select {
          width: 100%;
          background: #fff;
          border: 1px solid #e4dfd4;
          border-radius: 10px;
          padding: 11px 14px 11px 40px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a18;
          outline: none;
          appearance: none;
          cursor: pointer;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .reg-select:focus {
          border-color: #a8a49c;
          box-shadow: 0 0 0 3px rgba(168,164,156,0.12);
        }
        .reg-bg {
          background-color: #f5f2ec;
          background-image: radial-gradient(#d4cfc6 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="reg-root reg-bg min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <div
              className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
              style={{ background: '#1a1a18' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest">AttendanceIQ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-white border border-stone-200 rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}
          >
            <div className="px-8 pt-7 pb-6 border-b border-stone-100">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 font-medium transition-colors mb-5 group"
              >
                <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Login
              </Link>
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">Create account</h1>
              <p className="text-sm text-stone-400 mt-1">Join the attendance management system</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    className="reg-input"
                    placeholder="Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    className="reg-input"
                    placeholder="rohan@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                      type="password"
                      required
                      className="reg-input"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Department</label>
                  <div className="relative">
                    <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <select
                      required
                      className="reg-select"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Select dept</option>
                      {depts.map(d => (
                        <option key={d._id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
                style={{ background: '#1a1a18' }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#333330'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a18'; }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="px-8 pb-7 text-center">
              <p className="text-xs text-stone-400">
                Already have an account?{' '}
                <Link to="/login" className="text-stone-700 font-semibold hover:text-stone-900 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>

          <p className="text-center text-xs text-stone-400 mt-6">
            Secured with end-to-end encryption
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;