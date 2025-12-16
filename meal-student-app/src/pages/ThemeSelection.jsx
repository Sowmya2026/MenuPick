import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Check,
    Coffee,
    Flame,
    Sparkles,
    Layers,
    Anchor,
    Gem,
    Sunset,
    Flower2,
    Leaf,
    Heart,
    Zap,
    Moon,
    Trees,
    Cloud,
    Crown,
    Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Icon mapping
const iconMap = {
    Coffee,
    Flame,
    Sparkles,
    Layers,
    Anchor,
    Gem,
    Sunset,
    Flower2,
    Leaf,
    Heart,
    Zap,
    Moon,
    Trees,
    Cloud,
    Crown,
};

const ThemeSelection = () => {
    const navigate = useNavigate();
    const { theme, themes, currentTheme, changeTheme } = useTheme();

    const handleThemeChange = (themeId) => {
        changeTheme(themeId);
        toast.success(`Theme changed to ${themes[themeId].name}`, {
            icon: <Palette className="w-5 h-5" style={{ color: themes[themeId].colors.primary }} />,
            style: {
                background: themes[themeId].colors.card,
                color: themes[themeId].colors.text,
                border: `1px solid ${themes[themeId].colors.border}`,
            },
        });
    };

    return (
        <div className="min-h-screen pb-20" style={{ background: theme.colors.background }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 backdrop-blur-lg"
                style={{
                    background: `${theme.colors.card}f0`,
                    borderBottom: `1px solid ${theme.colors.border}`,
                }}
            >
                <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg transition-colors"
                        style={{
                            background: theme.colors.backgroundSecondary,
                            color: theme.colors.text,
                        }}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: theme.colors.text }}>
                            Choose Your Theme
                        </h1>
                        <p className="text-xs sm:text-sm" style={{ color: theme.colors.textSecondary }}>
                            Select from {Object.keys(themes).length} premium themes
                        </p>
                    </div>
                </div>
            </div>

            {/* Theme Grid */}
            <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {Object.values(themes).map((themeOption, index) => {
                        const isSelected = currentTheme === themeOption.id;
                        const IconComponent = iconMap[themeOption.icon] || Coffee;

                        return (
                            <motion.button
                                key={themeOption.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleThemeChange(themeOption.id)}
                                className="group relative p-4 sm:p-6 rounded-2xl transition-all text-left overflow-hidden"
                                style={{
                                    background: isSelected
                                        ? themeOption.colors.backgroundSecondary
                                        : theme.colors.card,
                                    border: `2px solid ${isSelected ? themeOption.colors.primary : theme.colors.border
                                        }`,
                                    boxShadow: isSelected
                                        ? `0 8px 16px ${themeOption.colors.shadow}`
                                        : 'none',
                                }}
                            >
                                {/* Selection indicator */}
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{ background: themeOption.colors.primary }}
                                    >
                                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                    </motion.div>
                                )}

                                {/* Theme Icon */}
                                <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-transform group-hover:scale-110"
                                    style={{
                                        background: `linear-gradient(135deg, ${themeOption.colors.primary}, ${themeOption.colors.primaryDark})`,
                                    }}
                                >
                                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                </div>

                                {/* Theme Name */}
                                <h3
                                    className="font-bold text-base sm:text-lg mb-1"
                                    style={{ color: themeOption.colors.text }}
                                >
                                    {themeOption.name}
                                </h3>

                                {/* Theme Description */}
                                <p
                                    className="text-xs sm:text-sm mb-3 sm:mb-4"
                                    style={{ color: themeOption.colors.textSecondary }}
                                >
                                    {themeOption.description}
                                </p>

                                {/* Color Preview */}
                                <div className="flex gap-1.5">
                                    <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                                        style={{ background: themeOption.colors.primary }}
                                    />
                                    <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                                        style={{ background: themeOption.colors.primaryLight }}
                                    />
                                    <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg"
                                        style={{ background: themeOption.colors.primaryDark }}
                                    />
                                    <div
                                        className="flex-1 h-6 sm:h-8 rounded-lg"
                                        style={{ background: themeOption.colors.backgroundSecondary }}
                                    />
                                </div>

                                {/* Hover effect overlay */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                                    style={{ background: themeOption.colors.primary }}
                                />
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelection;
