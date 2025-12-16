import {
    Routes,
    Route,
    Navigate,
    useLocation,
} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { useEffect } from 'react';

import MainNavbar from './components/MainNavbar';
import Layout from './components/Layout';
import Home from './pages/Home';
import MealSelection from './pages/MealSelection';
import Feedback from './pages/Feedback';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
// Removed Splash and Onboarding as they are unused
import Welcome from './pages/Welcome';       // New Landing Page
import InstallPrompt from './components/InstallPrompt'; // Global Install Prompt
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
        // Redirect to SignUp if trying to access protected route (Feedback, Profile)
        return <Navigate to="/signup" replace state={{ from: location }} />;
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
    const isGuest = localStorage.getItem('isGuest') === 'true';

    return (
        <>
            <ScrollToTop />
            <Routes>
                {/* Landing / Welcome Page */}
                <Route
                    path="/welcome"
                    element={
                        (currentUser || isGuest) ? <Navigate to="/" replace /> : <Welcome />
                    }
                />

                {/* Home - Accessible to Users AND Guests */}
                <Route path="/home" element={<Home />} />
                <Route
                    path="/"
                    element={
                        (currentUser || isGuest) ? <Home /> : <Navigate to="/welcome" replace />
                    }
                />


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
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </>
    );
};

// Main App Content Component
function AppContent() {
    const { currentUser, loading } = useAuth();
    const { theme } = useTheme();

    // Removed Splash and Onboarding logic as they are replaced by Welcome page logic handled in routing

    if (loading) {
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

    // MAIN APP LAYOUT
    // Check for guest mode
    const isGuest = localStorage.getItem('isGuest') === 'true';

    return (
        <div
            className="min-h-screen transition-colors duration-300"
            style={{ background: theme.colors.background }}
        >
            {/* Global Install Prompt - Shows whenever browser allows */}
            <InstallPrompt />

            {/* MainNavbar will conditionally render the correct navbar */}
            <MainNavbar />
            <main className={(currentUser || isGuest) ? 'pt-16' : ''}>
                <RouteHandler />
            </main>

        </div>
    );
}

export default AppContent;
