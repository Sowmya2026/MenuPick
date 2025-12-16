import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ChefHat, User, ArrowRight } from 'lucide-react';

const Welcome = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleGuestAccess = () => {
        localStorage.setItem('isGuest', 'true');
        // Force a reload or update state? 
        // Usually navigating to /home and having AppContent re-evaluate is best.
        // However, AppContent state won't update automatically on localStorage change unless we trigger it.
        // So we might need to dispatch an event or use a context.
        // For now, I'll navigate to /home and rely on AppContent to re-render or reload.
        window.location.href = '/home';
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
            style={{ background: theme.colors.background }}
        >
            {/* Decorative Background Elements */}
            <div
                className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ background: theme.colors.primary }}
            />
            <div
                className="absolute bottom-[-10%] left-[-10%] w-64 h-64 rounded-full blur-3xl opacity-10"
                style={{ background: theme.colors.primaryDark }}
            />

            <div className="w-full max-w-sm z-10 flex flex-col items-center text-center space-y-8">
                {/* Logo/Icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`
                    }}
                >
                    <ChefHat className="w-12 h-12 text-white" />
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl font-extrabold mb-3 tracking-tight" style={{ color: theme.colors.text }}>
                        Menu
                    </h1>
                    <p className="text-lg font-medium leading-relaxed" style={{ color: theme.colors.textSecondary }}>
                        Your campus dining experience,<br /> reimagined.
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full space-y-4 pt-8"
                >
                    <button
                        onClick={() => navigate('/signup')}
                        className="w-full py-4 rounded-2xl font-bold text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        style={{ background: theme.colors.primary }}
                    >
                        Create Account
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleGuestAccess}
                        className="w-full py-4 rounded-2xl font-bold border-2 transition-all active:scale-95 hover:bg-black/5 flex items-center justify-center gap-2"
                        style={{
                            borderColor: theme.colors.border,
                            color: theme.colors.text
                        }}
                    >
                        <User className="w-5 h-5" />
                        Continue as Guest
                    </button>
                </motion.div>

            </div>

            {/* Footer Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-8 text-xs font-semibold opacity-50"
                style={{ color: theme.colors.textSecondary }}
            >
                v1.0.0 • Made with ❤️ for Students
            </motion.p>
        </div>
    );
};

export default Welcome;
