import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../components/Logo";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Bell,
  Star,
  ChefHat,
} from "lucide-react";

const Onboarding = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: ChefHat,
      title: "Welcome to MenuPick",
      description: "Your personal campus dining companion. Discover meals, plan your week, and never miss a meal.",
      color: theme.colors.primary,
    },
    {
      icon: Calendar,
      title: "Plan Your Meals",
      description: "Browse weekly menus, select your favorites, and have your meal plan ready in advance.",
      color: theme.colors.primary,
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Get notified before meal times so you never miss breakfast, lunch, or dinner.",
      color: theme.colors.primary,
    },
    {
      icon: Star,
      title: "Share Feedback",
      description: "Rate your meals and help improve the dining experience for everyone on campus.",
      color: theme.colors.primary,
    },
  ];

  const handleNext = () => {
    console.log("handleNext called, currentSlide:", currentSlide, "total slides:", slides.length);
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      console.log("Completing onboarding and navigating to /signin");
      // Mark onboarding as complete
      localStorage.setItem('hasCompletedOnboarding', 'true');
      // Force page reload to update AppContent state
      window.location.href = '/signin';
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    console.log("Skip button clicked, navigating to /signin");
    // Mark onboarding as complete
    localStorage.setItem('hasCompletedOnboarding', 'true');
    // Force page reload to update AppContent state
    window.location.href = '/signin';
  };

  return (
    <div
      className="min-h-screen flex flex-col p-6"
      style={{ background: theme.colors.background }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Logo size="md" withText={true} />
        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: theme.colors.backgroundTertiary,
            color: theme.colors.primary,
          }}
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-8"
              >
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-3xl flex items-center justify-center mb-6"
                  style={{
                    background: `${theme.colors.primary}20`,
                  }}
                >
                  {(() => {
                    const IconComponent = slides[currentSlide].icon;
                    return (
                      <IconComponent
                        className="w-12 h-12 sm:w-16 sm:h-16"
                        style={{ color: slides[currentSlide].color }}
                        strokeWidth={2}
                      />
                    );
                  })()}
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                style={{ color: theme.colors.text }}
              >
                {slides[currentSlide].title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg max-w-md mx-auto px-4"
                style={{ color: theme.colors.textSecondary }}
              >
                {slides[currentSlide].description}
              </motion.p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="transition-all rounded-full"
              style={{
                width: currentSlide === index ? "32px" : "8px",
                height: "8px",
                background: currentSlide === index ? theme.colors.primary : theme.colors.border,
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold flex items-center gap-2 transition-all"
              style={{
                background: theme.colors.backgroundSecondary,
                color: theme.colors.text,
              }}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
            style={{
              background: theme.colors.primary,
            }}
          >
            {currentSlide === slides.length - 1 ? (
              "Get Started"
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;