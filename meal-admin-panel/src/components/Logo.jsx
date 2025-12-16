import { useTheme } from '../context/ThemeContext';

const Logo = ({ size = 'md', withText = true, className = '' }) => {
    const { theme } = useTheme();

    const sizes = {
        sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-2' },
        md: { icon: 'w-10 h-10', text: 'text-2xl', container: 'gap-3' },
        lg: { icon: 'w-12 h-12', text: 'text-3xl', container: 'gap-3' },
        xl: { icon: 'w-20 h-20', text: 'text-5xl', container: 'gap-4' },
    };

    const currentSize = sizes[size] || sizes.md;

    return (
        <div className={`flex items-center ${currentSize.container} ${className}`}>
            {/* Logo Icon - 'The Dining Shield' */}
            {/* Meaning: Shield (Campus/Trust) + Cloche (Dining/Service) */}
            <div className={`relative ${currentSize.icon} flex-shrink-0`}>
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-md"
                >
                    <defs>
                        <linearGradient id={`logoGradient-${size}`} x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor={theme.colors.primaryLight} />
                            <stop offset="100%" stopColor={theme.colors.primary} />
                        </linearGradient>
                    </defs>

                    {/* Shield Container */}
                    <path
                        d="M16 2L4 7V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V7L16 2Z"
                        fill={`url(#logoGradient-${size})`}
                    />

                    {/* Inner Cloche Icon (Negative Space/Cutout look) */}
                    <path
                        d="M16 10C13 10 10.5 12.5 10.5 15.5V19H21.5V15.5C21.5 12.5 19 10 16 10Z"
                        fill={theme.colors.card}
                    />
                    <path
                        d="M10 19H22V20H10V19Z"
                        fill={theme.colors.card}
                    />
                    <circle cx="16" cy="9" r="1.5" fill={theme.colors.card} />
                </svg>
            </div>

            {/* Logo Text - Theme Colors */}
            {withText && (
                <div className="flex flex-col leading-none justify-center">
                    <span
                        className={`font-extrabold ${currentSize.text} tracking-tight`}
                        style={{
                            color: theme.colors.text,
                        }}
                    >
                        MenuPick
                    </span>
                    {size !== 'sm' && (
                        <span
                            className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-70"
                            style={{ color: theme.colors.textSecondary }}
                        >
                            Admin Portal
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Logo;
