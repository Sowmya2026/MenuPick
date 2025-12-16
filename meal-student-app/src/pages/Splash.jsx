import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import { Sparkles, ChefHat } from "lucide-react";

const Splash = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { currentUser, authLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentUser) {
        // Check if profile is complete
        if (currentUser.profileCompleted) {
          navigate("/");
        } else {
          navigate("/complete-profile");
        }
      } else {
        navigate("/onboarding");
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [currentUser, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 opacity-20"
        >
          <ChefHat className="w-16 h-16 text-white" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="mb-8"
        >
          <div className="inline-block p-6 rounded-3xl bg-white/10 backdrop-blur-lg border-2 border-white/20 shadow-2xl">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #8b6f47, #6f5639)',
              }}
            >
              <ChefHat className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2">
            MenuPick
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8">
            Campus Dining Made Simple
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-white"
              />
            ))}
          </div>
          <p className="text-sm text-white/60">Loading your experience...</p>
        </motion.div>

        {/* Sparkles */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-8 -right-8 opacity-30"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
      </div>
    </div>
  );
};

export default Splash;