import { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Shared/Layout';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import LeaveManagement from './pages/LeaveManagement';
import AttendanceLogs from './pages/AttendanceLogs';
import StartupLoader from './components/Shared/StartupLoader';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'ADMIN' ? '/admin' : '/employee'} />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to={user.role === 'ADMIN' ? '/admin' : '/employee'} />} />
      
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <Layout>
            <Routes>
               <Route path="/" element={<AdminDashboard />} />
               <Route path="/employees" element={<EmployeeManagement />} />
               <Route path="/leaves" element={<LeaveManagement />} />
               <Route path="/attendance" element={<AttendanceLogs />} />
             </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/employee/*" element={
        <ProtectedRoute allowedRoles={['EMPLOYEE']}>
          <Layout>
            <Routes>
               <Route path="/" element={<EmployeeDashboard />} />
               <Route path="/history" element={<AttendanceLogs />} />
               <Route path="/leaves" element={<LeaveManagement />} />
             </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to={user ? (user.role === 'ADMIN' ? '/admin' : '/employee') : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  const [serverReady, setServerReady] = useState(false);
  const handleReady = useCallback(() => setServerReady(true), []);

  return (
    <>
      {!serverReady && <StartupLoader onReady={handleReady} />}
      {serverReady && (
        <Router>
          <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <AppRoutes />
          </AuthProvider>
        </Router>
      )}
    </>
  );
}

export default App;
