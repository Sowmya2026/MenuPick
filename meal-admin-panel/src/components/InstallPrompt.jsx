import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Update UI to notify the user they can install the PWA
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

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    return (
        <>
            {showPrompt && (
                <div className="fixed bottom-20 left-4 right-4 z-50 lg:bottom-4 lg:left-auto lg:right-4 lg:w-96 animate-slide-up">
                    <div
                        className="p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border"
                        style={{
                            background: theme.colors.card,
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
                                    Install Admin App
                                </h3>
                                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                                    Quick access to admin portal!
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleInstallClick}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
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
                </div>
            )}
        </>
    );
};

export default InstallPrompt;
