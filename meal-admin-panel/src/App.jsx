import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MealProvider } from './context/MealContext';
import { ThemeProvider } from './context/ThemeContext';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MenuImport from './pages/MenuImport';

import MealManagement from './pages/MealManagement';
import FeedbackView from './pages/FeedbackView';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import AdminSetup from './pages/AdminSetup';
import UserActives from './pages/UserActives';

// Route reset component to ensure dashboard loads on reload
function RouteReset() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // If we're at the root path and user is authenticated, redirect to dashboard
    if (location.pathname === '/' && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [location, navigate, currentUser]);

  return null;
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <RouteReset />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-setup" element={<AdminSetup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="meals" element={<MealManagement />} />
          <Route path="menu-import" element={<MenuImport />} />
          <Route path="feedback" element={<FeedbackView />} />

          <Route path="analytics" element={<Analytics />} />
          <Route path="user-activities" element={<UserActives />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MealProvider>
          <AppContent />
        </MealProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;