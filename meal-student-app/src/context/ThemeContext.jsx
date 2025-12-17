import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const ThemeContext = createContext();

// Premium Luxury Color Themes
export const themes = {
    espresso: {
        id: 'espresso',
        name: 'Espresso',
        description: 'Rich and sophisticated',
        icon: 'Coffee',
        colors: {
            primary: '#8b6f47',
            primaryDark: '#6f5639',
            primaryLight: '#a68a5c',
            background: '#faf8f5',
            backgroundSecondary: '#f5f1eb',
            backgroundTertiary: '#ede7dd',
            card: '#ffffff',
            text: '#3e2723',
            textSecondary: '#5d4037',
            textTertiary: '#795548',
            border: '#d7ccc8',
            shadow: 'rgba(139, 111, 71, 0.1)',
        }
    },

    coral: {
        id: 'coral',
        name: 'Coral',
        description: 'Vibrant and energetic',
        icon: 'Flame',
        colors: {
            primary: '#ff6b6b',
            primaryDark: '#ee5a52',
            primaryLight: '#ff8787',
            background: '#fffafa',
            backgroundSecondary: '#fff5f5',
            backgroundTertiary: '#ffe5e5',
            card: '#ffffff',
            text: '#4a1a1a',
            textSecondary: '#7a3a3a',
            textTertiary: '#a85a5a',
            border: '#ffd0d0',
            shadow: 'rgba(255, 107, 107, 0.1)',
        }
    },

    champagne: {
        id: 'champagne',
        name: 'Champagne',
        description: 'Luxurious and warm',
        icon: 'Sparkles',
        colors: {
            primary: '#d4af37',
            primaryDark: '#b8941f',
            primaryLight: '#e3c966',
            background: '#fffdf9',
            backgroundSecondary: '#fdf9f1',
            backgroundTertiary: '#f9f0df',
            card: '#ffffff',
            text: '#3d3426',
            textSecondary: '#5c4e3a',
            textTertiary: '#7a6856',
            border: '#ead9b8',
            shadow: 'rgba(212, 175, 55, 0.1)',
        }
    },

    slate: {
        id: 'slate',
        name: 'Slate',
        description: 'Modern and refined',
        icon: 'Layers',
        colors: {
            primary: '#64748b',
            primaryDark: '#475569',
            primaryLight: '#94a3b8',
            background: '#f8fafc',
            backgroundSecondary: '#f1f5f9',
            backgroundTertiary: '#e2e8f0',
            card: '#ffffff',
            text: '#1e293b',
            textSecondary: '#334155',
            textTertiary: '#475569',
            border: '#cbd5e1',
            shadow: 'rgba(100, 116, 139, 0.1)',
        }
    },

    navy: {
        id: 'navy',
        name: 'Navy',
        description: 'Classic and powerful',
        icon: 'Anchor',
        colors: {
            primary: '#1e3a8a',
            primaryDark: '#1e40af',
            primaryLight: '#3b82f6',
            background: '#f8faff',
            backgroundSecondary: '#eff6ff',
            backgroundTertiary: '#dbeafe',
            card: '#ffffff',
            text: '#1e293b',
            textSecondary: '#334155',
            textTertiary: '#475569',
            border: '#bfdbfe',
            shadow: 'rgba(30, 58, 138, 0.1)',
        }
    },

    emerald: {
        id: 'emerald',
        name: 'Emerald',
        description: 'Premium and fresh',
        icon: 'Gem',
        colors: {
            primary: '#047857',
            primaryDark: '#065f46',
            primaryLight: '#10b981',
            background: '#f7fef9',
            backgroundSecondary: '#ecfdf5',
            backgroundTertiary: '#d1fae5',
            card: '#ffffff',
            text: '#064e3b',
            textSecondary: '#065f46',
            textTertiary: '#047857',
            border: '#a7f3d0',
            shadow: 'rgba(4, 120, 87, 0.1)',
        }
    },

    // NEW THEMES
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        description: 'Warm and inviting',
        icon: 'Sunset',
        colors: {
            primary: '#f97316',
            primaryDark: '#ea580c',
            primaryLight: '#fb923c',
            background: '#fffbf5',
            backgroundSecondary: '#fff7ed',
            backgroundTertiary: '#ffedd5',
            card: '#ffffff',
            text: '#431407',
            textSecondary: '#7c2d12',
            textTertiary: '#9a3412',
            border: '#fed7aa',
            shadow: 'rgba(249, 115, 22, 0.1)',
        }
    },

    lavender: {
        id: 'lavender',
        name: 'Lavender',
        description: 'Calm and elegant',
        icon: 'Flower2',
        colors: {
            primary: '#8b5cf6',
            primaryDark: '#7c3aed',
            primaryLight: '#a78bfa',
            background: '#faf5ff',
            backgroundSecondary: '#f5f3ff',
            backgroundTertiary: '#ede9fe',
            card: '#ffffff',
            text: '#3b0764',
            textSecondary: '#581c87',
            textTertiary: '#6b21a8',
            border: '#ddd6fe',
            shadow: 'rgba(139, 92, 246, 0.1)',
        }
    },

    mint: {
        id: 'mint',
        name: 'Mint',
        description: 'Cool and refreshing',
        icon: 'Leaf',
        colors: {
            primary: '#14b8a6',
            primaryDark: '#0f766e',
            primaryLight: '#2dd4bf',
            background: '#f0fdfa',
            backgroundSecondary: '#ccfbf1',
            backgroundTertiary: '#99f6e4',
            card: '#ffffff',
            text: '#042f2e',
            textSecondary: '#134e4a',
            textTertiary: '#115e59',
            border: '#5eead4',
            shadow: 'rgba(20, 184, 166, 0.1)',
        }
    },

    rose: {
        id: 'rose',
        name: 'Rose',
        description: 'Romantic and soft',
        icon: 'Heart',
        colors: {
            primary: '#f43f5e',
            primaryDark: '#e11d48',
            primaryLight: '#fb7185',
            background: '#fff1f2',
            backgroundSecondary: '#ffe4e6',
            backgroundTertiary: '#fecdd3',
            card: '#ffffff',
            text: '#4c0519',
            textSecondary: '#881337',
            textTertiary: '#9f1239',
            border: '#fda4af',
            shadow: 'rgba(244, 63, 94, 0.1)',
        }
    },

    amber: {
        id: 'amber',
        name: 'Amber',
        description: 'Bold and confident',
        icon: 'Zap',
        colors: {
            primary: '#f59e0b',
            primaryDark: '#d97706',
            primaryLight: '#fbbf24',
            background: '#fffbeb',
            backgroundSecondary: '#fef3c7',
            backgroundTertiary: '#fde68a',
            card: '#ffffff',
            text: '#451a03',
            textSecondary: '#78350f',
            textTertiary: '#92400e',
            border: '#fcd34d',
            shadow: 'rgba(245, 158, 11, 0.1)',
        }
    },

    indigo: {
        id: 'indigo',
        name: 'Indigo',
        description: 'Deep and mysterious',
        icon: 'Moon',
        colors: {
            primary: '#6366f1',
            primaryDark: '#4f46e5',
            primaryLight: '#818cf8',
            background: '#f5f3ff',
            backgroundSecondary: '#eef2ff',
            backgroundTertiary: '#e0e7ff',
            card: '#ffffff',
            text: '#1e1b4b',
            textSecondary: '#312e81',
            textTertiary: '#3730a3',
            border: '#c7d2fe',
            shadow: 'rgba(99, 102, 241, 0.1)',
        }
    },

    forest: {
        id: 'forest',
        name: 'Forest',
        description: 'Natural and grounded',
        icon: 'Trees',
        colors: {
            primary: '#16a34a',
            primaryDark: '#15803d',
            primaryLight: '#22c55e',
            background: '#f7fef7',
            backgroundSecondary: '#f0fdf4',
            backgroundTertiary: '#dcfce7',
            card: '#ffffff',
            text: '#052e16',
            textSecondary: '#14532d',
            textTertiary: '#166534',
            border: '#bbf7d0',
            shadow: 'rgba(22, 163, 74, 0.1)',
        }
    },

    crimson: {
        id: 'crimson',
        name: 'Crimson',
        description: 'Passionate and bold',
        icon: 'Flame',
        colors: {
            primary: '#dc2626',
            primaryDark: '#b91c1c',
            primaryLight: '#ef4444',
            background: '#fef2f2',
            backgroundSecondary: '#fee2e2',
            backgroundTertiary: '#fecaca',
            card: '#ffffff',
            text: '#450a0a',
            textSecondary: '#7f1d1d',
            textTertiary: '#991b1b',
            border: '#fca5a5',
            shadow: 'rgba(220, 38, 38, 0.1)',
        }
    },

    sky: {
        id: 'sky',
        name: 'Sky',
        description: 'Bright and airy',
        icon: 'Cloud',
        colors: {
            primary: '#0ea5e9',
            primaryDark: '#0284c7',
            primaryLight: '#38bdf8',
            background: '#f0f9ff',
            backgroundSecondary: '#e0f2fe',
            backgroundTertiary: '#bae6fd',
            card: '#ffffff',
            text: '#082f49',
            textSecondary: '#0c4a6e',
            textTertiary: '#075985',
            border: '#7dd3fc',
            shadow: 'rgba(14, 165, 233, 0.1)',
        }
    },

    plum: {
        id: 'plum',
        name: 'Plum',
        description: 'Rich and luxurious',
        icon: 'Crown',
        colors: {
            primary: '#a855f7',
            primaryDark: '#9333ea',
            primaryLight: '#c084fc',
            background: '#faf5ff',
            backgroundSecondary: '#f3e8ff',
            backgroundTertiary: '#e9d5ff',
            card: '#ffffff',
            text: '#3b0764',
            textSecondary: '#581c87',
            textTertiary: '#6b21a8',
            border: '#d8b4fe',
            shadow: 'rgba(168, 85, 247, 0.1)',
        }
    },
};

export const ThemeProvider = ({ children }) => {
    // Initialize with saved theme or default
    const [currentTheme, setCurrentTheme] = useState(() => {
        const savedTheme = localStorage.getItem('menuPickTheme');
        console.log('📖 Loading theme from localStorage:', savedTheme);
        return (savedTheme && themes[savedTheme]) ? savedTheme : 'espresso';
    });

    const [animationsEnabled, setAnimationsEnabled] = useState(() => {
        const savedAnimations = localStorage.getItem('menuPickAnimations');
        return savedAnimations !== null ? savedAnimations === 'true' : true;
    });

    const { currentUser } = useAuth();
    const db = getFirestore();

    // Sync settings from Firestore when user logs in
    useEffect(() => {
        let unsubscribe;

        if (currentUser) {
            console.log('🔄 Syncing theme with user account:', currentUser.uid);
            const userRef = doc(db, 'users', currentUser.uid);

            unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const settings = data.settings || {};

                    // Sync Theme
                    if (settings.theme && themes[settings.theme] && settings.theme !== currentTheme) {
                        console.log('☁️ Received external theme update:', settings.theme);
                        setCurrentTheme(settings.theme);
                        localStorage.setItem('menuPickTheme', settings.theme);
                    }

                    // Sync Animations
                    if (settings.animationsEnabled !== undefined && settings.animationsEnabled !== animationsEnabled) {
                        console.log('☁️ Received external animation update:', settings.animationsEnabled);
                        setAnimationsEnabled(settings.animationsEnabled);
                        localStorage.setItem('menuPickAnimations', settings.animationsEnabled.toString());
                    }
                }
            }, (error) => {
                console.error('❌ Error syncing theme settings:', error);
            });
        }

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser]);



    // Save theme changes and apply CSS variables
    useEffect(() => {
        localStorage.setItem('menuPickTheme', currentTheme);
        console.log('💾 Theme saved to localStorage:', currentTheme);

        // Apply theme CSS variables
        const theme = themes[currentTheme];
        const root = document.documentElement;

        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Update theme-color meta tag for mobile status bar
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.getElementsByTagName('head')[0].appendChild(themeColorMeta);
        }
        themeColorMeta.content = theme.colors.card; // Use card color for clean look
    }, [currentTheme]);

    // Save animations preference
    useEffect(() => {
        localStorage.setItem('menuPickAnimations', animationsEnabled.toString());
        document.documentElement.classList.toggle('animations-disabled', !animationsEnabled);
    }, [animationsEnabled]);

    const changeTheme = (themeId) => {
        if (themes[themeId]) {
            console.log('🎨 Changing theme to:', themeId);
            setCurrentTheme(themeId);
            // Local storage is updated in the useEffect dependent on currentTheme

            // Save to Firestore if user is logged in
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                setDoc(userRef, {
                    settings: {
                        theme: themeId
                    }
                }, { merge: true }).catch(err => console.error("Error saving theme to account:", err));
            }
        }
    };

    const toggleAnimations = () => {
        setAnimationsEnabled(prev => {
            const newValue = !prev;

            // Save to Firestore if user is logged in
            if (currentUser) {
                const userRef = doc(db, 'users', currentUser.uid);
                setDoc(userRef, {
                    settings: {
                        animationsEnabled: newValue
                    }
                }, { merge: true }).catch(err => console.error("Error saving animations to account:", err));
            }

            return newValue;
        });
    };

    const value = {
        currentTheme,
        theme: themes[currentTheme],
        themes,
        changeTheme,
        animationsEnabled,
        toggleAnimations,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
