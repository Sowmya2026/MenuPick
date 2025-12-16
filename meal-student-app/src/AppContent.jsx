import {
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useState, useEffect } from 'react';

import MainNavbar from './components/MainNavbar';
import Layout from './components/Layout';
import Home from './pages/Home';
import MealSelection from './pages/MealSelection';
import Feedback from './pages/Feedback';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import ThemeSelection from './pages/ThemeSelection';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/signin" replace state={{ from: location }} />;
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

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pathname]);

    return null;
};



// Route Handler Component
const RouteHandler = () => {
    const { currentUser } = useAuth();

    return (
        <>
            <ScrollToTop />
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

                {/* Profile completion route */}
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

                <Route
                    path="/themes"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ThemeSelection />
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

// Main App Content Component
function AppContent() {
    const { currentUser, loading } = useAuth();
    const { theme, animationsEnabled } = useTheme();
    const [showSplash, setShowSplash] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeApp = () => {
            const onboardingCompleted =
                localStorage.getItem('hasCompletedOnboarding') === 'true';
            setHasCompletedOnboarding(onboardingCompleted);

            const splashTimer = setTimeout(() => {
                setShowSplash(false);
                setIsInitializing(false);
            }, 1200); // Reduced from 2000ms to 1200ms

            return () => clearTimeout(splashTimer);
        };

        initializeApp();
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true);
    };

    if (loading || isInitializing) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: theme.colors.background }}
            >
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                        style={{ borderColor: theme.colors.primary }}
                    />
                    <p style={{ color: theme.colors.textSecondary }}>Loading...</p>
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

    // MAIN APP LAYOUT
    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{ background: theme.colors.background }}
        >
            {/* MainNavbar will conditionally render the correct navbar */}
            <MainNavbar />
            <main className={currentUser ? 'pt-16' : ''}>
                <RouteHandler />
            </main>

        </div>
    );
}

export default AppContent;
