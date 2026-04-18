import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user, data.employee);
      toast.success('Welcome back!');
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/employee');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .login-root { font-family: 'DM Sans', sans-serif; }
        .login-input {
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
        .login-input:focus {
          border-color: #a8a49c;
          box-shadow: 0 0 0 3px rgba(168,164,156,0.12);
        }
        .login-input::placeholder { color: #c0bbb3; }

        /* subtle dot pattern on bg */
        .login-bg {
          background-color: #f5f2ec;
          background-image: radial-gradient(#d4cfc6 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      <div className="login-root login-bg min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">

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
            <div className="px-8 pt-8 pb-6 border-b border-stone-100">
              <h1 className="text-2xl font-semibold text-stone-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-stone-400 mt-1">Sign in to manage your attendance</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">

              {successMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    className="login-input"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    className="login-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-100"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-stone-300">
                  <span className="bg-white px-2">Testing</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@attendance.com');
                  setPassword('admin123');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold text-stone-500 border border-stone-100 hover:bg-stone-50 transition-all active:scale-95"
              >
                Login as Demo Admin
              </button>
            </form>

            <div className="px-8 pb-7 text-center">
              <p className="text-xs text-stone-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-stone-700 font-semibold hover:text-stone-900 transition-colors">
                  Sign Up
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

export default LoginPage;