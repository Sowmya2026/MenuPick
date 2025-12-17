import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useMeal } from "../context/MealContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Utensils,
  Save,
  Edit3,
  X,
  Leaf,
  Beef,
  Star,
  ChevronRight,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

const MealSelection = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    meals,
    categories,
    loading,
    getSubcategories,
    checkSubcategoryLimit,
    saveStudentSelections,
    fetchStudentSelections,
    studentSelections,
  } = useMeal();

  const [selectedMeals, setSelectedMeals] = useState({});
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [hasSavedSelections, setHasSavedSelections] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const userMessType = currentUser?.messPreference || "veg";

  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => meal.messType === userMessType);
  }, [meals, userMessType]);

  const activeMeals = useMemo(() => {
    return filteredMeals.filter((meal) => meal.category === activeCategory);
  }, [filteredMeals, activeCategory]);

  // Prevent back navigation - redirect to home
  useEffect(() => {
    // Replace current history entry to prevent going back to previous state
    window.history.replaceState(null, '', location.pathname);

    const handlePopState = (e) => {
      e.preventDefault();
      // When back button is pressed, go to home and clear this page from history
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  // Sync saved selections from context (Real-time)
  useEffect(() => {
    const syncSelections = async () => {
      if (currentUser?.uid) {
        // Check if we have data in context
        const contextData = studentSelections[currentUser.uid];

        if (contextData && contextData.selections && contextData.messType === userMessType) {
          setSelectedMeals(contextData.selections);
          setHasSavedSelections(true);
        } else {
          // If not in context yet, fetch it
          try {
            await fetchStudentSelections(currentUser.uid);
          } catch (error) {
            console.error("Error fetching selections:", error);
          }
        }
      }
    };
    syncSelections();
  }, [currentUser, userMessType, studentSelections, fetchStudentSelections]);

  // Count selections by category
  const getCategoryCount = (category) => {
    return Object.values(selectedMeals).filter((s) => s.category === category).length;
  };

  // Handle meal selection
  const handleMealSelect = (meal) => {
    if (hasSavedSelections && !isEditing) {
      toast.error("Please click Edit to make changes");
      return;
    }

    const isSelected = selectedMeals[meal.id];

    if (isSelected) {
      const updated = { ...selectedMeals };
      delete updated[meal.id];
      setSelectedMeals(updated);
      return;
    }

    const limitCheck = checkSubcategoryLimit(
      meal.category,
      meal.messType,
      meal.subcategory,
      selectedMeals
    );

    if (limitCheck.hasReachedLimit) {
      toast.error(`Cannot select more than ${limitCheck.maxAllowed} items from ${meal.subcategory}`);
      return;
    }

    setSelectedMeals({
      ...selectedMeals,
      [meal.id]: {
        timestamp: new Date().toISOString(),
        category: meal.category,
        subcategory: meal.subcategory,
      },
    });
  };

  // Save selections
  const saveSelections = async () => {
    if (Object.keys(selectedMeals).length === 0) {
      toast.error("Please select at least one meal");
      return;
    }

    setSaving(true);
    try {
      const mealDataMap = {};
      meals.forEach((m) => (mealDataMap[m.id] = m));

      await saveStudentSelections(currentUser.uid, userMessType, selectedMeals, mealDataMap);

      setHasSavedSelections(true);
      setIsEditing(false);
      toast.success("Selections saved successfully!");

      // Redirect to home after successful save (prevents back navigation to selection page)
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save selections");
    } finally {
      setSaving(false);
    }
  };

  const messIcons = {
    veg: <Leaf className="w-5 h-5" />,
    "non-veg": <Beef className="w-5 h-5" />,
    special: <Star className="w-5 h-5" />,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.colors.background }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4" style={{ borderColor: theme.colors.primary, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="pb-20" style={{ background: theme.colors.background }}>
      {/* Header */}
      <div className="px-6 py-6" style={{ background: theme.colors.card, borderBottom: `1px solid ${theme.colors.border}` }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: theme.colors.text }}>
              Meal Selection
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div style={{ color: theme.colors.primary }}>
                {messIcons[userMessType]}
              </div>
              <span className="text-sm font-medium" style={{ color: theme.colors.textSecondary }}>
                {userMessType.toUpperCase()} Mess
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: theme.colors.backgroundTertiary, color: theme.colors.primary }}>
                {Object.keys(selectedMeals).length} selected
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {hasSavedSelections && !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                style={{ background: theme.colors.backgroundTertiary, color: theme.colors.primary }}
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                {isEditing && (
                  <button
                    onClick={async () => {
                      const saved = await fetchStudentSelections(currentUser.uid);
                      if (saved && saved.selections) {
                        setSelectedMeals(saved.selections);
                      }
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                    style={{ background: theme.colors.backgroundSecondary, color: theme.colors.text }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={saveSelections}
                  disabled={saving || Object.keys(selectedMeals).length === 0}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white flex items-center gap-2"
                  style={{ background: theme.colors.primary }}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 py-4 overflow-x-auto scrollbar-hide" style={{ borderBottom: `1px solid ${theme.colors.border}` }}>
        <div className="flex gap-2">
          {categories.map((category) => {
            const count = getCategoryCount(category);
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="px-4 py-2 rounded-lg font-medium text-sm capitalize whitespace-nowrap transition-all"
                style={{
                  background: isActive ? theme.colors.primary : theme.colors.backgroundSecondary,
                  color: isActive ? "white" : theme.colors.text,
                  border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {category}
                {count > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs" style={{ background: isActive ? 'rgba(255,255,255,0.3)' : theme.colors.backgroundTertiary }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meals Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMeals.map((meal) => {
            const isSelected = !!selectedMeals[meal.id];

            return (
              <motion.button
                key={meal.id}
                onClick={() => handleMealSelect(meal)}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl text-left transition-all relative overflow-hidden"
                style={{
                  background: isSelected ? `${theme.colors.primary}20` : theme.colors.card,
                  border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: theme.colors.primary }}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: theme.colors.backgroundTertiary }}>
                    <Utensils className="w-6 h-6" style={{ color: theme.colors.primary }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ color: theme.colors.text }}>
                      {meal.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium capitalize" style={{ background: theme.colors.backgroundSecondary, color: theme.colors.textSecondary }}>
                        {meal.subcategory}
                      </span>
                    </div>
                  </div>
                </div>

                {meal.description && (
                  <p className="mt-3 text-sm line-clamp-2" style={{ color: theme.colors.textSecondary }}>
                    {meal.description}
                  </p>
                )}
              </motion.button>
            );
          })}
        </div>

        {activeMeals.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: theme.colors.textSecondary }} />
            <p className="text-lg font-medium" style={{ color: theme.colors.textSecondary }}>
              No meals available in this category
            </p>
          </div>
        )}
      </div>

      {/* Modal for meal details */}
      <AnimatePresence>
        {selectedMeal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMeal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md rounded-3xl overflow-hidden shadow-2xl z-50"
              style={{ background: theme.colors.card }}
            >
              <div className="p-6">
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: theme.colors.backgroundSecondary }}
                >
                  <X className="w-5 h-5" style={{ color: theme.colors.text }} />
                </button>

                <h2 className="text-2xl font-bold mb-4" style={{ color: theme.colors.text }}>
                  {selectedMeal.name}
                </h2>
                <p style={{ color: theme.colors.textSecondary }}>
                  {selectedMeal.description}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MealSelection;
