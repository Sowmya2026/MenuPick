import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { useTheme } from "../context/ThemeContext";
import Layout from "../components/Layout";
import {
  Calendar,
  Clock,
  ChefHat,
  Coffee,
  Sun,
  Moon,
  Utensils,
  X,
  Leaf,
  Beef,
  Star,
  Sandwich,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const {
    selectedMess,
    setSelectedMess,
    selectedDay,
    setSelectedDay,
    getMenuItems,
    getMealTiming,
    days,
    setIsMenuModalOpen,
  } = useMenu();

  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Sync modal state with context
  useEffect(() => {
    setIsMenuModalOpen(!!selectedMeal);
  }, [selectedMeal, setIsMenuModalOpen]);

  // Set default mess type based on student's preference
  useEffect(() => {
    if (currentUser?.messPreference) {
      setSelectedMess(currentUser.messPreference);
    }
  }, [currentUser, setSelectedMess]);

  // Set current date and greeting
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);

    const hour = date.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Set current day
    const today = date.toLocaleDateString("en-US", { weekday: "long" });
    if (days.includes(today)) {
      setSelectedDay(today);
    }
  }, [days, setSelectedDay]);

  // Mess configurations
  const messConfig = {
    veg: { name: "Veg", Icon: Leaf },
    "non-veg": { name: "Non-Veg", Icon: Beef },
    special: { name: "Special", Icon: Star },
  };

  // Meal times
  const mealTimes = [
    { id: "breakfast", name: "Breakfast", Icon: Coffee },
    { id: "lunch", name: "Lunch", Icon: Sun },
    { id: "snacks", name: "Snacks", Icon: Sandwich },
    { id: "dinner", name: "Dinner", Icon: Moon },
  ];

  const openMealModal = (meal) => {
    const items = getMenuItems(selectedMess, selectedDay, meal.id);
    const timing = getMealTiming(selectedDay, meal.id);
    setSelectedMeal({ ...meal, items, timing });
  };

  return (
    <Layout>
      <div
        className="pb-20 overflow-x-hidden"
        style={{ background: theme.colors.background }}
      >
        {/* Header - Centered */}
        <div className="px-4 pt-4 pb-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: theme.colors.text }}
            >
              {greeting}, {currentUser?.name?.split(" ")[0] || "Student"}!
            </h1>
            <div
              className="flex items-center justify-center gap-2 text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
          </motion.div>
        </div>

        {/* Mess Type Selection - Segmented Control */}
        <div className="px-4 mb-3">
          <div className="flex justify-center">
            <div
              className="inline-flex rounded-full p-1 gap-1"
              style={{
                background: theme.colors.backgroundSecondary,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              {Object.entries(messConfig).map(([key, config]) => {
                const isSelected = selectedMess === key;
                const MessIcon = config.Icon;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMess(key)}
                    className="relative px-4 py-2 rounded-full flex items-center gap-2 transition-all"
                    style={{
                      background: isSelected
                        ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`
                        : 'transparent',
                      color: isSelected ? "white" : theme.colors.textSecondary,
                    }}
                  >
                    <MessIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{config.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Day Selection - Scrollable with Hidden Scrollbar */}
        <div className="px-4 mb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {days.map((day) => {
              const isSelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`
                      : theme.colors.backgroundSecondary,
                    color: isSelected ? "white" : theme.colors.text,
                    border: `1px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                  }}
                >
                  {day.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meal Cards - 2 Column Grid with Centered Content */}
        <div className="px-4 grid grid-cols-2 gap-3">
          {mealTimes.map((meal, index) => {
            const items = getMenuItems(selectedMess, selectedDay, meal.id);
            const timing = getMealTiming(selectedDay, meal.id);
            const MealIcon = meal.Icon;

            return (
              <motion.button
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openMealModal(meal)}
                className="p-4 rounded-2xl text-center transition-all hover:shadow-lg active:scale-95"
                style={{
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Icon with gradient background - Centered */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primaryLight}20, ${theme.colors.primary}15)`,
                    }}
                  >
                    <MealIcon className="w-7 h-7" style={{ color: theme.colors.primary }} strokeWidth={2} />
                  </div>

                  {/* Meal Info - Centered */}
                  <div>
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: theme.colors.text }}
                    >
                      {meal.name}
                    </h3>
                    <div
                      className="flex items-center justify-center gap-1 text-xs"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timing}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog */}
      <AnimatePresence>
        {selectedMeal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMeal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl rounded-3xl overflow-hidden shadow-2xl z-50"
              style={{ background: theme.colors.card }}
            >
              {/* Modal Header */}
              <div
                className="p-6 border-b"
                style={{
                  background: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: theme.colors.backgroundTertiary }}
                    >
                      <selectedMeal.Icon
                        className="w-6 h-6"
                        style={{ color: theme.colors.primary }}
                      />
                    </div>
                    <div>
                      <h2
                        className="text-xl font-bold"
                        style={{ color: theme.colors.text }}
                      >
                        {selectedMeal.name}
                      </h2>
                      <div
                        className="flex items-center gap-1 text-sm"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{selectedMeal.timing}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMeal(null)}
                    className="p-2 rounded-xl transition-all"
                    style={{
                      background: theme.colors.backgroundTertiary,
                      color: theme.colors.text,
                    }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100% - 120px)" }}>
                {selectedMeal.items && selectedMeal.items.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMeal.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: theme.colors.backgroundSecondary }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                          style={{
                            background: theme.colors.primary,
                            color: "white",
                          }}
                        >
                          {index + 1}
                        </div>
                        <p
                          className="flex-1 text-sm font-medium"
                          style={{ color: theme.colors.text }}
                        >
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-12"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No items available for this meal</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Home;
