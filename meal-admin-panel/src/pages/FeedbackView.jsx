import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  Star,
  Filter,
  Search,
  Calendar,
  User,
  Utensils,
  MessageSquare,
  ThumbsUp,
  Flag,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const FeedbackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    messType: "all",
    mealCategory: "all",
    rating: "all",
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const messNameOptions = [
    { value: "all", label: "All Mess" },
    { value: "FoodEXO", label: "FoodEXO Mess" },
    { value: "Shakthi", label: "Shakthi Mess" },
    { value: "Annapurna", label: "Annapurna Mess" },
    { value: "Grand", label: "Grand Mess" },
  ];

  const messTypeOptions = [
    { value: "all", label: "All Mess Types" },
    { value: "veg", label: "Vegetarian" },
    { value: "non-veg", label: "Non-Vegetarian" },
    { value: "special", label: "Special Diet" },
  ];

  const mealCategoryOptions = [
    { value: "all", label: "All Meals" },
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "snacks", label: "Snacks" },
    { value: "dinner", label: "Dinner" },
  ];

  const ratingOptions = [
    { value: "all", label: "All Ratings" },
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
    { value: "1", label: "1 Star" },
  ];

  // Fetch feedbacks from Firestore
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, "feedback"), orderBy("submittedAt", "desc"));

      const querySnapshot = await getDocs(q);
      const feedbacksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate() || new Date(),
      }));

      setFeedbacks(feedbacksData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on search and filters
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.messName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || feedback.status === filters.status;
    const matchesMessType =
      filters.messType === "all" || feedback.messType === filters.messType;
    const matchesMealCategory =
      filters.mealCategory === "all" ||
      feedback.mealCategory === filters.mealCategory;
    const matchesRating =
      filters.rating === "all" ||
      feedback.overallRating >= parseInt(filters.rating);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesMessType &&
      matchesMealCategory &&
      matchesRating
    );
  });

  // Update feedback status
  const updateFeedbackStatus = async (feedbackId, newStatus) => {
    try {
      const feedbackRef = doc(db, "feedback", feedbackId);
      await updateDoc(feedbackRef, { status: newStatus });

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === feedbackId ? { ...fb, status: newStatus } : fb
        )
      );

      toast.success(`Feedback ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating feedback status:", error);
      toast.error("Failed to update feedback status");
    }
  };

  // Delete feedback
  const deleteFeedback = async (feedbackId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this feedback? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteDoc(doc(db, "feedback", feedbackId));
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== feedbackId));
      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  // Star rating display component
  const StarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <Star
              key={index}
              size={16}
              className={
                starValue <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }
            />
          );
        })}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  // Compact Star rating for mobile
  const CompactStarRating = ({ rating }) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="text-yellow-400 fill-current" size={14} />
        <span className="text-sm font-medium text-gray-700">{rating}</span>
        <span className="text-xs text-gray-500">/5</span>
      </div>
    );
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      approved: { color: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Mess type badge component
  const MessTypeBadge = ({ type }) => {
    const typeConfig = {
      veg: { color: "bg-green-100 text-green-800", label: "Veg" },
      "non-veg": { color: "bg-red-100 text-red-800", label: "Non-Veg" },
      special: { color: "bg-purple-100 text-purple-800", label: "Special" },
    };

    const config = typeConfig[type] || typeConfig.veg;

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 p-4 sm:p-6">
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center w-full sm:w-auto">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
                Student Feedback
              </h1>
              <p className="text-xs sm:text-sm text-green-700 mt-1">
                Manage and review student feedback submissions
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center space-x-1 bg-white px-3 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <Filter size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mt-16 p-4 transform transition-all duration-200 ease-out">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Mess Name Filter */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mess Name
                  </label>
                  <select
                    value={filters.messName}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        messName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    {messNameOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Meal Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal
                  </label>
                  <select
                    value={filters.mealCategory}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        mealCategory: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    {mealCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mess Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={filters.messType}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        messType: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    {messTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        rating: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    {ratingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Mess Name Filter */}
          <select
            value={filters.messName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, messName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {messNameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Meal Category Filter */}
          <div>
            <select
              value={filters.mealCategory}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  mealCategory: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {mealCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mess Type Filter */}
          <div>
            <select
              value={filters.messType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, messType: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {messTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <select
              value={filters.rating}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, rating: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {ratingOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Total Feedback
              </p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {feedbacks.length}
              </p>
            </div>
            <MessageSquare className="text-blue-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Pending Review
              </p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {feedbacks.filter((fb) => fb.status === "pending").length}
              </p>
            </div>
            <MessageSquare className="text-yellow-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Approved
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {feedbacks.filter((fb) => fb.status === "approved").length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={20} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                Average Rating
              </p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {feedbacks.length > 0
                  ? (
                      feedbacks.reduce((sum, fb) => sum + fb.overallRating, 0) /
                      feedbacks.length
                    ).toFixed(1)
                  : "0.0"}
              </p>
            </div>
            <Star className="text-purple-600" size={20} />
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No feedback found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {feedbacks.length === 0
                ? "No feedback submissions yet."
                : "Try changing your filters or search term."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
              >
                {/* Mobile Header */}
                <div className="sm:hidden mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {feedback.studentName}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1 flex-wrap">
                          <StatusBadge status={feedback.status} />
                          <MessTypeBadge type={feedback.messType} />
                        </div>
                      </div>
                    </div>
                    <CompactStarRating rating={feedback.overallRating} />
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span className="truncate">{feedback.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Utensils size={12} />
                      <span className="truncate">
                        {feedback.mealCategory.charAt(0).toUpperCase() +
                          feedback.mealCategory.slice(1)}
                      </span>
                      <span>•</span>
                      <span className="truncate">{feedback.messName}</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden sm:flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {feedback.studentName}
                        </h3>
                        {feedback.anonymous && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            Anonymous
                          </span>
                        )}
                        <StatusBadge status={feedback.status} />
                        <MessTypeBadge type={feedback.messType} />
                      </div>
                      <p className="text-sm text-gray-500">
                        {feedback.registrationNumber} • {feedback.messName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {feedback.date}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Utensils size={14} className="mr-1" />
                        {feedback.mealCategory.charAt(0).toUpperCase() +
                          feedback.mealCategory.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ratings - Desktop */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-500">Overall</label>
                    <StarRating rating={feedback.overallRating} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Taste</label>
                    <StarRating rating={feedback.tasteRating} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Quantity</label>
                    <StarRating rating={feedback.quantityRating} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Freshness</label>
                    <StarRating rating={feedback.freshnessRating} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Variety</label>
                    <StarRating rating={feedback.varietyRating} />
                  </div>
                </div>

                {/* Ratings - Mobile */}
                <div className="sm:hidden grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div>
                    <label className="text-gray-500 block mb-1">Taste</label>
                    <CompactStarRating rating={feedback.tasteRating} />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Quantity</label>
                    <CompactStarRating rating={feedback.quantityRating} />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">
                      Freshness
                    </label>
                    <CompactStarRating rating={feedback.freshnessRating} />
                  </div>
                </div>

                {/* Feedback Content - FIXED FOR MOBILE */}
                <div className="mb-3 sm:mb-4">
                  <p className="text-gray-700 text-sm sm:text-base break-words whitespace-pre-wrap overflow-hidden">
                    {feedback.description}
                  </p>
                </div>

                {/* Highlights and Improvements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {feedback.highlights && (
                    <div className="bg-green-50 rounded-lg p-2 sm:p-3 break-words">
                      <label className="text-xs font-medium text-green-800">
                        Highlights
                      </label>
                      <p className="text-xs sm:text-sm text-green-700 mt-1 break-words">
                        {feedback.highlights}
                      </p>
                    </div>
                  )}
                  {feedback.improvements && (
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3 break-words">
                      <label className="text-xs font-medium text-blue-800">
                        Suggestions
                      </label>
                      <p className="text-xs sm:text-sm text-blue-700 mt-1 break-words">
                        {feedback.improvements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Submitted: {feedback.submittedAt.toLocaleDateString()} at{" "}
                      {feedback.submittedAt.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    {/* Mobile timestamp */}
                    <div className="sm:hidden text-xs text-gray-500 mb-2">
                      Submitted: {feedback.submittedAt.toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2 w-full sm:w-auto">
                      {feedback.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateFeedbackStatus(feedback.id, "approved")
                            }
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-2 py-1.5 text-xs sm:text-sm text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <CheckCircle size={14} />
                            <span className="truncate">Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              updateFeedbackStatus(feedback.id, "rejected")
                            }
                            className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-2 py-1.5 text-xs sm:text-sm text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <XCircle size={14} />
                            <span className="truncate">Reject</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => deleteFeedback(feedback.id)}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-2 py-1.5 text-xs sm:text-sm text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 size={14} />
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
  
};

export default FeedbackView;
