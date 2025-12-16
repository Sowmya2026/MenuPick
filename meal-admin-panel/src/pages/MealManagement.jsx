import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Utensils,
  Copy,
  X,
  Menu,
  Grid,
  List,
  Upload,
} from "lucide-react";
import { useMeal } from "../context/MealContext";
import MealForm from "../components/MealForm";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
    button: "bg-green-600 hover:bg-green-700",
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
    button: "bg-red-600 hover:bg-red-700",
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
    button: "bg-purple-600 hover:bg-purple-700",
  },
};

const MealManagement = () => {
  const {
    meals,
    categories,
    messTypes,
    loading,
    deleteMeal,
    deleteMealsByMessType,
    deleteAllMeals,
    getSubcategories,
    addMeal,
  } = useMeal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMessType, setSelectedMessType] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [copyingMeal, setCopyingMeal] = useState(null);
  const [targetMessTypes, setTargetMessTypes] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  // Initialize viewMode from localStorage immediately
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("mealViewMode");
    return saved || "grid";
  });
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportMessType, setBulkImportMessType] = useState("veg");
  const [bulkImportData, setBulkImportData] = useState("");
  const [previewMeals, setPreviewMeals] = useState([]);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewModeChange = (mode) => {
    console.log("Changing view mode to:", mode);
    setViewMode(mode);
    localStorage.setItem("mealViewMode", mode);
    console.log("Saved to localStorage:", localStorage.getItem("mealViewMode"));
  };
  // Calculate meal counts by type
  const mealCounts = useMemo(() => {
    return {
      veg: meals.filter((meal) => meal.messType === "veg").length,
      nonVeg: meals.filter((meal) => meal.messType === "non-veg").length,
      special: meals.filter((meal) => meal.messType === "special").length,
      total: meals.length,
    };
  }, [meals]);

  // Get available subcategories based on selected category and mess type
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all" || selectedMessType === "all") {
      return ["all"];
    }
    return ["all", ...getSubcategories(selectedCategory, selectedMessType)];
  }, [selectedCategory, selectedMessType, getSubcategories]);

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch =
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meal.tags &&
        meal.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    const matchesCategory =
      selectedCategory === "all" || meal.category === selectedCategory;
    const matchesMessType =
      selectedMessType === "all" || meal.messType === selectedMessType;
    const matchesSubcategory =
      selectedSubcategory === "all" || meal.subcategory === selectedSubcategory;

    return (
      matchesSearch && matchesCategory && matchesMessType && matchesSubcategory
    );
  });

  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, path) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await deleteMeal(id, path);
        toast.success("Meal deleted successfully!");
      } catch (error) {
        console.error("Error deleting meal:", error);
        toast.error("Error deleting meal");
      }
    }
  };

  const handleCopyToOtherMessTypes = (meal) => {
    setCopyingMeal(meal);
    setTargetMessTypes([]);
  };

  const handleCopyConfirm = async () => {
    if (!copyingMeal || targetMessTypes.length === 0) return;

    try {
      const promises = targetMessTypes.map(async (targetMessType) => {
        const mealData = {
          name: copyingMeal.name,
          description: copyingMeal.description,
          image: copyingMeal.image,
          category: copyingMeal.category,
          subcategory: copyingMeal.subcategory,
          messType: targetMessType,
          nutrition: copyingMeal.nutrition || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          tags: copyingMeal.tags || [],
        };

        await addMeal(mealData);
      });

      await Promise.all(promises);
      toast.success(
        `Meal copied to ${targetMessTypes.length} mess type(s) successfully!`
      );
      setCopyingMeal(null);
      setTargetMessTypes([]);
    } catch (error) {
      console.error("Error copying meal:", error);
      toast.error("Error copying meal: " + error.message);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMeal(null);
  };

  const handleFilterByType = (type) => {
    setSelectedMessType(type);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedMessType("all");
    setSelectedSubcategory("all");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviewImport = () => {
    if (!bulkImportData.trim()) {
      toast.error("Please enter meal data");
      return;
    }

    try {
      const lines = bulkImportData.trim().split('\n');
      const mealsToImport = [];

      for (const line of lines) {
        if (!line.trim()) continue;

        // Try parsing as JSON first
        try {
          const mealData = JSON.parse(line);
          mealsToImport.push({
            ...mealData,
            messType: bulkImportMessType,
            image: mealData.image || "", // Use empty string if no image
          });
        } catch {
          // Parse as CSV: name,description,category,subcategory,image
          const parts = line.split(',').map(p => p.trim());
          if (parts.length >= 3) {
            const category = parts[2] || "breakfast";
            // Use valid default subcategory based on category
            const defaultSubcategory =
              category === "breakfast" ? "Tiffin" :
                category === "lunch" ? "Rice" :
                  category === "snacks" ? "Snacks" :
                    category === "dinner" ? "Staples" : "Tiffin";

            mealsToImport.push({
              name: parts[0],
              description: parts[1] || "",
              category: category,
              subcategory: parts[3] || defaultSubcategory,
              image: parts[4] || "", // Use empty string if no image
              messType: bulkImportMessType,
              nutrition: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
              },
              tags: [],
            });
          }
        }
      }

      if (mealsToImport.length === 0) {
        toast.error("No valid meals found in the data");
        return;
      }

      setPreviewMeals(mealsToImport);
      toast.success(`Parsed ${mealsToImport.length} meals. Review and confirm to import.`);
    } catch (error) {
      console.error("Error parsing data:", error);
      toast.error("Error parsing data: " + error.message);
    }
  };

  const handleConfirmImport = async () => {
    if (previewMeals.length === 0) {
      toast.error("No meals to import");
      return;
    }

    try {
      let successCount = 0;
      for (const mealData of previewMeals) {
        try {
          await addMeal(mealData);
          successCount++;
        } catch (error) {
          console.error(`Error importing meal ${mealData.name}:`, error);
        }
      }

      toast.success(`Successfully imported ${successCount} out of ${previewMeals.length} meals!`);
      setIsBulkImportOpen(false);
      setBulkImportData("");
      setPreviewMeals([]);
    } catch (error) {
      console.error("Error during bulk import:", error);
      toast.error("Error importing meals: " + error.message);
    }
  };

  // Get color theme for a specific mess type
  const getMessTypeColors = (type) => {
    return messTypeColors[type] || messTypeColors.veg;
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 min-h-screen">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <motion.div
            className="flex justify-between items-center w-full sm:w-auto gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
                Meal Management
              </h1>
              <p className="text-xs sm:text-sm text-green-700 mt-1">
                Organize and track daily meals
              </p>
            </div>

            {/* Mobile Buttons */}
            <div className="sm:hidden flex gap-2">
              <motion.button
                onClick={() => setIsFormOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-3 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Meal</span>
              </motion.button>

              <motion.button
                onClick={() => setIsBulkImportOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-3 py-2 rounded-lg font-medium flex items-center transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Bulk Import</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Desktop Add Button */}
          <div className="hidden sm:flex justify-center sm:justify-start items-center gap-3">
            <motion.button
              onClick={() => setIsFormOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Add Meal</span>
            </motion.button>

            <motion.button
              onClick={() => setIsBulkImportOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
            >
              <Upload className="h-5 w-5 mr-2" />
              <span>Bulk Import</span>
            </motion.button>
          </div>
        </div>

        {/* Meal Type Filter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Meals Card */}
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow relative"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="cursor-pointer"
              onClick={clearFilters}
            >
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {mealCounts.total}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Total Meals
              </div>
              <div className="h-1 mt-2 rounded-full bg-blue-500"></div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteAllMeals();
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete all meals"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Veg Meals Card */}
          <motion.div
            className={`bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-shadow relative ${selectedMessType === "veg"
              ? "border-green-500 ring-2 ring-green-100"
              : "border-gray-200"
              }`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="cursor-pointer"
              onClick={() => handleFilterByType("veg")}
            >
              <div className="text-2xl md:text-3xl font-bold text-green-600">
                {mealCounts.veg}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Veg Meals
              </div>
              <div className="h-1 mt-2 rounded-full bg-green-500"></div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMealsByMessType("veg");
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete all veg meals"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Non-Veg Meals Card */}
          <motion.div
            className={`bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-shadow relative ${selectedMessType === "non-veg"
              ? "border-red-500 ring-2 ring-red-100"
              : "border-gray-200"
              }`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="cursor-pointer"
              onClick={() => handleFilterByType("non-veg")}
            >
              <div className="text-2xl md:text-3xl font-bold text-red-600">
                {mealCounts.nonVeg}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Non-Veg Meals
              </div>
              <div className="h-1 mt-2 rounded-full bg-red-500"></div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMealsByMessType("non-veg");
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete all non-veg meals"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Special Meals Card */}
          <motion.div
            className={`bg-white rounded-xl shadow-sm border p-4 text-center hover:shadow-md transition-shadow relative ${selectedMessType === "special"
              ? "border-purple-500 ring-2 ring-purple-100"
              : "border-gray-200"
              }`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="cursor-pointer"
              onClick={() => handleFilterByType("special")}
            >
              <div className="text-2xl md:text-3xl font-bold text-purple-600">
                {mealCounts.special}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Special Meals
              </div>
              <div className="h-1 mt-2 rounded-full bg-purple-500"></div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMealsByMessType("special");
              }}
              className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
              title="Delete all special meals"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        {/* Mobile grid Controls */}
        {/* Mobile Controls */}
        <div className="md:hidden mb-4">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-white border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/90 transition-all"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(selectedCategory !== "all" || selectedMessType !== "all") && (
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              )}
            </button>

            <div className="flex bg-white/40 backdrop-blur-sm rounded-lg p-1 border border-white/30">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 rounded transition-all ${viewMode === "grid"
                  ? "bg-white/80 shadow-sm"
                  : "text-gray-600"
                  }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 rounded transition-all ${viewMode === "list"
                  ? "bg-white/80 shadow-sm"
                  : "text-gray-600"
                  }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Controls - One Line */}
        <div className="hidden md:flex items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search meals..."
              className="w-64 pl-10 pr-4 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <select
              className="px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 w-32 transition-all"
              value={selectedMessType}
              onChange={(e) => setSelectedMessType(e.target.value)}
            >
              <option value="all">All Types</option>
              {messTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 w-32 transition-all"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 w-32 disabled:opacity-50 transition-all"
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={selectedCategory === "all"}
            >
              <option value="all">All Subcategories</option>
              {availableSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex bg-white/40 backdrop-blur-sm rounded-lg p-1 border border-white/30 ml-auto">
            <button
              onClick={() => handleViewModeChange("grid")}
              className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-white/80 shadow-sm" : "text-gray-600"
                }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleViewModeChange("list")}
              className={`p-2 rounded transition-all ${viewMode === "list" ? "bg-white/80 shadow-sm" : "text-gray-600"
                }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Filters Panel - Search Removed */}
        <div
          className={`md:hidden bg-white border-gray-200 rounded-lg mb-4 ${mobileFiltersOpen ? "block" : "hidden"
            }`}
        >
          <div className="p-4 space-y-4">
            {/* Search Completely Removed from Mobile */}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mess Type
                </label>
                <select
                  className="w-full px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  value={selectedMessType}
                  onChange={(e) => setSelectedMessType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {messTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                className="w-full px-3 py-2 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-50 transition-all"
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                disabled={selectedCategory === "all"}
              >
                <option value="all">All Subcategories</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedMessType !== "all" ||
          selectedSubcategory !== "all") && (
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>

                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-white/30">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedMessType !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-white/30">
                    Type: {selectedMessType}
                    <button
                      onClick={() => setSelectedMessType("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedCategory !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-white/30">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}

                {selectedSubcategory !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-white/30">
                    Subcategory: {selectedSubcategory}
                    <button
                      onClick={() => setSelectedSubcategory("all")}
                      className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                )}

                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 px-4 py-2 inline-block ">
            Showing {filteredMeals.length} of {meals.length} meals
          </p>
        </div>

        {/* Meals Display - Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            <AnimatePresence>
              {filteredMeals.map((meal, index) => {
                const mealColors = getMessTypeColors(meal.messType);
                return (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image/Icon Section */}
                    <div
                      className={`h-32 overflow-hidden relative ${mealColors.bg}`}
                    >
                      {meal.image ? (
                        <img
                          src={meal.image}
                          alt={meal.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Utensils className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${mealColors.light} ${mealColors.text}`}
                        >
                          {meal.messType}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate mb-1">
                        {meal.name}
                      </h3>

                      {/* Description hidden on mobile */}
                      <p className="hidden sm:block text-sm text-gray-500 line-clamp-2 mb-3">
                        {meal.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500 capitalize">
                          {meal.category} • {meal.subcategory || "General"}
                        </div>

                        <div className="flex items-center gap-1">
                          <motion.button
                            onClick={() => handleEdit(meal)}
                            className="p-1 text-indigo-600 hover:text-indigo-900"
                            title="Edit meal"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleCopyToOtherMessTypes(meal)}
                            className="p-1 text-yellow-600 hover:text-yellow-900"
                            title="Copy to other mess types"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(meal.id, meal.path)}
                            className="p-1 text-red-600 hover:text-red-900"
                            title="Delete meal"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Meals Display - List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden sm:block">
              {" "}
              {/* Desktop Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Subcategory
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence>
                      {filteredMeals.map((meal, index) => {
                        const mealColors = getMessTypeColors(meal.messType);
                        return (
                          <motion.tr
                            key={meal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div
                                  className={`flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center ${mealColors.bg}`}
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
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {meal.name}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {meal.category}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize hidden md:table-cell">
                              {meal.subcategory || "-"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mealColors.light} ${mealColors.text}`}
                              >
                                {meal.messType}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-1">
                                <motion.button
                                  onClick={() => handleEdit(meal)}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                  title="Edit meal"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Edit className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() =>
                                    handleCopyToOtherMessTypes(meal)
                                  }
                                  className="text-yellow-600 hover:text-yellow-900 p-1"
                                  title="Copy to other mess types"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Copy className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() =>
                                    handleDelete(meal.id, meal.path)
                                  }
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete meal"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="sm:hidden">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredMeals.map((meal, index) => {
                    const mealColors = getMessTypeColors(meal.messType);
                    return (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center flex-1 min-w-0">
                            <div
                              className={`flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden flex items-center justify-center ${mealColors.bg} mr-3`}
                            >
                              {meal.image ? (
                                <img
                                  src={meal.image}
                                  alt={meal.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Utensils className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <div className="min-w-0">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {meal.name}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs text-gray-500 capitalize">
                                      {meal.category}
                                    </span>
                                    {meal.subcategory && (
                                      <>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-xs text-gray-500 capitalize">
                                          {meal.subcategory}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${mealColors.light} ${mealColors.text}`}
                                >
                                  {meal.messType}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 ml-3">
                            <motion.button
                              onClick={() => handleEdit(meal)}
                              className="text-indigo-600 hover:text-indigo-900 p-1"
                              title="Edit meal"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleCopyToOtherMessTypes(meal)}
                              className="text-yellow-600 hover:text-yellow-900 p-1"
                              title="Copy to other mess types"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Copy className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(meal.id, meal.path)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete meal"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {filteredMeals.length === 0 && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center h-16 w-16 bg-gray-100 rounded-lg mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No meals found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ||
                    selectedCategory !== "all" ||
                    selectedMessType !== "all" ||
                    selectedSubcategory !== "all"
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first meal"}
                </p>
                {(searchTerm ||
                  selectedCategory !== "all" ||
                  selectedMessType !== "all" ||
                  selectedSubcategory !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-primary-600 hover:text-primary-800 text-sm"
                    >
                      Clear all filters
                    </button>
                  )}
              </div>
            )}
          </div>
        )}

        {/* No Results for Grid View */}
        {viewMode === "grid" && filteredMeals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-center h-16 w-16 bg-gray-100 rounded-lg mx-auto mb-4">
              <Utensils className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No meals found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ||
                selectedCategory !== "all" ||
                selectedMessType !== "all" ||
                selectedSubcategory !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first meal"}
            </p>
            {(searchTerm ||
              selectedCategory !== "all" ||
              selectedMessType !== "all" ||
              selectedSubcategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary-600 hover:text-primary-800 text-sm"
                >
                  Clear all filters
                </button>
              )}
          </div>
        )}

        {/* Meal Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <MealForm
              meal={editingMeal}
              isOpen={isFormOpen}
              onClose={handleCloseForm}
            />
          )}
        </AnimatePresence>

        {/* Copy to Other Mess Types Modal */}
        <AnimatePresence>
          {copyingMeal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Copy "{copyingMeal.name}"
                  </h3>
                  <button
                    onClick={() => setCopyingMeal(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Select mess types to copy this meal to:
                </p>

                <div className="space-y-3 mb-6">
                  {messTypes
                    .filter((type) => type !== copyingMeal.messType)
                    .map((type) => {
                      const typeColors = getMessTypeColors(type);
                      return (
                        <label
                          key={type}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={targetMessTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTargetMessTypes([...targetMessTypes, type]);
                              } else {
                                setTargetMessTypes(
                                  targetMessTypes.filter((t) => t !== type)
                                );
                              }
                            }}
                            className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors.light} ${typeColors.text}`}
                          >
                            {type}
                          </span>
                        </label>
                      );
                    })}
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    onClick={() => setCopyingMeal(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleCopyConfirm}
                    disabled={targetMessTypes.length === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy Meal
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Bulk Import Modal */}
        <AnimatePresence>
          {isBulkImportOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsBulkImportOpen(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-t-2xl">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Bulk Import Meals</h3>
                      <p className="text-green-100 text-sm mt-1">Import multiple meals at once</p>
                    </div>
                    <button
                      onClick={() => setIsBulkImportOpen(false)}
                      className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  {/* Mess Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Mess Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {messTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setBulkImportMessType(type)}
                          className={`p-3 rounded-xl border-2 font-medium transition-all ${bulkImportMessType === type
                            ? type === 'veg'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : type === 'non-veg'
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Format Instructions:</h4>
                    <div className="text-sm text-green-800 space-y-2">
                      <div>
                        <p><strong>CSV Format:</strong> name, description, category, subcategory, image (optional)</p>
                        <p className="text-xs text-green-600">Example: Idli, Soft steamed rice cakes, breakfast, Tiffin</p>
                      </div>
                      <div>
                        <p><strong>JSON Format:</strong> One meal object per line</p>
                        <p className="text-xs text-green-600">Example: {`{"name":"Idli","description":"Soft steamed rice cakes","category":"breakfast","subcategory":"Tiffin"}`}</p>
                      </div>
                      <div className="pt-2 border-t border-green-200">
                        <p className="font-semibold mb-1">Valid Subcategories:</p>
                        <p className="text-xs text-green-700">
                          <strong>Breakfast:</strong> Tiffin, Chutney, Egg, Juices<br />
                          <strong>Lunch:</strong> Rice, Curry, Accompaniments, Dessert, Chicken, Fish<br />
                          <strong>Snacks:</strong> Snacks<br />
                          <strong>Dinner:</strong> Staples, Curries, Side Dishes, Accompaniments, Fish, Special Items
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Data Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Data (One per line)
                    </label>
                    <textarea
                      value={bulkImportData}
                      onChange={(e) => setBulkImportData(e.target.value)}
                      className="w-full h-64 font-mono text-sm p-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Paste your meal data here...&#10;&#10;CSV Example:&#10;Idli, Soft steamed rice cakes, breakfast, Tiffin&#10;Dosa, Crispy rice crepe, breakfast, Tiffin&#10;Coconut Chutney, Fresh coconut chutney, breakfast, Chutney&#10;&#10;JSON Example:&#10;{&quot;name&quot;:&quot;Idli&quot;,&quot;description&quot;:&quot;Soft steamed rice cakes&quot;,&quot;category&quot;:&quot;breakfast&quot;,&quot;subcategory&quot;:&quot;Tiffin&quot;}&#10;{&quot;name&quot;:&quot;Dosa&quot;,&quot;description&quot;:&quot;Crispy rice crepe&quot;,&quot;category&quot;:&quot;breakfast&quot;,&quot;subcategory&quot;:&quot;Tiffin&quot;}"
                    />
                  </div>

                  {/* Preview Section */}
                  {previewMeals.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                          {previewMeals.length}
                        </span>
                        Meals Ready to Import
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {previewMeals.slice(0, 10).map((meal, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-green-100 flex items-start gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Utensils className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{meal.name}</p>
                              <p className="text-xs text-gray-500 truncate">{meal.description}</p>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{meal.category}</span>
                                {meal.subcategory && (
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{meal.subcategory}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        {previewMeals.length > 10 && (
                          <p className="text-xs text-gray-500 text-center py-2">
                            ... and {previewMeals.length - 10} more meals
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      onClick={() => {
                        setIsBulkImportOpen(false);
                        setBulkImportData("");
                        setPreviewMeals([]);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={previewMeals.length > 0 ? handleConfirmImport : handlePreviewImport}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={!bulkImportData.trim()}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Upload size={20} />
                      {previewMeals.length > 0 ? `Confirm Import (${previewMeals.length})` : 'Preview Meals'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MealManagement;
