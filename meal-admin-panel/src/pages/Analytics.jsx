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
  Download,
  FileSpreadsheet,
  LayoutGrid,
  Table,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

// Define maximum items for student selections
const MAX_ITEMS = {
  breakfast: {
    veg: { Tiffin: 14, Chutney: 7 },
    "non-veg": { Tiffin: 14, Chutney: 7, Egg: 5 },
    special: { Tiffin: 14, Chutney: 7, Egg: 5, Juices: 7 },
  },
  lunch: {
    veg: { Rice: 7, Curry: 14, Accompaniments: 7, Dessert: 3 },
    "non-veg": {
      Rice: 7,
      Curry: 14,
      Accompaniments: 7,
      Dessert: 3,
      Chicken: 3,
    },
    special: {
      Rice: 7,
      Curry: 14,
      Accompaniments: 7,
      Dessert: 3,
      Chicken: 3,
      Fish: 2,
    },
  },
  snacks: {
    veg: { Snacks: 7 },
    "non-veg": { Snacks: 7 },
    special: { Snacks: 7 },
  },
  dinner: {
    veg: { Staples: 7, Curries: 14, "Side Dishes": 7, Accompaniments: 7 },
    "non-veg": { Staples: 7, Curries: 14, "Side Dishes": 7, Fish: 2 },
    special: { Staples: 7, Curries: 14, "Side Dishes": 7, "Special Items": 3 },
  },
};

// Chart Components
const BarChart = ({ data, colors, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div className="w-32 text-sm text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 ml-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{item.value} selections</span>
                <span>{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: colors.primary
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartComponent = ({ data, colors, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-48 h-48 mb-4 md:mb-0 md:mr-6">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={item.name}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color || colors.primary}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-700">{total}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: item.color || colors.primary }}
              ></div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="font-medium text-gray-900">
                    {Math.round((item.value / total) * 100)}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">{item.value} selections</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LineChartComponent = ({ data, colors, title }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));

  // Generate SVG path for the line
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-64">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="0.5"
            />
          ))}

          {/* Data line */}
          <polyline
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
            points={points}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={colors.primary}
                stroke="#fff"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-center">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
  const [viewMode, setViewMode] = useState(() => {
    const savedViewMode = localStorage.getItem("analyticsViewMode");
    return savedViewMode || "grid";
  });
  const [exportLoading, setExportLoading] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Color scheme for different mess types
  const messTypeColors = {
    veg: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      primary: "#10B981",
      gradient: "from-green-400 to-emerald-500",
      progress: "text-green-600",
      light: "bg-green-100",
      card: "bg-gradient-to-br from-green-50 to-emerald-50",
      badge: "bg-green-500",
      headerBg: "bg-green-50",
    },
    "non-veg": {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      primary: "#EF4444",
      gradient: "from-red-400 to-orange-500",
      progress: "text-red-600",
      light: "bg-red-100",
      card: "bg-gradient-to-br from-red-50 to-orange-50",
      badge: "bg-red-500",
      headerBg: "bg-red-50",
    },
    special: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      primary: "#8B5CF6",
      gradient: "from-purple-400 to-violet-500",
      progress: "text-purple-600",
      light: "bg-purple-100",
      card: "bg-gradient-to-br from-purple-50 to-violet-50",
      badge: "bg-purple-500",
      headerBg: "bg-purple-50",
    },
  };

  // Track window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("analyticsViewMode", viewMode);
  }, [viewMode]);

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

  // Get selection count for a meal
  const getSelectionCount = (mealId, messType = "all") => {
    let count = 0;
    studentSelections.forEach((selection) => {
      if (selection.selections && selection.selections[mealId]) {
        if (messType === "all" || selection.messType === messType) {
          count++;
        }
      }
    });
    return count;
  };

  // Get selection percentage for a meal
  const getSelectionPercentage = (mealId, messType = null) => {
    const count = getSelectionCount(mealId);
    const targetMessType = messType || selectedMessType;
    const totalStudentsInMessType =
      messTypeDistribution[targetMessType]?.total || 0;

    if (totalStudentsInMessType === 0) return 0;

    return Math.round((count / totalStudentsInMessType) * 100);
  };

  // Get filtered meals based on current selections
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

  // Get all meals for list view (without subcategory filter)
  const getAllMealsForListView = () => {
    let filtered = meals.filter((meal) => meal.messType === selectedMessType);

    if (selectedCategory !== "all") {
      filtered = filtered.filter((meal) => meal.category === selectedCategory);
    }

    // Sort by selection count (highest first)
    return filtered.sort((a, b) => {
      const countA = getSelectionCount(a.id);
      const countB = getSelectionCount(b.id);
      return countB - countA;
    });
  };

  // Get chart data for current selection
  const getChartData = () => {
    const mealsToShow = viewMode === "grid" ? getFilteredMeals() : getAllMealsForListView();

    return mealsToShow
      .slice(0, 10) // Limit to top 10 for better visualization
      .map(meal => ({
        name: meal.name.length > 20 ? meal.name.substring(0, 20) + '...' : meal.name,
        value: getSelectionCount(meal.id),
        percentage: getSelectionPercentage(meal.id),
        category: meal.category,
        subcategory: meal.subcategory
      }))
      .filter(item => item.value > 0) // Only show items with selections
      .sort((a, b) => b.value - a.value);
  };

  // Get category distribution data
  const getCategoryDistribution = () => {
    const distribution = {};

    meals.forEach(meal => {
      if (meal.messType === selectedMessType) {
        if (!distribution[meal.category]) {
          distribution[meal.category] = 0;
        }
        distribution[meal.category] += getSelectionCount(meal.id);
      }
    });

    return Object.entries(distribution)
      .map(([category, value]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        value,
        color: getCategoryColor(category)
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Get subcategory distribution data
  const getSubcategoryDistribution = () => {
    const distribution = {};

    meals.forEach(meal => {
      if (meal.messType === selectedMessType &&
        (selectedCategory === "all" || meal.category === selectedCategory)) {
        const key = `${meal.subcategory}`;
        if (!distribution[key]) {
          distribution[key] = 0;
        }
        distribution[key] += getSelectionCount(meal.id);
      }
    });

    return Object.entries(distribution)
      .map(([subcategory, value]) => ({
        name: subcategory.length > 15 ? subcategory.substring(0, 15) + '...' : subcategory,
        value,
        color: getSubcategoryColor(subcategory)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Limit to top 8
  };

  // Helper functions for chart colors
  const getCategoryColor = (category) => {
    const colorMap = {
      breakfast: "#F59E0B",
      lunch: "#EF4444",
      snacks: "#8B5CF6",
      dinner: "#10B981"
    };
    return colorMap[category] || messTypeColors[selectedMessType].primary;
  };

  const getSubcategoryColor = (subcategory) => {
    // Generate consistent colors based on subcategory name
    const colors = [
      "#EF4444", "#F59E0B", "#10B981", "#3B82F6",
      "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
    ];
    const index = subcategory.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get top meals within limits for a specific mess type
  const getTopMealsWithinLimits = (messType) => {
    const topMeals = [];

    categories.forEach((category) => {
      if (MAX_ITEMS[category] && MAX_ITEMS[category][messType]) {
        const subcategoryLimits = MAX_ITEMS[category][messType];

        Object.keys(subcategoryLimits).forEach((subcategory) => {
          const limit = subcategoryLimits[subcategory];

          // Get meals for this category, mess type, and subcategory
          const categoryMeals = meals.filter(
            (meal) =>
              meal.category === category &&
              meal.messType === messType &&
              meal.subcategory === subcategory
          );

          // Sort by selection count and take top items within limit
          const topCategoryMeals = categoryMeals
            .map((meal) => ({
              ...meal,
              selectionCount: getSelectionCount(meal.id),
              selectionPercentage: getSelectionPercentage(meal.id, messType),
            }))
            .sort((a, b) => b.selectionCount - a.selectionCount)
            .slice(0, limit);

          topMeals.push(...topCategoryMeals);
        });
      }
    });

    return topMeals;
  };

  // Create Excel data for a specific mess type
  const createMessTypeExcelData = (messType) => {
    const data = [];
    const topMeals = getTopMealsWithinLimits(messType);

    // Header row
    data.push([
      "Category",
      "Subcategory",
      "Meal Name",
      "Description",
      "Total Selections",
      "Selection Percentage",
      "Limit",
    ]);

    // Group by category and subcategory for better organization
    const groupedMeals = {};

    topMeals.forEach((meal) => {
      const key = `${meal.category}-${meal.subcategory}`;
      if (!groupedMeals[key]) {
        groupedMeals[key] = [];
      }
      groupedMeals[key].push(meal);
    });

    // Add data rows
    Object.keys(groupedMeals).forEach((key) => {
      const [category, subcategory] = key.split("-");
      const mealsInGroup = groupedMeals[key];

      mealsInGroup.forEach((meal, index) => {
        data.push([
          category.charAt(0).toUpperCase() + category.slice(1),
          subcategory.charAt(0).toUpperCase() + subcategory.slice(1),
          meal.name,
          meal.description || "-",
          meal.selectionCount,
          `${meal.selectionPercentage}%`,
          meal.limit,
        ]);
      });

      // Add empty row between groups
      data.push([]);
    });

    return data;
  };

  // Export specific mess type to Excel
  const exportMessTypeToExcel = async (messType) => {
    setExportLoading((prev) => ({ ...prev, [messType]: true }));

    try {
      const data = createMessTypeExcelData(messType);
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${messType} Meals`);

      // Set column widths
      const colWidths = [
        { wch: 15 }, // Category
        { wch: 15 }, // Subcategory
        { wch: 25 }, // Meal Name
        { wch: 40 }, // Description
        { wch: 15 }, // Total Selections
        { wch: 20 }, // Selection Percentage
        { wch: 10 }, // Limit
      ];
      ws["!cols"] = colWidths;

      // Style header row
      if (ws["!ref"]) {
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: {
                fgColor: {
                  rgb:
                    messType === "veg"
                      ? "16A34A"
                      : messType === "non-veg"
                        ? "DC2626"
                        : "7C3AED",
                },
              },
            };
          }
        }
      }

      const filename = `${messType}-mess-meals-${new Date().toISOString().split("T")[0]
        }.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error(`Error exporting ${messType} data:`, error);
      alert(`Error exporting ${messType} data. Please try again.`);
    } finally {
      setExportLoading((prev) => ({ ...prev, [messType]: false }));
    }
  };

  // Export combined Excel with all mess data
  const exportCombinedExcel = async () => {
    setExportLoading((prev) => ({ ...prev, combined: true }));

    try {
      const wb = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ["MEAL ANALYTICS SUMMARY REPORT", "", "", "", ""],
        ["Generated on:", new Date().toLocaleDateString(), "", "", ""],
        ["", "", "", "", ""],
        ["OVERALL STATISTICS", "", "", "", ""],
        ["Total Students Registered", selectionStats.totalStudents, "", "", ""],
        ["Total Students Submitted", selectionStats.submitted, "", "", ""],
        ["Total Pending", selectionStats.pending, "", "", ""],
        [
          "Overall Participation Rate",
          `${selectionStats.participationRate}%`,
          "",
          "",
          "",
        ],
        ["", "", "", "", ""],
        ["MESS TYPE BREAKDOWN", "", "", "", ""],
        [
          "Mess Type",
          "Total Students",
          "Submitted",
          "Pending",
          "Participation Rate",
        ],
      ];

      messTypes.forEach((messType) => {
        const stats = messTypeDistribution[messType];
        summaryData.push([
          messType.charAt(0).toUpperCase() + messType.slice(1),
          stats.total,
          stats.submitted,
          stats.pending,
          `${stats.participationRate}%`,
        ]);
      });

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      // Individual Mess Type Sheets
      messTypes.forEach((messType) => {
        const data = createMessTypeExcelData(messType);
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, `${messType} Meals`);
      });

      const filename = `meal-analytics-complete-${new Date().toISOString().split("T")[0]
        }.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Error exporting combined data:", error);
      alert("Error exporting combined data. Please try again.");
    } finally {
      setExportLoading((prev) => ({ ...prev, combined: false }));
    }
  };

  // Refresh data
  const handleRefresh = () => {
    loadAnalyticsData();
  };

  // Circular progress component with fixed 100% display
  const CircularProgress = ({ percentage, colorClass, size = "md" }) => {
    const sizeClass =
      size === "sm" ? "w-10 h-10 md:w-12 md:h-12" : "w-14 h-14 md:w-16 md:h-16";

    const textSize =
      size === "sm" ? "text-[10px] md:text-xs" : "text-xs md:text-sm";

    const getRadius = (isMobile = false) => {
      if (size === "sm") {
        return isMobile ? 17 : 22;
      } else {
        return isMobile ? 22 : 27;
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
  const listViewMeals = getAllMealsForListView();
  const currentSubcategories = getSubcategories(
    selectedCategory,
    selectedMessType
  );
  const currentColors = messTypeColors[selectedMessType];
  const isMobile = windowWidth < 768;

  // Chart data
  const chartData = getChartData();
  const categoryDistribution = getCategoryDistribution();
  const subcategoryDistribution = getSubcategoryDistribution();

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full sm:w-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full sm:w-auto">
              <div className="flex justify-between items-start sm:block w-full">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
                    Meal Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Analyze eating patterns and insights
                  </p>
                </div>

                {/* Mobile Download Button - Visible only on mobile */}
                <button
                  onClick={exportCombinedExcel}
                  disabled={exportLoading["combined"]}
                  className="sm:hidden flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportLoading["combined"] ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  <span>All</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Desktop Download Button - Hidden on mobile */}
          <button
            onClick={exportCombinedExcel}
            disabled={exportLoading["combined"]}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exportLoading["combined"] ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Download className="h-4 w-4" />
            )}
            <FileSpreadsheet className="h-4 w-4" />
            All Data
          </button>
        </div>

        {/* Mess Type Cards */}
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

            // Determine border and glow classes based on selection and mess type
            const getBorderClasses = () => {
              if (!isSelected) return "border-gray-200";

              switch (messType) {
                case "veg":
                  return "border-green-500 ring-2 ring-green-200 shadow-md";
                case "non-veg":
                  return "border-red-500 ring-2 ring-red-200 shadow-md";
                case "special":
                  return "border-purple-500 ring-2 ring-purple-200 shadow-md";
                default:
                  return "border-gray-200";
              }
            };

            return (
              <div
                key={messType}
                className={`bg-white rounded-lg md:rounded-xl shadow-sm border p-2 md:p-6 cursor-pointer transition-all hover:shadow-md ${getBorderClasses()}`}
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

                  {/* Download Button for this Mess Type */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      exportMessTypeToExcel(messType);
                    }}
                    disabled={exportLoading[messType]}
                    className={`w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${messType === "veg"
                        ? "bg-green-600 hover:bg-green-700"
                        : messType === "non-veg"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-purple-600 hover:bg-purple-700"
                      } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {exportLoading[messType] ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    <span>Download</span>
                  </button>
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
    ${isFilterVisible
                ? isCategoryOpen
                  ? "max-h-96 opacity-100 p-3 md:p-6 mb-4 overflow-visible"
                  : "max-h-96 opacity-100 p-3 md:p-6 mb-4 overflow-hidden"
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
                        <button
                          onClick={() => {
                            setSelectedCategory("all");
                            setIsCategoryOpen(false);
                          }}
                          className={`px-2 py-1.5 md:px-3 md:py-2 text-left rounded-md transition-colors text-xs md:text-sm ${selectedCategory === "all"
                              ? "bg-indigo-100 text-green-800 font-medium"
                              : "hover:bg-gray-100 text-gray-700"
                            }`}
                        >
                          All Categories
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsCategoryOpen(false);
                            }}
                            className={`px-2 py-1.5 md:px-3 md:py-2 text-left rounded-md transition-colors text-xs md:text-sm ${selectedCategory === category
                                ? "bg-indigo-100 text-green-800 font-medium"
                                : "hover:bg-gray-100 text-gray-700"
                              }`}
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subcategory Selector - Only show in grid view */}
              {viewMode === "grid" && (
                <div className="md:flex-1">
                  <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-1 md:mb-2">
                    Subcategory
                  </h3>
                  <div className="flex flex-wrap gap-1 md:gap-2">
                    {currentSubcategories.map((subcategory) => (
                      <button
                        key={subcategory}
                        onClick={() => setSelectedSubcategory(subcategory)}
                        className={`px-2 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${selectedSubcategory === subcategory
                            ? `bg-gradient-to-r ${currentColors.gradient} text-white shadow-md`
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* View Mode Toggle and Header */}
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                    {viewMode === "grid"
                      ? "Available Meals"
                      : viewMode === "list"
                        ? "All Meals Overview"
                        : viewMode === "bar"
                          ? "Meal Popularity Analysis"
                          : viewMode === "pie"
                            ? "Category Distribution"
                            : "Trend Analysis"}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all ${viewMode === "grid"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all ${viewMode === "list"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                      title="List View"
                    >
                      <Table className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("bar")}
                      className={`p-2 rounded-md transition-all ${viewMode === "bar"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                      title="Bar Chart View"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("pie")}
                      className={`p-2 rounded-md transition-all ${viewMode === "pie"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                      title="Pie Chart View"
                    >
                      <PieChart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("line")}
                      className={`p-2 rounded-md transition-all ${viewMode === "line"
                          ? "bg-white shadow-sm text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                        }`}
                      title="Line Chart View"
                    >
                      <LineChart className="h-4 w-4" />
                    </button>
                  </div>

                  <div
                    className="flex items-center text-xs md:text-sm"
                    style={{ color: currentColors.primary }}
                  >
                    <TrendingUpIcon className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                    <span className="hidden sm:inline">
                      Sorted by popularity
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile subtitle and filter toggle */}
              <div className="flex items-center justify-between mt-2 md:hidden">
                <span className="text-xs" style={{ color: currentColors.text }}>
                  {selectedMessType} • {selectedCategory} •{" "}
                  {viewMode === "grid"
                    ? selectedSubcategory
                    : "All Subcategories"}
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
                  {selectedMessType} • {selectedCategory} •{" "}
                  {viewMode === "grid"
                    ? selectedSubcategory
                    : "All Subcategories"}
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

            {/* Content based on view mode */}
            <div className="p-3 md:p-6">
              {viewMode === "grid" ? (
                // Grid View
                filteredMeals.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {filteredMeals.map((meal, index) => {
                      const selectionCount = getSelectionCount(meal.id);
                      const selectionPercentage = getSelectionPercentage(
                        meal.id
                      );
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
                                size={isMobile ? "sm" : "md"}
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
                  /* Empty State for Grid View */
                  <div className="text-center py-6 md:py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <ChefHat className="h-6 w-6 md:h-12 md:w-12 text-gray-400 mx-auto mb-2 md:mb-4" />
                    <h3 className="text-sm md:text-lg font-medium text-gray-900 mb-1 md:mb-2">
                      No meals available
                    </h3>
                    <p className="text-gray-600 text-xs md:text-base">
                      Try selecting a different category or subcategory
                    </p>
                  </div>
                )
              ) : viewMode === "list" ? (
                // List View
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Meal Details
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subcategory
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selections
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selection %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {listViewMeals.map((meal, index) => {
                        const selectionCount = getSelectionCount(meal.id);
                        const selectionPercentage = getSelectionPercentage(
                          meal.id
                        );

                        return (
                          <tr
                            key={meal.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {meal.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {meal.description || "No description"}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {meal.category}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {meal.subcategory}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {selectionCount}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-700">
                                {selectionPercentage}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {listViewMeals.length === 0 && (
                    <div className="text-center py-12">
                      <ChefHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No meals found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your filters to see more results.
                      </p>
                    </div>
                  )}
                </div>
              ) : viewMode === "bar" ? (
                // Bar Chart View
                <div className="space-y-6">
                  <BarChart
                    data={chartData}
                    colors={currentColors}
                    title="Top Meal Selections"
                  />

                  {subcategoryDistribution.length > 0 && (
                    <BarChart
                      data={subcategoryDistribution}
                      colors={currentColors}
                      title="Subcategory Distribution"
                    />
                  )}
                </div>
              ) : viewMode === "pie" ? (
                // Pie Chart View
                <div className="space-y-6">
                  {categoryDistribution.length > 0 && (
                    <PieChartComponent
                      data={categoryDistribution}
                      colors={currentColors}
                      title="Category Distribution"
                    />
                  )}

                  {subcategoryDistribution.length > 0 && (
                    <PieChartComponent
                      data={subcategoryDistribution}
                      colors={currentColors}
                      title="Subcategory Distribution"
                    />
                  )}
                </div>
              ) : viewMode === "line" ? (
                // Line Chart View
                <div className="space-y-6">
                  <LineChartComponent
                    data={chartData}
                    colors={currentColors}
                    title="Meal Popularity Trend"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}