import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MealProvider } from "./context/MealContext";
import { MenuProvider } from "./context/MenuContext";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { NotificationProvider } from "./context/NotificationContext";

import MainNavbar from "./components/MainNavbar";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import MealSelection from "./pages/MealSelection";
import Feedback from "./pages/Feedback";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import TestNotifications from './components/TestNotifications';
import DevTestButton from './components/DevTestButton';

// Protected Route Component - SIMPLIFIED
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
};

// Public Route Component - SIMPLIFIED
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Test Route Component (only accessible in development)
const TestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (process.env.NODE_ENV === 'production') {
    return <Navigate to="/" replace />;
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

// SIMPLIFIED Route Handler Component
const RouteHandler = () => {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/home" element={<Home />} />
        
        {/* Auth routes - only for non-logged in users */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Profile completion route - accessible only if user exists but profile is not complete */}
        <Route
          path="/complete-profile"
          element={
            currentUser?.profileCompleted ? (
              <Navigate to="/" replace />
            ) : currentUser ? (
              <CompleteProfile />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Test notifications route - only in development */}
        <Route
          path="/test-notifications"
          element={
            <TestRoute>
              <TestNotifications />
            </TestRoute>
          }
        />

        {/* Protected routes - only for logged in users */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/selection"
          element={
            <ProtectedRoute>
              <Layout>
                <MealSelection />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Layout>
                <Feedback />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect any unknown routes */}
        <Route
          path="*"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

// UPDATED Main App Component with mobile gap fix
function AppContent() {
  const { currentUser, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = () => {
      const onboardingCompleted =
        localStorage.getItem("hasCompletedOnboarding") === "true";
      setHasCompletedOnboarding(onboardingCompleted);

      const splashTimer = setTimeout(() => {
        setShowSplash(false);
        setIsInitializing(false);
      }, 2000);

      return () => clearTimeout(splashTimer);
    };

    initializeApp();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true");
    setHasCompletedOnboarding(true);
  };

  if (loading || isInitializing) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show splash screen for first-time users
  if (showSplash && !hasCompletedOnboarding && !currentUser) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  // Show onboarding for first-time users
  if (!hasCompletedOnboarding && !currentUser && !showSplash) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // UPDATED MAIN APP LAYOUT - Fixed mobile gap issue
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* MainNavbar will conditionally render the correct navbar */}
      <MainNavbar />
      <main className="flex-1 overflow-auto">
        <RouteHandler />
      </main>
      <Toaster position="top-right" />
      {/* Only show dev button in development */}
      {process.env.NODE_ENV === 'development' && <DevTestButton />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <MenuProvider>
            <NotificationProvider>
              <AppContent />
            </NotificationProvider>
          </MenuProvider>
        </MealProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;