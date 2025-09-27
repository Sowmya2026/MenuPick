import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MealProvider } from './context/MealContext';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MealManagement from './pages/MealManagement';
import FeedbackView from './pages/FeedbackView';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';

// Add this route

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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="meals" element={<MealManagement />} />
          <Route path="feedback" element={<FeedbackView />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MealProvider>
        <AppContent />
      </MealProvider>
    </AuthProvider>
  );
}

export default App;