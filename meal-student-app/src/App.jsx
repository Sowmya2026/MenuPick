import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { MealProvider } from "./context/MealContext";
import { MenuProvider } from "./context/MenuContext";
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
import TestNotifications from "./components/TestNotifications";
import DevTestButton from "./components/DevTestButton";

/* -------------------- Route Guards -------------------- */

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const TestRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (process.env.NODE_ENV === "production") {
    return <Navigate to="/" replace />;
  }
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

/* -------------------- Route Handler -------------------- */

const RouteHandler = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<Home />} />

      {/* Auth routes */}
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

      {/* Profile completion */}
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

      {/* Test routes (dev only) */}
      <Route
        path="/test-notifications"
        element={
          <TestRoute>
            <TestNotifications />
          </TestRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
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

      {/* Catch-all */}
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
  );
};

/* -------------------- Main App Content -------------------- */

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

  // Loading spinner
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Splash & onboarding flow
  if (showSplash && !hasCompletedOnboarding && !currentUser) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (!hasCompletedOnboarding && !currentUser && !showSplash) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar visible only for authenticated users */}
      {currentUser && <MainNavbar />}

      <main className={currentUser ? "flex-1 pt-16 pb-0" : "flex-1"}>
        <RouteHandler />
      </main>

      <Toaster position="top-right" />

      {/* Dev button (only in development) */}
      {process.env.NODE_ENV === "development" && <DevTestButton />}
    </div>
  );
}

/* -------------------- App Wrapper -------------------- */

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