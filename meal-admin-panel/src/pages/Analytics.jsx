import { useState, useEffect } from "react";
import { useMeal } from "../context/MealContext";
import {
  Utensils,
  Users,
  TrendingUp,
  ChefHat,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Filter,
  Crown,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function Analytics() {
  const { meals, categories, messTypes, getSubcategories } = useMeal();
  const [studentSelections, setStudentSelections] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessType, setSelectedMessType] = useState("veg");
  const [selectedCategory, setSelectedCategory] = useState("breakfast");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Color scheme for different mess types
  const messTypeColors = {
    veg: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      primary: "green",
      gradient: "from-green-400 to-emerald-500",
      progress: "text-green-600",
      light: "bg-green-100",
      card: "bg-gradient-to-br from-green-50 to-emerald-50",
      badge: "bg-green-500",
    },
    "non-veg": {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      primary: "red",
      gradient: "from-red-400 to-orange-500",
      progress: "text-red-600",
      light: "bg-red-100",
      card: "bg-gradient-to-br from-red-50 to-orange-50",
      badge: "bg-red-500",
    },
    special: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      primary: "purple",
      gradient: "from-purple-400 to-violet-500",
      progress: "text-purple-600",
      light: "bg-purple-100",
      card: "bg-gradient-to-br from-purple-50 to-violet-50",
      badge: "bg-purple-500",
    },
  };

  // Load all students and their selections from Firebase
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Set default subcategory when category changes
  useEffect(() => {
    if (categories.length > 0 && selectedCategory) {
      const subcategories = getSubcategories(
        selectedCategory,
        selectedMessType
      );
      if (subcategories.length > 0) {
        setSelectedSubcategory(subcategories[0]);
      }
    }
  }, [selectedCategory, selectedMessType, categories, getSubcategories]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setRefreshing(true);

      // Load all users with role 'student'
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      const studentsData = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.role === "student" || !userData.role) {
          studentsData.push({
            id: doc.id,
            ...userData,
            displayName:
              userData.displayName || `Student ${doc.id.substring(0, 6)}`,
            messPreference: userData.messPreference || "veg",
          });
        }
      });

      setAllStudents(studentsData);

      // Load student selections
      const selectionsData = [];
      for (const student of studentsData) {
        try {
          const selectionsRef = doc(
            db,
            "students",
            student.id,
            "preferences",
            "mealSelections"
          );
          const selectionsDoc = await getDoc(selectionsRef);

          if (selectionsDoc.exists()) {
            const selectionData = selectionsDoc.data();
            selectionsData.push({
              studentId: student.id,
              studentName: student.displayName,
              messType: student.messPreference,
              ...selectionData,
            });
          }
        } catch (error) {
          console.error(
            `Error loading selections for student ${student.id}:`,
            error
          );
        }
      }

      setStudentSelections(selectionsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate selection statistics
  const selectionStats = {
    totalStudents: allStudents.length,
    submitted: studentSelections.length,
    pending: allStudents.length - studentSelections.length,
    participationRate:
      allStudents.length > 0
        ? Math.round((studentSelections.length / allStudents.length) * 100)
        : 0,
  };

  // Calculate mess type distribution
  const messTypeDistribution = {};
  messTypes.forEach((messType) => {
    const studentsInMessType = allStudents.filter(
      (student) => student.messPreference === messType
    );

    const selectionsInMessType = studentSelections.filter(
      (selection) => selection.messType === messType
    );

    messTypeDistribution[messType] = {
      total: studentsInMessType.length,
      submitted: selectionsInMessType.length,
      pending: studentsInMessType.length - selectionsInMessType.length,
      participationRate:
        studentsInMessType.length > 0
          ? Math.round(
              (selectionsInMessType.length / studentsInMessType.length) * 100
            )
          : 0,
    };
  });

  // Get meals for selected mess type, category and subcategory - sorted by selection count
  const getFilteredMeals = () => {
    const filtered = meals.filter(
      (meal) =>
        meal.messType === selectedMessType &&
        meal.category === selectedCategory &&
        meal.subcategory === selectedSubcategory
    );

    // Sort by selection count (highest first)
    return filtered.sort((a, b) => {
      const countA = getSelectionCount(a.id);
      const countB = getSelectionCount(b.id);
      return countB - countA;
    });
  };

  // Get selection count for a meal
  const getSelectionCount = (mealId) => {
    let count = 0;
    studentSelections.forEach((selection) => {
      if (selection.selections && selection.selections[mealId]) {
        count++;
      }
    });
    return count;
  };

  // Get selection percentage for a meal
  const getSelectionPercentage = (mealId) => {
    const count = getSelectionCount(mealId);
    const totalStudentsInMessType =
      messTypeDistribution[selectedMessType]?.total || 0;

    if (totalStudentsInMessType === 0) return 0;

    return Math.round((count / totalStudentsInMessType) * 100);
  };

  // Refresh data
  const handleRefresh = () => {
    loadAnalyticsData();
  };

  // Circular progress component with fixed 100% display
  const CircularProgress = ({ percentage, colorClass, size = "md" }) => {
    // Responsive size classes - mobile first, then desktop
    const sizeClass =
      size === "sm" ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";

    const textSize =
      size === "sm" ? "text-[10px] md:text-xs" : "text-xs md:text-sm";

    // Responsive radius calculation
    const getRadius = (isMobile = false) => {
      if (size === "sm") {
        return isMobile ? 17 : 22; // sm: mobile 15, desktop 18
      } else {
        return isMobile ? 22 : 27; // md: mobile 22, desktop 27
      }
    };

    const mobileRadius = getRadius(true);
    const desktopRadius = getRadius(false);

    const mobileCircumference = 2 * Math.PI * mobileRadius;
    const desktopCircumference = 2 * Math.PI * desktopRadius;

    const mobileStrokeDashoffset =
      mobileCircumference - (percentage / 100) * mobileCircumference;
    const desktopStrokeDashoffset =
      desktopCircumference - (percentage / 100) * desktopCircumference;

    return (
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        {/* Mobile SVG */}
        <svg className="w-full h-full transform -rotate-90 block md:hidden">
          <circle
            cx="50%"
            cy="50%"
            r={mobileRadius}
            className="text-gray-200 fill-none"
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
          />
          <circle
            cx="50%"
            cy="50%"
            r={mobileRadius}
            className={`${colorClass} fill-none transition-all duration-700 ease-in-out`}
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
            strokeDasharray={mobileCircumference}
            strokeDashoffset={mobileStrokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Desktop SVG */}
        <svg className="w-full h-full transform -rotate-90 hidden md:block">
          <circle
            cx="50%"
            cy="50%"
            r={desktopRadius}
            className="text-gray-200 fill-none"
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
          />
          <circle
            cx="50%"
            cy="50%"
            r={desktopRadius}
            className={`${colorClass} fill-none transition-all duration-700 ease-in-out`}
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
            strokeDasharray={desktopCircumference}
            strokeDashoffset={desktopStrokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${textSize} ${colorClass}`}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredMeals = getFilteredMeals();
  const currentSubcategories = getSubcategories(
    selectedCategory,
    selectedMessType
  );
  const currentColors = messTypeColors[selectedMessType];

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
              Meal Analytics
            </h1>
            <p className="text-xs sm:text-sm text-green-700 mt-1">
              Analyze eating patterns and insights
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mess Type Selection */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-3 md:gap-4">
        {messTypes.map((messType) => {
          const messData = messTypeDistribution[messType] || {
            total: 0,
            submitted: 0,
            pending: 0,
            participationRate: 0,
          };
          const colors = messTypeColors[messType];
          const isSelected = selectedMessType === messType;

          return (
            <div
              key={messType}
              className={`bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-6 cursor-pointer transition-all hover:shadow-md
         ${
           isSelected && colors.primary === "green"
             ? "border-green-500 ring-1 md:ring-2 ring-green-200"
             : ""
         }
         ${
           isSelected && colors.primary === "red"
             ? "border-red-500 ring-1 md:ring-2 ring-red-200"
             : ""
         }
         ${
           isSelected && colors.primary === "purple"
             ? "border-purple-500 ring-1 md:ring-2 ring-purple-200"
             : ""
         }
          ${!isSelected ? "border-gray-200" : ""}
         `}
              onClick={() => setSelectedMessType(messType)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <h2 className="text-xs md:text-lg font-semibold text-gray-900 capitalize truncate pr-1">
                  {messType} Mess
                </h2>
                <div
                  className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border min-w-[20px] text-center`}
                >
                  {messData.total}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 md:space-y-3">
                {/* Participation Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] md:text-sm text-gray-700 truncate pr-1">
                      Participation
                    </span>
                    <span className="text-[10px] md:text-sm font-bold text-gray-900">
                      {messData.participationRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 md:h-1.5">
                    <div
                      className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${colors.progress.replace(
                        "text-",
                        "bg-"
                      )}`}
                      style={{ width: `${messData.participationRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-1 md:gap-2">
                  <div
                    className={`rounded-md md:rounded-lg p-1 md:p-2 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`text-[10px] md:text-xs font-medium ${colors.text}`}
                      >
                        <span className="md:hidden">Sub..</span>
                        <span className="hidden md:inline">Submitted</span>
                      </span>
                    </div>
                    <p
                      className={`text-xs md:text-xl font-bold ${colors.text} leading-tight`}
                    >
                      {messData.submitted}
                    </p>
                  </div>

                  <div
                    className={`rounded-md md:rounded-lg p-1 md:p-2 ${colors.light} ${colors.border}`}
                  >
                    <div className="flex items-center">
                      <span
                        className={`text-[10px] md:text-xs font-medium ${colors.text}`}
                      >
                        <span className="md:hidden">Pend..</span>
                        <span className="hidden md:inline">Pending</span>
                      </span>
                    </div>
                    <p
                      className={`text-xs md:text-xl font-bold ${colors.text} leading-tight`}
                    >
                      {messData.pending}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-4 md:space-y-6">
        <div
          className={`
    bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 
    transition-all duration-300
    ${
      isFilterVisible
        ? isCategoryOpen
          ? "max-h-96 opacity-100 p-3 md:p-6 mb-4 overflow-visible" // Use overflow-visible when dropdown is open
          : "max-h-96 opacity-100 p-3 md:p-6 mb-4 overflow-hidden" // Use overflow-hidden when dropdown is closed
        : "max-h-0 opacity-0 p-0 md:max-h-0 md:opacity-0 md:mb-0 overflow-hidden"
    }
         `}
        >
          <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
            {/* Category Selector */}
            <div className="md:flex-1">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2">
                Meal Category
              </h3>
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors text-sm md:text-base"
                >
                  <span className="font-medium capitalize truncate">
                    {selectedCategory}
                  </span>
                  {isCategoryOpen ? (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 transform transition-transform rotate-180" />
                  ) : (
                    <ChevronDown className="h-4 w-4 md:h-5 md:w-5 transform transition-transform" />
                  )}
                </button>

                {/* Dropdown with higher z-index */}
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                    <div className="p-1 md:p-2 grid grid-cols-1 gap-0.5 md:gap-1">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsCategoryOpen(false);
                          }}
                          className={`px-2 py-1.5 md:px-3 md:py-2 text-left rounded-md transition-colors text-xs md:text-sm ${
                            selectedCategory === category
                              ? "bg-indigo-100 text-green-800 font-medium"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategory Selector */}
            <div className="md:flex-1">
              <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2">
                Subcategory
              </h3>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {currentSubcategories.map((subcategory) => (
                  <button
                    key={subcategory}
                    onClick={() => setSelectedSubcategory(subcategory)}
                    className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      selectedSubcategory === subcategory
                        ? `bg-gradient-to-r ${currentColors.gradient} text-white shadow-md`
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {subcategory}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Available Meals - Sorted by popularity */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with dynamic colors */}
          <div
            className={`border-b ${currentColors.border} px-3 md:px-6 py-3 md:py-4 ${currentColors.headerBg}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base md:text-xl font-semibold text-gray-900 flex items-center">
                  <Utensils
                    className="h-4 w-4 md:h-5 md:w-5 mr-2"
                    style={{ color: currentColors.primary }}
                  />
                  Available Meals
                </h2>
              </div>

              <div
                className="flex items-center text-xs md:text-sm"
                style={{ color: currentColors.primary }}
              >
                <TrendingUpIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                <span className="hidden sm:inline">Sorted by popularity</span>
              </div>
            </div>

            {/* Mobile subtitle and filter toggle */}
            <div className="flex items-center justify-between mt-2 md:hidden">
              <span className="text-xs" style={{ color: currentColors.text }}>
                {selectedMessType} • {selectedCategory} • {selectedSubcategory}
              </span>

              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="text-xs flex items-center gap-1 font-medium hover:opacity-80 transition-opacity"
                style={{ color: currentColors.primary }}
              >
                <Filter className="h-3 w-3" />
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Desktop subtitle and filter toggle */}
            <div className="hidden md:flex items-center justify-between mt-2">
              <span className="text-sm" style={{ color: currentColors.text }}>
                {selectedMessType} • {selectedCategory} • {selectedSubcategory}
              </span>

              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="text-sm flex items-center gap-1 font-medium hover:opacity-80 transition-opacity"
                style={{ color: currentColors.primary }}
              >
                <Filter className="h-4 w-4" />
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>
          {/* Meals Grid */}
          <div className="p-3 md:p-6">
            {filteredMeals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredMeals.map((meal, index) => {
                  const selectionCount = getSelectionCount(meal.id);
                  const selectionPercentage = getSelectionPercentage(meal.id);
                  const isTopMeal = index === 0 && selectionCount > 0;

                  return (
                    <div
                      key={meal.id}
                      className={`relative rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border transition-all hover:shadow-md ${currentColors.card} ${currentColors.border}`}
                    >
                      {/* Top meal badge */}
                      {isTopMeal && (
                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-10">
                          <div
                            className={`flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${currentColors.bg} ${currentColors.text} border shadow-md text-[10px] md:text-xs`}
                          >
                            <Crown className="h-2 w-2 md:h-3 md:w-3 mr-0.5" />
                            <span className="font-bold">Top</span>
                          </div>
                        </div>
                      )}

                      {/* Meal Image and Progress */}
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="h-12 w-12 md:h-16 md:w-16 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border">
                          {meal.image ? (
                            <img
                              src={meal.image}
                              alt={meal.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ChefHat className="h-6 w-6 md:h-8 md:w-8 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-shrink-0">
                          <CircularProgress
                            percentage={selectionPercentage}
                            colorClass={currentColors.progress}
                            size={window.innerWidth < 768 ? "sm" : "md"}
                          />
                        </div>
                      </div>

                      {/* Meal Name */}
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                        {meal.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 mb-2 md:mb-3 hidden md:line-clamp-2">
                        {meal.description}
                      </p>

                      {/* Selection Stats */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">
                            Selected by
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {selectionCount}
                          </span>
                        </div>

                        {/* Ranking indicator */}
                        {index < 3 && selectionCount > 0 && (
                          <div className="flex items-center">
                            <div
                              className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white ${currentColors.badge}`}
                            >
                              {index + 1}
                            </div>
                            <span className="text-[10px] md:text-xs text-gray-600 ml-1">
                              {index === 0
                                ? "Most popular"
                                : index === 1
                                ? "2nd most"
                                : "3rd most"}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {meal.tags && meal.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {meal.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white text-gray-800 border border-gray-300"
                            >
                              {tag.length > 8
                                ? `${tag.substring(0, 8)}..`
                                : tag}
                            </span>
                          ))}
                          {meal.tags.length > 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white text-gray-800 border border-gray-300">
                              +{meal.tags.length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg border border-gray-200">
                <ChefHat className="h-6 w-6 md:h-12 md:w-12 text-gray-400 mx-auto mb-2 md:mb-4" />
                <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                  No meals available
                </h3>
                <p className="text-gray-600 text-xs md:text-base">
                  Try selecting a different category or subcategory
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --color-green-500: #10b981;
          --color-red-500: #ef4444;
          --color-purple-500: #8b5cf6;
        }
      `}</style>
    </div>
  );
}
