import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { doc, setDoc, increment } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
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
            {showPrompt && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:w-96"
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
                                    Get the best experience with our native app!
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
                                Install
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
        </AnimatePresence>
    );
};

export default InstallPrompt;
