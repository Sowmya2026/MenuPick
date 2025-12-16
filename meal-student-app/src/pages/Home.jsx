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
        className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gray-50/50 md:h-auto md:overflow-visible md:min-h-[calc(100vh-64px)]"
        style={{ background: theme.colors.background }}
      >
        <div className="md:max-w-6xl md:mx-auto w-full flex flex-col h-full">
          {/* === Header Section: Spacious & Clean === */}
          <div className="px-6 pt-6 pb-2 flex-shrink-0 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">

            {/* Row 1: Big Greeting (Full Width on Mobile, Left on Desktop) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:flex-1"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 mb-2" style={{ color: theme.colors.text }}>
                <Calendar className="w-3 h-3" />
                <span>{currentDate}</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight leading-none md:text-4xl" style={{ color: theme.colors.text }}>
                {greeting}, <br />
                <span className="text-4xl md:text-5xl" style={{ color: theme.colors.primary }}>
                  {currentUser?.name?.split(" ")[0] || "Student"}!
                </span>
              </h1>
            </motion.div>

            {/* Row 2: Control Center (Mess + Days) */}
            <div className="flex flex-col gap-4 md:w-[450px]">
              {/* Mess Type Selector - Full Width Segmented Control */}
              <div
                className="flex p-1.5 rounded-2xl border shadow-sm"
                style={{
                  background: theme.colors.card,
                  borderColor: theme.colors.border
                }}
              >
                {Object.entries(messConfig).map(([key, config]) => {
                  const isSelected = selectedMess === key;
                  const MessIcon = config.Icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedMess(key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${isSelected ? 'shadow-sm' : ''}`}
                      style={{
                        background: isSelected ? theme.colors.primary : 'transparent',
                        color: isSelected ? '#fff' : theme.colors.textSecondary
                      }}
                    >
                      <MessIcon className="w-3.5 h-3.5" />
                      <span>{config.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Day Selector - Clean Horizontal Strip */}
              <div className="relative">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mask-linear py-1">
                  {days.map((day) => {
                    const isSelected = selectedDay === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className="min-w-[4rem] py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 border cursor-pointer hover:opacity-80"
                        style={{
                          background: isSelected ? theme.colors.primary : theme.colors.card,
                          color: isSelected ? '#fff' : theme.colors.text,
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        }}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* === Main Content: Meal Grid - No Scroll, Perfect Fit === */}
          <div className="flex-1 px-6 pb-24 mt-2 overflow-hidden">
            <div className="h-full grid grid-cols-2 grid-rows-2 gap-3 md:grid-cols-4 md:grid-rows-1 md:gap-6 md:h-auto md:pb-0">
              {mealTimes.map((meal, index) => {
                const timing = getMealTiming(selectedDay, meal.id);
                const MealIcon = meal.Icon;

                return (
                  <motion.button
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openMealModal(meal)}
                    className="group relative rounded-[20px] p-3 text-center transition-all hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center border shadow-sm hover:shadow-md bg-white w-full h-full md:h-64"
                    style={{
                      borderColor: theme.colors.border,
                    }}
                  >
                    {/* Floating Icon Bubble */}
                    <div
                      className="w-10 h-10 mb-2 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-1 shadow-inner md:w-16 md:h-16 md:mb-5"
                      style={{
                        background: theme.colors.background,
                      }}
                    >
                      <MealIcon className="w-5 h-5 md:w-8 md:h-8" style={{ color: theme.colors.primary }} strokeWidth={2} />
                    </div>

                    {/* Content Container */}
                    <div className="w-full space-y-1 lead-none md:space-y-3">
                      <h3 className="text-sm font-bold md:text-lg" style={{ color: theme.colors.text }}>
                        {meal.name}
                      </h3>

                      {/* Time Badge */}
                      <div
                        className="inline-flex items-center justify-center gap-1 px-1.5 py-1 rounded-lg text-[9px] uppercase font-bold tracking-wide bg-gray-100 w-full md:text-xs md:py-1.5"
                        style={{
                          color: theme.colors.textSecondary,
                          backgroundColor: theme.colors.backgroundSecondary
                        }}
                      >
                        <Clock className="w-2.5 h-2.5 flex-shrink-0 md:w-3.5 md:h-3.5" />
                        <span className="whitespace-nowrap">{timing.replace(/\s/g, '')}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
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
