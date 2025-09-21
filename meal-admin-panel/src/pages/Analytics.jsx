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
  Crown,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { db } from "../firebase";
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
    const sizeClass = size === "sm" ? "w-12 h-12" : "w-16 h-16";
    const textSize = size === "sm" ? "text-xs" : "text-sm";

    const radius = size === "sm" ? 22 : 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`relative ${sizeClass} flex items-center justify-center`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className="text-gray-200 fill-none"
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
          />
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            className={`${colorClass} fill-none transition-all duration-700 ease-in-out`}
            strokeWidth={size === "sm" ? 3 : 4}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900">
            Meal Analytics
          </h1>
        </div>
      </div>

      {/* Mess Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className={`bg-white rounded-xl shadow-sm border p-4 md:p-6 cursor-pointer transition-all hover:shadow-md
               ${
                 isSelected && colors.primary === "green"
                   ? "border-green-500 ring-2 ring-green-200"
                   : ""
               }
               ${
                 isSelected && colors.primary === "red"
                   ? "border-red-500 ring-2 ring-red-200"
                   : ""
               }
               ${
                 isSelected && colors.primary === "purple"
                   ? "border-purple-500 ring-2 ring-purple-200"
                   : ""
               }
                ${!isSelected ? "border-gray-200" : ""}
               `}
              onClick={() => setSelectedMessType(messType)}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 capitalize">
                  {messType} Mess
                </h2>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
                >
                  {messData.total}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs md:text-sm text-gray-700">
                      Participation
                    </span>
                    <span className="text-xs md:text-sm font-bold text-gray-900">
                      {messData.participationRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${colors.progress.replace(
                        "text-",
                        "bg-"
                      )}`}
                      style={{ width: `${messData.participationRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={`rounded-lg p-2 ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-center">
                      <span className={`text-xs font-medium ${colors.text}`}>
                        Submitted
                      </span>
                    </div>
                    <p
                      className={`text-lg md:text-xl font-bold ${colors.text}`}
                    >
                      {messData.submitted}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg p-2 ${colors.light} ${colors.border}`}
                  >
                    <div className="flex items-center">
                      <span className={`text-xs font-medium ${colors.text}`}>
                        Pending
                      </span>
                    </div>
                    <p
                      className={`text-lg md:text-xl font-bold ${colors.text}`}
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

      {/* Unified Category & Subcategory Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Meal Category
            </h3>
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors"
              >
                <span className="font-medium capitalize">
                  {selectedCategory}
                </span>
                {isCategoryOpen ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsCategoryOpen(false);
                        }}
                        className={`px-3 py-2 text-left rounded-md transition-colors ${
                          selectedCategory === category
                            ? "bg-indigo-100 text-indigo-800"
                            : "hover:bg-gray-100"
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

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Subcategory
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentSubcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  onClick={() => setSelectedSubcategory(subcategory)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 flex items-center">
              <Utensils className="h-5 w-5 mr-2 text-indigo-600" />
              Available Meals
              <span className="ml-2 text-sm font-normal text-gray-600">
                ({selectedMessType} • {selectedCategory} • {selectedSubcategory}
                )
              </span>
            </h2>
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUpIcon className="h-4 w-4 mr-1" />
              Sorted by popularity
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {filteredMeals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMeals.map((meal, index) => {
                const selectionCount = getSelectionCount(meal.id);
                const selectionPercentage = getSelectionPercentage(meal.id);
                const isTopMeal = index === 0 && selectionCount > 0;

                return (
                  <div
                    key={meal.id}
                    className={`relative rounded-xl p-4 shadow-sm border transition-all hover:shadow-md ${currentColors.card} ${currentColors.border}`}
                  >
                    {/* Top meal badge */}
                    {isTopMeal && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div
                          className={`flex items-center px-2 py-1 rounded-full ${currentColors.bg} ${currentColors.text} ${currentColors.border} border shadow-md`}
                        >
                          <Crown className="h-3 w-3 mr-1" />
                          <span className="text-xs font-bold">
                            Most Popular
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border">
                        {meal.image ? (
                          <img
                            src={meal.image}
                            alt={meal.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ChefHat className="h-6 w-6 md:h-7 md:w-7 text-gray-400" />
                        )}
                      </div>
                      <CircularProgress
                        percentage={selectionPercentage}
                        colorClass={currentColors.progress}
                        size="sm"
                      />
                    </div>

                    <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                      {meal.name}
                    </h3>

                    {/* Desktop-only description */}
                    <p className="text-xs text-gray-600 mb-3 hidden md:line-clamp-2">
                      {meal.description}
                    </p>

                    <div className="space-y-1 md:space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          Selected by
                        </span>
                        <span className="text-xs font-semibold text-gray-900">
                          {selectionCount} students
                        </span>
                      </div>

                      {/* Ranking indicator for top 3 meals */}
                      {index < 3 && selectionCount > 0 && (
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${currentColors.badge}`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-xs text-gray-600 ml-2">
                            {index === 0
                              ? "Most popular"
                              : index === 1
                              ? "2nd most"
                              : "3rd most"}{" "}
                            selected
                          </span>
                        </div>
                      )}
                    </div>

                    {meal.tags && meal.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {meal.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white text-gray-800 border border-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                        {meal.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white text-gray-800 border border-gray-300">
                            +{meal.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 bg-gray-50 rounded-lg border border-gray-200">
              <ChefHat className="h-8 w-8 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                No meals available
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Try selecting a different category or subcategory
              </p>
            </div>
          )}
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
