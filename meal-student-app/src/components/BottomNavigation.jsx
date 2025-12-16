import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, User, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

import { useMenu } from "../context/MenuContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { isMenuModalOpen } = useMenu();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/selection", icon: Utensils, label: "Menu" },
    { path: "/feedback", icon: MessageSquare, label: "Feedback" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (!currentUser || isMenuModalOpen) return null;

  return (
    <>
      {/* Spacer is handled by page padding (pb-20), but we add a safety spacer just in case */}
      <div className="h-20 md:hidden pointer-events-none" />

      <div
        className="fixed bottom-0 left-0 right-0 z-[99999] md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-full"
        >
          <div
            className="flex items-center justify-between px-6 py-3 shadow-[0_-8px_30px_-6px_rgba(0,0,0,0.1)] backdrop-blur-xl border-t border-white/20"
            style={{
              background: `${theme.colors.background}f2`, // Higher opacity (95%)
              boxShadow: `0 -4px 20px -5px ${theme.colors.shadow}`,
            }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center"
                >
                  <motion.div
                    layout
                    className={`relative flex items-center justify-center rounded-xl overflow-hidden ${isActive ? 'px-4 py-2.5' : 'p-2.5'}`}
                    style={{
                      background: 'transparent',
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {/* Active Background Layer */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-bg"
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                          borderRadius: '12px',
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Icon & Label Container */}
                    <div className="relative z-10 flex items-center gap-2">
                      <Icon
                        size={20}
                        style={{
                          color: isActive ? '#ffffff' : theme.colors.textSecondary,
                          strokeWidth: isActive ? 2.5 : 2,
                        }}
                      />

                      <AnimatePresence mode="popLayout">
                        {isActive && (
                          <motion.span
                            initial={{ width: 0, opacity: 0, x: -10 }}
                            animate={{ width: "auto", opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: -10 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="text-sm font-bold whitespace-nowrap overflow-hidden text-white"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default BottomNavigation;