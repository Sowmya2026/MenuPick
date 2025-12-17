import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        // Android/Chrome Handler
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // iOS Detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIOS(true);
            setShowPrompt(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowIOSInstructions(true);
            return;
        }

        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        if (outcome === 'accepted') {
            try {
                // Track successful install
                const statsRef = doc(db, "stats", "system");
                await setDoc(statsRef, {
                    totalInstalls: increment(1)
                }, { merge: true });
            } catch (error) {
                console.error("Error tracking install:", error);
            }
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return (
        <AnimatePresence>
            {showPrompt && !showIOSInstructions && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-24 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96"
                >
                    <div
                        className="p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/20 backdrop-blur-xl"
                        style={{
                            background: `${theme.colors.card}e6`, // High opacity
                            borderColor: theme.colors.border,
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                                }}
                            >
                                <Download className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm" style={{ color: theme.colors.text }}>
                                    Install App
                                </h3>
                                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                    {isIOS ? "Install for better experience" : "Get the best experience with our native app!"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg"
                                style={{
                                    background: theme.colors.primary,
                                }}
                            >
                                {isIOS ? "Install" : "Install"}
                            </button>
                            <button
                                onClick={() => setShowPrompt(false)}
                                className="p-1.5 rounded-lg hover:bg-black/5"
                                style={{ color: theme.colors.textSecondary }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* iOS Instructions Modal */}
            {showIOSInstructions && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={() => setShowIOSInstructions(false)}
                >
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl"
                        style={{ background: theme.colors.card }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg" style={{ color: theme.colors.text }}>Install on iOS</h3>
                            <button
                                onClick={() => setShowIOSInstructions(false)}
                                className="p-1 rounded-full hover:bg-black/5"
                            >
                                <X size={20} style={{ color: theme.colors.textSecondary }} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <Share className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm" style={{ color: theme.colors.text }}>
                                    1. Tap the <span className="font-bold">Share</span> button in your browser menu.
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                    <PlusSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </div>
                                <p className="text-sm" style={{ color: theme.colors.text }}>
                                    2. Scroll down and select <span className="font-bold">Add to Home Screen</span>.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowIOSInstructions(false)}
                                className="w-full py-3 rounded-xl font-bold text-white shadow-lg"
                                style={{ background: theme.colors.primary }}
                            >
                                Got it!
                            </button>
                        </div>
                    </motion.div>

                    {/* Pointing Arrow (Optional visual cue) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm animate-bounce sm:hidden pointer-events-none">
                        ↓ Tap Share below
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default InstallPrompt;
