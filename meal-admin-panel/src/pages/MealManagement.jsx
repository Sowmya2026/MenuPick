import { useState, useMemo } from "react";
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
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

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
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedMessType("all");
    setSelectedSubcategory("all");
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
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900">
            Meal Management
          </h1>
        </div>

        <div className="flex items-center gap-3">

          <motion.button
            onClick={() => setIsFormOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Add Meal</span>
          </motion.button>
        </div>
      </div>

      {/* Meal Type Filter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Meals Card */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
          onClick={clearFilters}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-gray-900">
            {mealCounts.total}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">
            Total Meals
          </div>
          <div className="h-1 mt-2 rounded-full bg-blue-500"></div>
        </motion.div>

        {/* Veg Meals Card */}
        <motion.div
          className={`bg-white rounded-xl shadow-sm border p-4 text-center cursor-pointer hover:shadow-md transition-shadow ${
            selectedMessType === "veg"
              ? "border-green-500 ring-2 ring-green-100"
              : "border-gray-200"
          }`}
          onClick={() => handleFilterByType("veg")}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-green-600">
            {mealCounts.veg}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">Veg Meals</div>
          <div className="h-1 mt-2 rounded-full bg-green-500"></div>
        </motion.div>

        {/* Non-Veg Meals Card */}
        <motion.div
          className={`bg-white rounded-xl shadow-sm border p-4 text-center cursor-pointer hover:shadow-md transition-shadow ${
            selectedMessType === "non-veg"
              ? "border-red-500 ring-2 ring-red-100"
              : "border-gray-200"
          }`}
          onClick={() => handleFilterByType("non-veg")}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-red-600">
            {mealCounts.nonVeg}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">
            Non-Veg Meals
          </div>
          <div className="h-1 mt-2 rounded-full bg-red-500"></div>
        </motion.div>

        {/* Special Meals Card */}
        <motion.div
          className={`bg-white rounded-xl shadow-sm border p-4 text-center cursor-pointer hover:shadow-md transition-shadow ${
            selectedMessType === "special"
              ? "border-purple-500 ring-2 ring-purple-100"
              : "border-gray-200"
          }`}
          onClick={() => handleFilterByType("special")}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-2xl md:text-3xl font-bold text-purple-600">
            {mealCounts.special}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">
            Special Meals
          </div>
          <div className="h-1 mt-2 rounded-full bg-purple-500"></div>
        </motion.div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
        >
          <span className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </span>
          <span className="text-sm text-gray-500">
            {mobileFiltersOpen ? "Hide" : "Show"}
          </span>
        </button>
      </div>

      {/* Filters and Search */}
      <div
        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6 ${
          mobileFiltersOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Meals
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search meals..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mess Type
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedMessType}
              onChange={(e) => {
                setSelectedMessType(e.target.value);
                setSelectedSubcategory("all");
              }}
            >
              <option value="all">All Types</option>
              {messTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("all");
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              disabled={
                selectedCategory === "all" || selectedMessType === "all"
              }
            >
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory === "all" ? "All Subcategories" : subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(searchTerm ||
          selectedCategory !== "all" ||
          selectedMessType !== "all" ||
          selectedSubcategory !== "all") && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedMessType !== "all" && (
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    getMessTypeColors(selectedMessType).light
                  } ${getMessTypeColors(selectedMessType).text}`}
                >
                  Type: {selectedMessType}
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Category: {selectedCategory}
                </span>
              )}

              {selectedSubcategory !== "all" && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Sub: {selectedSubcategory}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-800 whitespace-nowrap"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Count and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <p className="text-sm text-gray-600">
          Showing {filteredMeals.length} of {meals.length} meals
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:block">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Meals Display - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
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
                        <Utensils className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${mealColors.light} ${mealColors.text}`}
                      >
                        {meal.messType}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">
                      {meal.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {meal.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
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
                              <div className="text-xs text-gray-500 line-clamp-1 sm:hidden">
                                {meal.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 capitalize hidden sm:table-cell">
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
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
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
    </div>
  );
};

export default MealManagement;
