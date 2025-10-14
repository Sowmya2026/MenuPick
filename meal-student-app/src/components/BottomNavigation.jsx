import { Link, useLocation } from "react-router-dom";
import { Home, Utensils, User, MessageSquare, Bell, Sparkles, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { useNotification } from "../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";

const BottomNavigation = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { selectedMess } = useMenu();
  const { activeNotifications } = useNotification();

  const getColorTheme = () => {
    const colors = {
      veg: { 
        primary: "bg-green-400",
        light: "bg-green-300",
        dark: "bg-green-500",
        text: "text-green-600",
        glow: "shadow-green-400/50"
      },
      "non-veg": { 
        primary: "bg-red-400",
        light: "bg-red-300",
        dark: "bg-red-500",
        text: "text-red-600",
        glow: "shadow-red-400/50"
      },
      special: { 
        primary: "bg-purple-400",
        light: "bg-purple-300",
        dark: "bg-purple-500",
        text: "text-purple-600",
        glow: "shadow-purple-400/50"
      },
    };
    return colors[selectedMess] || colors.veg;
  };

  const theme = getColorTheme();

  const navItems = [
    { 
      path: "/", 
      icon: Home, 
      label: "Home",
      emoji: "🏠",
      bubble: "✨"
    },
    { 
      path: "/selection", 
      icon: Utensils, 
      label: "Meals",
      emoji: "🍽️",
      bubble: "😋"
    },
    { 
      path: "/feedback", 
      icon: MessageSquare, 
      label: "Feedback",
      emoji: "💬",
      bubble: "💝"
    },
    {
      path: "/notifications",
      icon: Bell,
      label: "Alerts",
      emoji: "🔔",
      bubble: "🎉",
      isNotification: true,
    },
    { 
      path: "/profile", 
      icon: User, 
      label: "Profile",
      emoji: "👤",
      bubble: "🌟"
    },
  ];

  if (!currentUser) return null;

  const activeIndex = navItems.findIndex(item => location.pathname === item.path);

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-inset-b"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}
    >
      {/* Cloud-like Background */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="relative mx-4"
      >
        {/* Main Cloud Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[40px] border-2 border-white shadow-2xl shadow-black/10 relative overflow-hidden">
          
          {/* Animated Background Bubbles */}
          <div className="absolute inset-0 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                className={`absolute rounded-full ${theme.light} opacity-20`}
                style={{
                  width: `${20 + i * 10}px`,
                  height: `${20 + i * 10}px`,
                  left: `${i * 20}%`,
                  top: i % 2 === 0 ? '10%' : '70%',
                }}
              />
            ))}
          </div>

          {/* Floating Particles */}
          <AnimatePresence>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              if (isActive) {
                return (
                  <motion.div
                    key={`particles-${item.path}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {[1, 2, 3].map((particle) => (
                      <motion.div
                        key={particle}
                        animate={{
                          y: [0, -30, 0],
                          x: [0, particle % 2 === 0 ? 10 : -10, 0],
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: particle * 0.3,
                          repeat: Infinity,
                        }}
                        className={`absolute ${theme.primary} rounded-full text-white text-xs flex items-center justify-center`}
                        style={{
                          width: '12px',
                          height: '12px',
                          left: `calc(${index * 20}% + 10% - 6px)`,
                          top: '30%',
                        }}
                      >
                        {item.bubble}
                      </motion.div>
                    ))}
                  </motion.div>
                );
              }
              return null;
            })}
          </AnimatePresence>

          {/* Navigation Items */}
          <div className="relative flex justify-between items-center px-4 py-3 z-10">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasNotifications = item.isNotification && activeNotifications.length > 0;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center flex-1 min-w-0 z-10"
                >
                  {/* Main Button */}
                  <motion.div
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9, y: 0 }}
                    className="relative"
                  >
                    {/* Animated Background Circle */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className={`absolute inset-0 ${theme.primary} rounded-full shadow-lg ${theme.glow} -inset-3`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon Container */}
                    <motion.div
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        y: isActive ? -8 : 0,
                        rotate: isActive ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ 
                        scale: { type: "spring", stiffness: 300 },
                        rotate: { duration: 0.5 }
                      }}
                      className={`
                        relative w-12 h-12 rounded-2xl flex items-center justify-center
                        border-2 border-white
                        shadow-lg
                        transition-all duration-300
                        ${isActive 
                          ? `${theme.primary} text-white shadow-xl ${theme.glow}` 
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                        }
                      `}
                    >
                      {/* Notification Badge */}
                      {hasNotifications && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <div className="relative">
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                              }}
                              className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white"
                            >
                              <span className="text-white text-[10px] font-bold">
                                {activeNotifications.length > 9 ? "9+" : activeNotifications.length}
                              </span>
                            </motion.div>
                            <motion.div
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 0, 0.7],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                              className="absolute inset-0 bg-red-500 rounded-full"
                            />
                          </div>
                        </motion.div>
                      )}

                      {/* Icon */}
                      <div className="relative">
                        <Icon size={20} />
                        
                        {/* Sparkle Effect when Active */}
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-3 -right-3"
                          >
                            <Sparkles size={12} className={theme.text} fill="currentColor" />
                          </motion.div>
                        )}
                      </div>

                      {/* Floating Emoji */}
                      <motion.span
                        animate={{
                          y: isActive ? [-20, -30, -20] : 0,
                          opacity: isActive ? [0, 1, 0] : 0,
                          scale: isActive ? [0, 1, 0] : 0,
                        }}
                        transition={{
                          duration: 2,
                          repeat: isActive ? Infinity : 0,
                        }}
                        className="absolute -top-6 text-lg"
                      >
                        {item.emoji}
                      </motion.span>
                    </motion.div>

                    {/* Bouncing Dot Indicator */}
                    {isActive && (
                      <motion.div
                        animate={{
                          y: [0, -4, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                        }}
                        className={`absolute -bottom-1 w-2 h-2 ${theme.dark} rounded-full border-2 border-white shadow-sm`}
                      />
                    )}
                  </motion.div>

                  {/* Label with Bounce */}
                  <motion.span
                    initial={false}
                    animate={{
                      y: isActive ? [0, -2, 0] : 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`text-xs font-semibold mt-2 ${
                      isActive ? theme.text : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </motion.span>

                  {/* Heart Particles on Active */}
                  {isActive && (
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                      {[1, 2, 3].map((heart) => (
                        <motion.div
                          key={heart}
                          initial={{ scale: 0, opacity: 0, y: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            y: -30 - heart * 10,
                            x: heart % 2 === 0 ? 10 : -10,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: heart * 0.2,
                            repeat: Infinity,
                          }}
                          className="absolute"
                        >
                          <Heart 
                            size={12} 
                            className={theme.text} 
                            fill="currentColor"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Cute Wave at Bottom */}
          <motion.div
            animate={{
              d: [
                "M0,20 Q80,10 160,20 T320,20",
                "M0,20 Q80,30 160,20 T320,20",
                "M0,20 Q80,10 160,20 T320,20"
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-0 right-0 h-6"
          >
            <svg viewBox="0 0 320 40" className="w-full h-full">
              <path 
                fill={theme.primary.replace('bg-', '#').split('-')[0]} 
                fillOpacity="0.3"
              />
            </svg>
          </motion.div>
        </div>

        {/* Floating Cute Elements Around */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className={`absolute -top-2 -left-2 w-6 h-6 ${theme.light} rounded-full flex items-center justify-center text-white text-xs`}
        >
          
        </motion.div>
        
      </motion.div>
    </div>
  );
};

export default BottomNavigation;