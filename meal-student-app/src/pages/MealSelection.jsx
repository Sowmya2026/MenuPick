import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Utensils,
  Edit3,
  X,
  Save,
  RotateCcw,
  ChevronDown,
  ChefHat,
  Calendar,
  Info,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { useMeal } from "../context/MealContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const MealSelection = () => {
  const {
    meals,
    categories,
    loading,
    getSubcategories,
    checkSubcategoryLimit,
    saveStudentSelections,
    MAX_ITEMS,
    fetchStudentSelections,
    clearStudentSelections, // Add this function to your context
  } = useMeal();
  const { currentUser } = useAuth();
  const [selectedMeals, setSelectedMeals] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("breakfast");
  const [activeSubcategory, setActiveSubcategory] = useState({});
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [selectionLimits, setSelectionLimits] = useState({});
  const [mealDataMap, setMealDataMap] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [hasSavedSelections, setHasSavedSelections] = useState(false);

  // New state for view mode and filter visibility
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  // Get user's mess type from profile
  const userMessType = currentUser?.messPreference || "veg";

  // Track previous mess type to detect changes
  const [previousMessType, setPreviousMessType] = useState(userMessType);

  // Add this useEffect to load from localStorage after component mounts
  useEffect(() => {
    const savedViewMode = localStorage.getItem("mealViewMode");
    console.log("Loaded from localStorage:", savedViewMode);
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Replace your existing toggleViewMode function with this:
  const handleViewModeChange = (mode) => {
    console.log("Changing view mode to:", mode);
    setViewMode(mode);
    localStorage.setItem("mealViewMode", mode);
    console.log("Saved to localStorage:", localStorage.getItem("mealViewMode"));
  };

  // Update your toggle function to use the new handler:
  const toggleViewMode = () => {
    const newMode = viewMode === "grid" ? "list" : "grid";
    handleViewModeChange(newMode);
  };

  // Effect to handle mess type changes - CORRECTED LOGIC
  useEffect(() => {
    // Check if mess type has changed
    if (previousMessType !== userMessType) {
      console.log(`Mess type changed from ${previousMessType} to ${userMessType}`);
      
      const handleMessTypeChange = async () => {
        try {
          // Clear selections from Firestore for the previous mess type
          if (currentUser?.uid) {
            await clearStudentSelections(currentUser.uid, previousMessType);
            console.log(`Cleared selections for ${previousMessType} mess`);
          }
          
          // Clear local state
          setSelectedMeals({});
          updateSelectionLimits({});
          setHasSavedSelections(false);
          setIsEditing(false);
          
          // Load fresh selections for new mess type (should be empty)
          const savedSelections = await fetchStudentSelections(currentUser.uid);
          if (savedSelections && savedSelections.selections && savedSelections.messType === userMessType) {
            setSelectedMeals(savedSelections.selections);
            updateSelectionLimits(savedSelections.selections);
            setHasSavedSelections(true);
          } else {
            // Ensure selections are empty for new mess type
            setSelectedMeals({});
            updateSelectionLimits({});
            setHasSavedSelections(false);
          }

          // Show notification to user
          toast.success(
            `Mess type changed from ${previousMessType} to ${userMessType}. Previous selections have been cleared.`,
            {
              duration: 4000,
            }
          );
        } catch (error) {
          console.error("Error handling mess type change:", error);
          toast.error("Error clearing previous selections");
        }
      };

      handleMessTypeChange();
      
      // Update previous mess type
      setPreviousMessType(userMessType);
    }
  }, [userMessType, previousMessType, currentUser, clearStudentSelections, fetchStudentSelections]);

  // Create a map of meal data for easy access
  useEffect(() => {
    const map = {};
    meals.forEach((meal) => {
      map[meal.id] = meal;
    });
    setMealDataMap(map);
  }, [meals]);

  // Color scheme based on mess type
  const colorScheme = useMemo(() => {
    switch (userMessType) {
      case "veg":
        return {
          primary: "green",
          light: "emerald",
          gradientFrom: "from-green-50",
          gradientTo: "to-emerald-50",
          text: "text-green-700",
          bg: "bg-green-100",
          border: "border-green-200",
          hover: "hover:bg-green-200",
          active: "bg-green-600",
          badge: "bg-green-100 text-green-800 border-green-200",
        };
      case "non-veg":
        return {
          primary: "red",
          light: "orange",
          gradientFrom: "from-red-50",
          gradientTo: "to-orange-50",
          text: "text-red-700",
          bg: "bg-red-100",
          border: "border-red-200",
          hover: "hover:bg-red-200",
          active: "bg-red-600",
          badge: "bg-red-100 text-red-800 border-red-200",
        };
      case "mixed":
      default:
        return {
          primary: "purple",
          light: "violet",
          gradientFrom: "from-purple-50",
          gradientTo: "to-violet-50",
          text: "text-purple-700",
          bg: "bg-purple-100",
          border: "border-purple-200",
          hover: "hover:bg-purple-200",
          active: "bg-purple-600",
          badge: "bg-purple-100 text-purple-800 border-purple-200",
        };
    }
  }, [userMessType]);

  // Get filtered meals by user's mess type
  const filteredMeals = useMemo(() => {
    return meals.filter((meal) => meal.messType === userMessType);
  }, [meals, userMessType]);

  // Get all subcategories for each category
  const categorySubcategories = useMemo(() => {
    const subcats = {};
    categories.forEach((category) => {
      subcats[category] = getSubcategories(category, userMessType);
    });
    return subcats;
  }, [categories, userMessType, getSubcategories]);

  // Set default subcategory for each category when it loads
  useEffect(() => {
    const initialSubcategories = {};
    categories.forEach((category) => {
      if (
        categorySubcategories[category] &&
        categorySubcategories[category].length > 0
      ) {
        initialSubcategories[category] = categorySubcategories[category][0];
      }
    });
    setActiveSubcategory(initialSubcategories);
  }, [categories, categorySubcategories, userMessType]);

  // Get meals for the active category and subcategory
  const activeMeals = useMemo(() => {
    return filteredMeals.filter(
      (meal) =>
        meal.category === activeCategory &&
        meal.subcategory === activeSubcategory[activeCategory]
    );
  }, [filteredMeals, activeCategory, activeSubcategory]);

  // Calculate selection counts
  const selectionCounts = useMemo(() => {
    return Object.keys(selectedMeals).length;
  }, [selectedMeals]);

  // Function to update selection limits
  const updateSelectionLimits = (selections) => {
    const limits = {};

    // Initialize limits for all categories and subcategories
    categories.forEach((category) => {
      const subcategories = getSubcategories(category, userMessType);
      subcategories.forEach((subcategory) => {
        const key = `${category}-${subcategory}`;
        const currentCount = Object.values(selections).filter(
          (selection) =>
            selection.category === category &&
            selection.subcategory === subcategory
        ).length;

        const maxAllowed =
          MAX_ITEMS[category]?.[userMessType]?.[subcategory] || 0;

        limits[key] = {
          currentCount,
          maxAllowed,
          hasReachedLimit: currentCount >= maxAllowed,
        };
      });
    });

    setSelectionLimits(limits);
  };

  // Handle meal selection
  const handleMealSelect = (mealId) => {
    // Only allow selection if in edit mode or if selections haven't been saved yet
    if (hasSavedSelections && !isEditing) {
      toast.error('Please click "Edit Selections" to make changes');
      return;
    }

    const meal = mealDataMap[mealId];
    if (!meal) return;

    // Check if already selected
    if (selectedMeals[mealId]) {
      const updatedSelections = { ...selectedMeals };
      delete updatedSelections[mealId];
      setSelectedMeals(updatedSelections);
      updateSelectionLimits(updatedSelections);
      return;
    }

    // Check limit before adding
    const limitCheck = checkSubcategoryLimit(
      meal.category,
      meal.messType,
      meal.subcategory,
      selectedMeals
    );

    if (limitCheck.hasReachedLimit) {
      toast.error(
        `Cannot select more than ${limitCheck.maxAllowed} items from ${meal.subcategory}`
      );
      return;
    }

    // Add selection
    setSelectedMeals((prev) => {
      const updated = {
        ...prev,
        [mealId]: {
          timestamp: new Date().toISOString(),
          category: meal.category,
          subcategory: meal.subcategory,
        },
      };
      updateSelectionLimits(updated);
      return updated;
    });
  };

  // Clear all selections
  const clearSelections = () => {
    if (Object.keys(selectedMeals).length > 0) {
      if (window.confirm("Are you sure you want to clear all selections?")) {
        setSelectedMeals({});
        updateSelectionLimits({});
        setHasSavedSelections(false);
        setIsEditing(false);
        toast.success("Selections cleared");
      }
    }
  };

  // Save selections
  const saveSelections = async () => {
    if (selectionCounts === 0) {
      toast.error("Please select at least one meal");
      return;
    }

    setSaving(true);
    try {
      // Save to context (which will save to Firestore)
      await saveStudentSelections(
        currentUser.uid,
        userMessType,
        selectedMeals,
        mealDataMap
      );

      // Clear localStorage to avoid conflicts
      localStorage.removeItem("mealSelections");

      setHasSavedSelections(true);
      setIsEditing(false);
      toast.success("Meal selections saved successfully!");
    } catch (error) {
      console.error("Error saving selections:", error);
      toast.error("Failed to save selections");
    } finally {
      setSaving(false);
    }
  };

  // Enable edit mode
  const enableEditMode = () => {
    setIsEditing(true);
    toast.success("You can now edit your selections");
  };

  // Cancel edit mode and reload original selections
  const cancelEdit = async () => {
    try {
      // Reload selections from Firestore
      const savedSelections = await fetchStudentSelections(currentUser.uid);
      if (savedSelections && savedSelections.selections && savedSelections.messType === userMessType) {
        setSelectedMeals(savedSelections.selections);
        updateSelectionLimits(savedSelections.selections);
      } else {
        setSelectedMeals({});
        updateSelectionLimits({});
      }
      setIsEditing(false);
      toast.success("Edit mode cancelled");
    } catch (error) {
      console.error("Error loading saved selections:", error);
      toast.error("Failed to load saved selections");
    }
  };

  // Load saved selections from Firestore on component mount - CORRECTED LOGIC
  useEffect(() => {
    const loadSavedSelections = async () => {
      if (currentUser?.uid) {
        try {
          const savedSelections = await fetchStudentSelections(currentUser.uid);
          
          // Only load selections if they match the current mess type
          if (savedSelections && savedSelections.selections && savedSelections.messType === userMessType) {
            setSelectedMeals(savedSelections.selections);
            updateSelectionLimits(savedSelections.selections);
            setHasSavedSelections(true);
            console.log(`Loaded ${Object.keys(savedSelections.selections).length} selections for ${userMessType} mess`);
          } else {
            // If mess type doesn't match, ensure selections are empty
            setSelectedMeals({});
            updateSelectionLimits({});
            setHasSavedSelections(false);
            console.log(`No selections found or mess type mismatch for ${userMessType}`);
          }
        } catch (error) {
          console.error("Error loading saved selections:", error);
          // On error, ensure selections are empty
          setSelectedMeals({});
          updateSelectionLimits({});
          setHasSavedSelections(false);
        }
      }
    };

    loadSavedSelections();
  }, [currentUser, fetchStudentSelections, userMessType]);

  // Toggle category filter visibility
  const toggleCategoryFilter = () => {
    setShowCategoryFilter((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Selection Summary Component
  const SelectionSummary = () => {
    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
        <h4 className="text-xs font-medium text-gray-800 mb-2 flex items-center">
          <Info className="h-3 w-3 mr-1.5 text-blue-500" />
          Selection Limits Summary
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {categories.map((category) => {
            const subcategories = getSubcategories(category, userMessType);
            return subcategories.map((subcategory) => {
              const key = `${category}-${subcategory}`;
              const limit = selectionLimits[key] || {
                currentCount: 0,
                maxAllowed: 0,
              };

              return (
                <div
                  key={key}
                  className="bg-white rounded-md p-2 border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {category} - {subcategory}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        limit.currentCount >= limit.maxAllowed
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {limit.currentCount}/{limit.maxAllowed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full ${
                        limit.currentCount >= limit.maxAllowed
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (limit.currentCount / limit.maxAllowed) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white ">
    <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-8 font-sans">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Monthly Meal Selection
        </h1>
      </div>
      {/* Compact Header with Edit Selection Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-3">
          {/* Mess Type Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className={`h-2 w-2 rounded-full mr-1 ${
                userMessType === "veg"
                  ? "bg-green-500"
                  : userMessType === "non-veg"
                  ? "bg-red-500"
                  : "bg-purple-500"
              }`}
            ></div>
            <span className="font-medium capitalize">{userMessType} Mess</span>
            <span className="text-xs">({selectionCounts} selected)</span>
          </div>
        </div>
      </div>

      {/* Main Container - Flat Design */}
      <div className="bg-white border border-gray-200 overflow-hidden mb-4">
        {/* Controls Section - Compact */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              {/* Buttons on the left side */}
              {hasSavedSelections && !isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={enableEditMode}
                  className={`px-3 py-1.5 text-sm bg-${colorScheme.primary}-100 text-${colorScheme.primary}-800 rounded-md flex items-center transition-all hover:bg-${colorScheme.primary}-200 border ${colorScheme.border}`}
                >
                  <Edit3 className="h-3 w-3 mr-1.5" />
                  Edit
                </motion.button>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={isEditing ? cancelEdit : clearSelections}
                    className={`px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded-md flex items-center transition-all hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${colorScheme.border}`}
                    disabled={
                      Object.keys(selectedMeals).length === 0 && !isEditing
                    }
                  >
                    {isEditing ? (
                      <>
                        <X className="h-3 w-3 mr-1.5" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-3 w-3 mr-1.5" />
                        Clear
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveSelections}
                    className={`px-3 py-1.5 text-sm bg-${colorScheme.primary}-600 text-white rounded-md flex items-center transition-all hover:bg-${colorScheme.primary}-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={saving || selectionCounts === 0}
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1.5" />
                        {isEditing ? "Update" : "Save"}
                      </>
                    )}
                  </motion.button>
                </div>
              )}
              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleCategoryFilter}
                className={`flex items-center px-2 py-1.5 text-xs rounded-md border ${colorScheme.border} bg-white hover:bg-gray-50 transition-colors`}
              >
                <Filter className="h-3 w-3 mr-1.5" />
                <span className="font-medium text-gray-700">Filter</span>
              </motion.button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-md p-0.5 border border-gray-300">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewModeChange("grid")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-xs border border-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-3 w-3" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleViewModeChange("list")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-xs border border-gray-300"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  title="List View"
                >
                  <List className="h-3 w-3" />
                </motion.button>
              </div>
            </div>

            <div className="text-xs text-gray-600">
              {filteredMeals.length} meals available
            </div>
          </div>
        </div>

        {/* Category Navigation - Compact */}
        <AnimatePresence>
          {showCategoryFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-gray-200 overflow-hidden"
            >
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <Calendar
                    className={`h-3 w-3 mr-1.5 text-${colorScheme.primary}-600`}
                  />
                  Select Category
                </h3>

                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center ${
                        activeCategory === category
                          ? `bg-${colorScheme.primary}-600 text-white shadow-sm`
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        setActiveCategory(category);
                        setShowSubcategoryDropdown(false);
                      }}
                    >
                      <span className="capitalize font-medium">{category}</span>
                      {activeCategory === category && (
                        <ChevronDown
                          className="h-3 w-3 ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowSubcategoryDropdown(
                              !showSubcategoryDropdown
                            );
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Subcategory Dropdown */}
                <AnimatePresence>
                  {showSubcategoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`mt-2 bg-gray-50 rounded-lg p-2 border ${colorScheme.border}`}
                    >
                      <h4 className="text-xs font-medium text-gray-800 mb-1">
                        Select Subcategory
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {categorySubcategories[activeCategory]?.map(
                          (subcategory) => (
                            <motion.button
                              key={subcategory}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`px-2 py-1 rounded-md text-xs transition-all ${
                                activeSubcategory[activeCategory] ===
                                subcategory
                                  ? `${colorScheme.bg} ${colorScheme.text} border ${colorScheme.border}`
                                  : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                setActiveSubcategory((prev) => ({
                                  ...prev,
                                  [activeCategory]: subcategory,
                                }));
                                setShowSubcategoryDropdown(false);
                              }}
                            >
                              <span className="capitalize">{subcategory}</span>
                            </motion.button>
                          )
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Category Title - Compact */}
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-900 capitalize flex items-center">
            <Utensils
              className={`h-4 w-4 mr-1.5 text-${colorScheme.primary}-600`}
            />
            {activeCategory} - {activeSubcategory[activeCategory]}
          </h2>
        </div>

        {/* Meal Cards Container - Compact */}
        <div className="p-2">
          {activeMeals.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "bg-white rounded-md shadow-xs border border-gray-200 overflow-hidden divide-y divide-gray-200"
              }
            >
              <AnimatePresence>
                {activeMeals
                  .sort((a, b) => {
                    const aSelected = !!selectedMeals[a.id];
                    const bSelected = !!selectedMeals[b.id];
                    if (aSelected && !bSelected) return -1;
                    if (!aSelected && bSelected) return 1;
                    return 0;
                  })
                  .map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      isSelected={!!selectedMeals[meal.id]}
                      onSelect={handleMealSelect}
                      colorScheme={colorScheme}
                      selectedMeals={selectedMeals}
                      checkSubcategoryLimit={checkSubcategoryLimit}
                      isEditing={isEditing}
                      hasSavedSelections={hasSavedSelections}
                      viewMode={viewMode}
                    />
                  ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex items-center justify-center h-10 w-10 bg-white rounded-md mx-auto mb-2 shadow-xs border border-gray-200">
                <Utensils className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-700 font-medium">
                No meals available
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Try a different category or subcategory
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compact Selection Summary */}
      <SelectionSummary />
    </div>
    </div>
  );
};

// Updated MealCard component with all UI requirements
const MealCard = ({
  meal,
  isSelected,
  onSelect,
  colorScheme,
  selectedMeals,
  checkSubcategoryLimit,
  isEditing,
  hasSavedSelections,
  viewMode,
}) => {
  const limitCheck = checkSubcategoryLimit(
    meal.category,
    meal.messType,
    meal.subcategory,
    selectedMeals
  );

  const isLimitReached = limitCheck.hasReachedLimit && !isSelected;
  const canSelect = !isLimitReached && (isEditing || !hasSavedSelections);
  const showEditColors = isEditing && !isSelected;

  // Color classes based on theme
  const primaryColor = colorScheme.primary;
  const selectedBg = `bg-${primaryColor}-50`;
  const selectedText = `text-${primaryColor}-700`;
  const selectedBorder = `border-${primaryColor}-200`;
  const selectedIcon = `text-${primaryColor}-600`;

  // Edit mode colors for non-selected cards
  const editTextColor = `text-${primaryColor}-600`;
  const editLightTextColor = `text-${primaryColor}-500`;

  const cardBg = isSelected ? selectedBg : "bg-white";
  const cardBorder = isSelected ? selectedBorder : "border-gray-200";

  // State for read more functionality
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsReadMore, setNeedsReadMore] = useState(false);

  // Check if description needs read more
  useEffect(() => {
    if (meal.description && meal.description.length > 60) {
      setNeedsReadMore(true);
    }
  }, [meal.description]);

  const toggleReadMore = (e) => {
    e?.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  if (viewMode === "list") {
    //list View
    return (
      <motion.div
        key={meal.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className={`p-3 border-b ${cardBg} ${cardBorder} last:border-b-0`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            {/* Image/Icon Section */}
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center ${
                isSelected ? "bg-white" : "bg-gray-50"
              } border ${
                isSelected ? selectedBorder : "border-gray-200"
              } mr-3 relative`}
            >
              {meal.image ? (
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Utensils className="h-5 w-5 text-gray-400" />
              )}

            </div>

            {/* Content Section */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {meal.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs capitalize ${
                        showEditColors ? editLightTextColor : "text-gray-500"
                      }`}
                    >
                      {meal.category}
                    </span>
                    {meal.subcategory && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span
                          className={`text-xs capitalize ${
                            showEditColors
                              ? editLightTextColor
                              : "text-gray-500"
                          }`}
                        >
                          {meal.subcategory}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description with Read More animation */}
              <div className="mt-2">
                <motion.p
                  className={`text-sm ${
                    showEditColors ? editTextColor : "text-gray-500"
                  } transition-all duration-300`}
                  style={{
                    WebkitLineClamp: isExpanded ? "unset" : 2,
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {meal.description}
                </motion.p>
              </div>

              {/* Nutrition - Plain text only, no borders */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {meal.nutrition?.calories > 0 && (
                  <span
                    className={`text-xs ${
                      showEditColors ? editTextColor : "text-gray-600"
                    }`}
                  >
                    {meal.nutrition.calories} cal
                  </span>
                )}
                {meal.nutrition?.protein > 0 && (
                  <span
                    className={`text-xs ${
                      showEditColors ? editTextColor : "text-gray-600"
                    }`}
                  >
                    {meal.nutrition.protein}g protein
                  </span>
                )}

                {meal.tags &&
                  meal.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs ${
                        showEditColors ? editLightTextColor : "text-gray-500"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Select Button - Changes to Undo in edit mode when selected */}
          <motion.button
            whileHover={canSelect ? { scale: 1.05 } : {}}
            whileTap={canSelect ? { scale: 0.95 } : {}}
            onClick={() => canSelect && onSelect(meal.id)}
            disabled={!canSelect}
            className={`ml-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 min-w-[100px] ${
              isSelected
                ? isEditing
                  ? `bg-red-50 text-red-700 border border-red-200 hover:bg-red-100` // Undo button style
                  : `${selectedBg} ${selectedText} ${selectedBorder}`
                : !canSelect
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : showEditColors
                ? `bg-${primaryColor}-50 text-${primaryColor}-700 border border-${primaryColor}-200 hover:bg-${primaryColor}-100`
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {isSelected
              ? isEditing
                ? "Undo"
                : "Selected"
              : !canSelect
              ? hasSavedSelections && !isEditing
                ? "Edit"
                : "Limit"
              : "Select"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      key={meal.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col ${cardBg} ${cardBorder} ${
        showEditColors ? `ring-1 ring-${primaryColor}-200` : ""
      }`}
    >
      {/* Image/Icon Section */}
      <div
        className={`h-24 sm:h-32 overflow-hidden relative ${
          isSelected ? "bg-white" : "bg-gray-50"
        } flex-shrink-0`}
      >
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
        )}

        {/* Selection Status - Top Left */}
        {isSelected && (
          <div className="absolute top-2 left-2">
            <CheckCircle
              className={`h-4 w-4 sm:h-5 sm:w-5 ${selectedIcon} bg-white rounded-full p-0.5`}
            />
          </div>
        )}

        {/* Category Badge - Bottom Left */}
        <div className="absolute top-2 right-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
              showEditColors
                ? `bg-${primaryColor}-100 ${editTextColor}`
                : "bg-white bg-opacity-90 text-gray-700"
            }`}
          >
            {meal.category}
          </span>
        </div>
      </div>

      {/* Content Section - Flex column to maintain equal height */}
      <div className="p-2 sm:p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-1 sm:mb-2 flex-shrink-0">
          <h3 className="font-medium text-gray-900 text-xs sm:text-sm truncate flex-1">
            {meal.name}
          </h3>

          {/* Selection Info */}
          <span
            className={`text-xs ml-2 whitespace-nowrap flex-shrink-0 ${
              showEditColors ? editLightTextColor : "text-gray-500"
            }`}
          >
            {limitCheck.currentCount}/{limitCheck.maxAllowed}
          </span>
        </div>

        {/* Description with Working Read More Animation */}
        <div className="mb-2 sm:mb-3 flex-1 min-h-[60px]">
          <motion.p
            className={`text-xs transition-all duration-300 ${
              showEditColors ? editTextColor : "text-gray-500"
            } leading-relaxed`}
            style={{
              WebkitLineClamp: isExpanded ? "unset" : 3,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: needsReadMore ? "60px" : "auto",
            }}
          >
            {meal.description}
          </motion.p>
        </div>

        {/* Nutrition - Plain text only, no borders */}
        <div className="flex flex-wrap gap-3 mb-2 sm:mb-3 flex-shrink-0">
          {meal.nutrition?.calories > 0 && (
            <span
              className={`text-xs ${
                showEditColors ? editTextColor : "text-gray-600"
              }`}
            >
              {meal.nutrition.calories} cal
            </span>
          )}
          {meal.nutrition?.protein > 0 && (
            <span
              className={`text-xs ${
                showEditColors ? editTextColor : "text-gray-600"
              }`}
            >
              {meal.nutrition.protein}g protein
            </span>
          )}

          {meal.tags &&
            meal.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className={`text-xs ${
                  showEditColors ? editLightTextColor : "text-gray-500"
                }`}
              >
                {tag}
              </span>
            ))}
        </div>

        <div className="flex items-center justify-between flex-shrink-0">
          <div
            className={`text-xs capitalize ${
              showEditColors ? editLightTextColor : "text-gray-500"
            }`}
          >
            {meal.subcategory || "General"}
          </div>

          {/* Select Button - Changes to Undo in edit mode when selected */}
          <motion.button
            whileHover={canSelect ? { scale: 1.05 } : {}}
            whileTap={canSelect ? { scale: 0.95 } : {}}
            onClick={() => canSelect && onSelect(meal.id)}
            disabled={!canSelect}
            className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs font-medium transition-all min-w-[80px] ${
              isSelected
                ? isEditing
                  ? `bg-red-50 text-red-700 border border-red-200 hover:bg-red-100` // Undo button style
                  : `${selectedBg} ${selectedText} ${selectedBorder}`
                : !canSelect
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                : showEditColors
                ? `bg-${primaryColor}-50 text-${primaryColor}-700 border border-${primaryColor}-200 hover:bg-${primaryColor}-100`
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {isSelected
              ? isEditing
                ? "Undo"
                : "Selected"
              : !canSelect
              ? hasSavedSelections && !isEditing
                ? "Edit"
                : "Limit"
              : "Select"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
export default MealSelection;
