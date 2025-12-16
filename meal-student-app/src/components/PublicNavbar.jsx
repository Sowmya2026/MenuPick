import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

const PublicNavbar = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg border-b"
      style={{
        background: `${theme.colors.card}f0`,
        borderColor: theme.colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0">
            <Logo size="md" withText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2"
              style={{
                background: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              }}
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl font-medium text-sm text-white transition-all flex items-center gap-2 shadow-lg"
              style={{
                background: theme.colors.primary,
              }}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg transition-all"
            style={{
              background: isOpen ? theme.colors.backgroundTertiary : 'transparent',
              color: theme.colors.text,
            }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/signin"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                  }}
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-white transition-all"
                  style={{
                    background: theme.colors.primary,
                  }}
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default PublicNavbar;