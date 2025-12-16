import { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Static theme for admin panel (green theme to match student app)
    const theme = {
        colors: {
            primary: '#10B981',
            primaryLight: '#34D399',
            primaryDark: '#059669',
            background: '#F9FAFB',
            card: '#FFFFFF',
            border: '#E5E7EB',
            text: '#111827',
            textSecondary: '#6B7280',
            backgroundSecondary: '#F3F4F6',
            backgroundTertiary: '#E5E7EB',
        },
    };

    return (
        <ThemeContext.Provider value={{ theme }}>
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

export default ThemeContext;
