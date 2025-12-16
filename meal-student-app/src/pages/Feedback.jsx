import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  Star,
  Send,
  Calendar,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";

const Feedback = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { selectedMess } = useMenu();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    messType: selectedMess || "veg",
    date: new Date().toISOString().split("T")[0],
    mealCategory: "breakfast",
    messName: "FoodEXO",
    overallRating: 0,
    tasteRating: 0,
    quantityRating: 0,
    freshnessRating: 0,
    description: "",
    anonymous: false,
  });

  const mealCategories = [
    { id: "breakfast", name: "Breakfast" },
    { id: "lunch", name: "Lunch" },
    { id: "snacks", name: "Snacks" },
    { id: "dinner", name: "Dinner" },
  ];

  const messOptions = [
    { id: "FoodEXO", name: "FoodEXO Mess" },
    { id: "Shakthi", name: "Shakthi Mess" },
    { id: "Annapurna", name: "Annapurna Mess" },
    { id: "Grand", name: "Grand Mess" },
  ];

  // Prevent back navigation - redirect to home
  useEffect(() => {
    window.history.replaceState(null, '', location.pathname);

    const handlePopState = (e) => {
      e.preventDefault();
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (selectedMess) {
      setFormData((prev) => ({ ...prev, messType: selectedMess }));
    }
  }, [selectedMess]);

  const StarRating = ({ rating, onRatingChange, label }) => (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium" style={{ color: theme.colors.text }}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <Star
              size={20}
              className={star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}
            />
          </button>
        ))}
        <span className="ml-2 text-xs sm:text-sm" style={{ color: theme.colors.textSecondary }}>
          {rating}/5
        </span>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.overallRating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }
    if (formData.description.trim().length < 10) {
      toast.error("Please provide a detailed description (minimum 10 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackData = {
        studentId: currentUser.uid,
        studentName: formData.anonymous ? "Anonymous" : currentUser?.name || "Student",
        messType: formData.messType,
        messName: formData.messName,
        mealCategory: formData.mealCategory,
        date: formData.date,
        submittedAt: serverTimestamp(),
        overallRating: formData.overallRating,
        tasteRating: formData.tasteRating,
        quantityRating: formData.quantityRating,
        freshnessRating: formData.freshnessRating,
        description: formData.description.trim(),
        anonymous: formData.anonymous,
        status: "pending",
      };

      await addDoc(collection(db, "feedback"), feedbackData);

      toast.success("Feedback submitted successfully! Thank you.");

      // Redirect to home after successful submission
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center pb-24" style={{ background: theme.colors.background }}>
          <div className="text-center px-6">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" style={{ color: theme.colors.textTertiary }} />
            <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: theme.colors.text }}>
              Please Sign In
            </h3>
            <p className="text-sm sm:text-base" style={{ color: theme.colors.textSecondary }}>
              You need to be signed in to submit feedback.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] pb-20 md:pb-6" style={{ background: theme.colors.background }}>
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b md:border-b-0 md:pt-8" style={{ background: theme.colors.card, borderColor: theme.colors.border, backgroundColor: 'transparent' }}>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: theme.colors.text }}>
              Meal Feedback
            </h1>
            <p className="text-xs sm:text-sm mt-1" style={{ color: theme.colors.textSecondary }}>
              Share your dining experience
            </p>
          </div>

          {/* Form */}
          <div className="px-4 sm:px-6 py-2 md:py-6">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Meal Details Card */}
              <div className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm" style={{ background: theme.colors.card, border: `1px solid ${theme.colors.border}` }}>
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <MessageSquare className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  Meal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Meal Category
                    </label>
                    <div className="relative">
                      <select
                        value={formData.mealCategory}
                        onChange={(e) => setFormData({ ...formData, mealCategory: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base rounded-xl border appearance-none focus:ring-2 focus:ring-opacity-20 transition-all cursor-pointer"
                        style={{
                          background: theme.colors.backgroundSecondary,
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                          outlineColor: theme.colors.primary
                        }}
                      >
                        {mealCategories.map((meal) => (
                          <option key={meal.id} value={meal.id}>
                            {meal.name}
                          </option>
                        ))}
                      </select>
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none rotate-180" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Mess Name
                    </label>
                    <div className="relative">
                      <select
                        value={formData.messName}
                        onChange={(e) => setFormData({ ...formData, messName: e.target.value })}
                        className="w-full px-3 py-2.5 text-sm sm:text-base rounded-xl border appearance-none focus:ring-2 focus:ring-opacity-20 transition-all cursor-pointer"
                        style={{
                          background: theme.colors.backgroundSecondary,
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                          outlineColor: theme.colors.primary
                        }}
                      >
                        {messOptions.map((mess) => (
                          <option key={mess.id} value={mess.id}>
                            {mess.name}
                          </option>
                        ))}
                      </select>
                      <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none rotate-180" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: theme.colors.text }}>
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: theme.colors.textSecondary }} />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 text-sm sm:text-base rounded-xl border focus:ring-2 focus:ring-opacity-20 transition-all cursor-pointer"
                        style={{
                          background: theme.colors.backgroundSecondary,
                          color: theme.colors.text,
                          borderColor: theme.colors.border,
                          outlineColor: theme.colors.primary
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Ratings Card */}
              <div className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm" style={{ background: theme.colors.card, border: `1px solid ${theme.colors.border}` }}>
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2" style={{ color: theme.colors.text }}>
                  <Star className="w-5 h-5" style={{ color: theme.colors.primary }} />
                  Ratings
                </h3>

                <StarRating
                  rating={formData.overallRating}
                  onRatingChange={(value) => setFormData({ ...formData, overallRating: value })}
                  label="Overall Experience *"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StarRating
                    rating={formData.tasteRating}
                    onRatingChange={(value) => setFormData({ ...formData, tasteRating: value })}
                    label="Taste & Flavor"
                  />
                  <StarRating
                    rating={formData.quantityRating}
                    onRatingChange={(value) => setFormData({ ...formData, quantityRating: value })}
                    label="Quantity"
                  />
                  <StarRating
                    rating={formData.freshnessRating}
                    onRatingChange={(value) => setFormData({ ...formData, freshnessRating: value })}
                    label="Freshness"
                  />
                </div>
              </div>

              {/* Description Card */}
              <div className="rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm" style={{ background: theme.colors.card, border: `1px solid ${theme.colors.border}` }}>
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.colors.text }}>
                  Your Feedback *
                </h3>

                <div>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Share your detailed experience (minimum 10 characters)"
                    rows={5}
                    maxLength={1500}
                    className="w-full px-3 py-3 text-sm sm:text-base rounded-xl border resize-none focus:ring-2 focus:ring-opacity-20 transition-all"
                    style={{
                      background: theme.colors.backgroundSecondary,
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                      outlineColor: theme.colors.primary
                    }}
                  />
                  <div className="flex justify-between text-xs mt-2" style={{ color: theme.colors.textTertiary }}>
                    <span>Minimum 10 characters</span>
                    <span>{formData.description.length}/1500</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: theme.colors.primary }}
                  />
                  <label htmlFor="anonymous" className="text-xs sm:text-sm cursor-pointer select-none" style={{ color: theme.colors.text }}>
                    Submit anonymously
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
                style={{
                  background: theme.colors.primary,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
