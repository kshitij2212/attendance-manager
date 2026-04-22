import { useEffect, useState } from 'react';
import api from '../../api';

const POLL_INTERVAL_MS = 4000;

export default function StartupLoader({ onReady }: { onReady: () => void }) {
  const [dots, setDots] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await api.get('/health', { timeout: 8000 });
        if (!cancelled) onReady();
      } catch {
        if (!cancelled) setTimeout(check, POLL_INTERVAL_MS);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [onReady]);

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.blob, ...styles.blob1 }} />
      <div style={{ ...styles.blob, ...styles.blob2 }} />

      <div style={styles.card}>
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinnerOuter} />
          <div style={styles.spinnerInner} />
          <div style={styles.spinnerDot} />
        </div>

        <div style={styles.iconRow}>
          <div style={styles.iconBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <span style={styles.brand}>AttendanceIQ</span>
        </div>

        <h1 style={styles.title}>Waking up the server{dots}</h1>
        <p style={styles.subtitle}>Starting in less than 1 minute</p>

        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${Math.min((elapsed / 60) * 100, 97)}%` }} />
        </div>

        <p style={styles.hint}>☕ Render free-tier servers sleep when idle. Hang tight!</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin-cw  { to { transform: rotate(360deg); } }
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes pulse-dot { 0%,100% { transform: scale(1); opacity:1; } 50% { transform: scale(1.4); opacity:.7; } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-40px) scale(1.1); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-25px,35px) scale(0.95); } }
        @keyframes bar { from { background-position: 0 0; } to { background-position: 40px 0; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f2ec',
    backgroundImage: 'radial-gradient(#d4cfc6 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    zIndex: 9999,
    overflow: 'hidden',
    fontFamily: "'DM Sans', sans-serif",
  },

  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(90px)',
    opacity: 0.12,
    pointerEvents: 'none',
  },
  blob1: {
    width: 400, height: 400,
    background: 'radial-gradient(circle, #1a1a18, transparent)',
    top: '-120px', left: '-100px',
    animation: 'float1 8s ease-in-out infinite',
  },
  blob2: {
    width: 340, height: 340,
    background: 'radial-gradient(circle, #a8a49c, transparent)',
    bottom: '-100px', right: '-80px',
    animation: 'float2 10s ease-in-out infinite',
  },

  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.1rem',
    padding: '3rem 3.5rem',
    borderRadius: '1rem',
    background: '#ffffff',
    border: '1px solid #e4dfd4',
    boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
    maxWidth: 420,
    width: '90%',
    textAlign: 'center',
    animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },

  spinnerWrapper: {
    position: 'relative',
    width: 72, height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '2.5px solid transparent',
    borderTopColor: '#1a1a18',
    borderRightColor: '#a8a49c',
    animation: 'spin-cw 1.2s linear infinite',
  },
  spinnerInner: {
    position: 'absolute',
    inset: 14,
    borderRadius: '50%',
    border: '2.5px solid transparent',
    borderBottomColor: '#d4cfc6',
    borderLeftColor: '#1a1a18',
    animation: 'spin-ccw 0.9s linear infinite',
  },
  spinnerDot: {
    width: 10, height: 10,
    borderRadius: '50%',
    background: '#1a1a18',
    animation: 'pulse-dot 1s ease-in-out infinite',
  },

  iconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  iconBox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28, height: 28,
    borderRadius: 8,
    background: '#1a1a18',
  },
  brand: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#a8a49c',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  },

  title: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#1a1a18',
    letterSpacing: '-0.01em',
    minWidth: 260,
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#a8a49c',
    fontWeight: 400,
  },

  progressTrack: {
    width: '100%',
    height: 5,
    borderRadius: 999,
    background: '#e4dfd4',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 999,
    background: 'repeating-linear-gradient(90deg, #1a1a18 0px, #a8a49c 20px, #1a1a18 40px)',
    backgroundSize: '40px 100%',
    transition: 'width 1s linear',
    animation: 'bar 1s linear infinite',
  },

  hint: {
    margin: 0,
    fontSize: '0.75rem',
    color: '#c0bbb3',
  },
};