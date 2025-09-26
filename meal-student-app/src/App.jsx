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
import Auth from "./pages/Auth";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Notifications from "./pages/Notifications";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Profile Completion Route
const ProfileCompletionRoute = ({ children }) => {
  const { currentUser, needsProfileCompletion } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  if (!needsProfileCompletion) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Route Handler Component
const RouteHandler = () => {
  const { currentUser, needsProfileCompletion } = useAuth();
  const location = useLocation();

  if (
    currentUser &&
    needsProfileCompletion &&
    location.pathname !== "/complete-profile"
  ) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (currentUser && location.pathname === "/auth") {
    return <Navigate to="/" replace />;
  }

  if (
    currentUser &&
    !needsProfileCompletion &&
    location.pathname === "/complete-profile"
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Routes>
        {/* Public home page for guests */}
        <Route path="/home" element={<Home />} />

        {/* Home route */}
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/auth" replace />}
        />

        {/* Auth route */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Profile completion route */}
        <Route
          path="/complete-profile"
          element={
            <ProfileCompletionRoute>
              <CompleteProfile />
            </ProfileCompletionRoute>
          }
        />

        {/* Protected routes with Layout */}
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
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </>
  );
};

// Main App Component
function AppContent() {
  const { currentUser, loading, needsProfileCompletion } = useAuth();
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show splash/onboarding for users who need profile completion
  if (currentUser && needsProfileCompletion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main>
          <RouteHandler />
        </main>
        <Toaster position="top-right" />
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

  // MAIN APP LAYOUT
  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />
      <RouteHandler />
      <Toaster position="top-right" />
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