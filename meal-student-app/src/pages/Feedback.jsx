import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { db } from '../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Star, 
  Utensils, 
  Calendar, 
  Clock, 
  Send, 
  X, 
  User, 
  BookOpen,
  AlertCircle,
  CheckCircle,
  Leaf,
  Beef,
  ChefHat
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const FeedbackForm = ({ onClose, defaultMealType = 'breakfast' }) => {
  const { currentUser } = useAuth();
  const { selectedMess } = useMenu();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const [formData, setFormData] = useState({
    studentName: '',
    registrationNumber: '',
    messType: selectedMess || 'veg',
    date: new Date().toISOString().split('T')[0],
    mealCategory: defaultMealType,
    messName: 'FoodEXO',
    overallRating: 0,
    tasteRating: 0,
    quantityRating: 0,
    freshnessRating: 0,
    varietyRating: 0,
    description: '',
    wouldRecommend: null,
    highlights: '',
    improvements: '',
    anonymous: false
  });

  // Get gradient class for header based on mess type (same as home page)
  const getHeaderGradient = (messType) => {
    switch (messType) {
      case 'veg':
        return "bg-gradient-to-r from-green-600 to-green-800";
      case 'non-veg':
        return "bg-gradient-to-r from-red-600 to-red-800";
      case 'special':
        return "bg-gradient-to-r from-purple-600 to-purple-800";
      default:
        return "bg-gradient-to-r from-green-600 to-purple-600";
    }
  };

  // Get color class based on mess type (same as home page)
  const getColorClass = (messType) => {
    switch (messType) {
      case 'veg':
        return "text-green-600";
      case 'non-veg':
        return "text-red-600";
      case 'special':
        return "text-purple-600";
      default:
        return "text-gray-800";
    }
  };

  // Get mess icon (same as home page)
  const getMessIcon = () => {
    switch (formData.messType) {
      case 'veg':
        return <Leaf size={20} className="text-green-600" />;
      case 'non-veg':
        return <Beef size={20} className="text-red-600" />;
      case 'special':
        return <Star size={20} className="text-purple-600" />;
      default:
        return <Leaf size={20} className="text-green-600" />;
    }
  };

  // Mess options
  const messOptions = [
    { id: 'FoodEXO', name: 'FoodEXO Mess', type: 'veg' },
    { id: 'Shakthi', name: 'Shakthi Mess', type: 'non-veg' },
    { id: 'Annapurna', name: 'Annapurna Mess', type: 'veg' },
    { id: 'Grand', name: 'Grand Mess', type: 'special' }
  ];

  // Meal categories
  const mealCategories = [
    { id: 'breakfast', name: 'Breakfast', time: '7:00 AM - 9:00 AM' },
    { id: 'lunch', name: 'Lunch', time: '12:00 PM - 2:00 PM' },
    { id: 'snacks', name: 'Evening Snacks', time: '4:00 PM - 5:00 PM' },
    { id: 'dinner', name: 'Dinner', time: '7:00 PM - 9:00 PM' }
  ];

  // Mess types
  const messTypes = [
    { id: 'veg', name: 'Vegetarian', color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'non-veg', name: 'Non-Vegetarian', color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'special', name: 'Special Diet', color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ];

  // Load student profile data
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        studentName: currentUser.displayName || 'Student',
        registrationNumber: currentUser.studentId || 'Not provided',
        messType: selectedMess || 'veg'
      }));
    }
  }, [currentUser, selectedMess]);

  // Update word count
  useEffect(() => {
    setWordCount(formData.description.length);
  }, [formData.description]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle rating change
  const handleRatingChange = (ratingType, value) => {
    setFormData(prev => ({
      ...prev,
      [ratingType]: value
    }));
  };

  // Star rating component
  const StarRating = ({ rating, onRatingChange, label, maxStars = 5 }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-1">
          {[...Array(maxStars)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onRatingChange(starValue)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  className={
                    starValue <= rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-gray-500">{rating}/5</span>
        </div>
      </div>
    );
  };

  // Validate form
  const validateForm = () => {
    if (formData.overallRating === 0) {
      toast.error('Please provide an overall rating');
      return false;
    }
    if (formData.description.trim().length < 10) {
      toast.error('Please provide a detailed description (minimum 10 characters)');
      return false;
    }
    if (formData.description.length > 1500) {
      toast.error('Description must be less than 1500 characters');
      return false;
    }
    return true;
  };

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        studentId: currentUser.uid,
        studentName: formData.anonymous ? 'Anonymous' : formData.studentName,
        registrationNumber: formData.anonymous ? 'Hidden' : formData.registrationNumber,
        messType: formData.messType,
        messName: formData.messName,
        mealCategory: formData.mealCategory,
        date: formData.date,
        submittedAt: serverTimestamp(),
        overallRating: formData.overallRating,
        tasteRating: formData.tasteRating,
        quantityRating: formData.quantityRating,
        freshnessRating: formData.freshnessRating,
        varietyRating: formData.varietyRating,
        description: formData.description.trim(),
        wouldRecommend: formData.wouldRecommend,
        highlights: formData.highlights.trim(),
        improvements: formData.improvements.trim(),
        anonymous: formData.anonymous,
        status: 'pending',
        likes: 0,
        reports: 0
      };

      const docRef = await addDoc(collection(db, 'feedback'), feedbackData);
      
      toast.success('Feedback submitted successfully! Thank you for your review.');
      
      setFormData(prev => ({
        ...prev,
        overallRating: 0,
        tasteRating: 0,
        quantityRating: 0,
        freshnessRating: 0,
        varietyRating: 0,
        description: '',
        wouldRecommend: null,
        highlights: '',
        improvements: ''
      }));
      
      onClose?.();
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Please sign in</h3>
        <p className="mt-1 text-sm text-gray-500">You need to be signed in to submit feedback.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Same as home page */}
      <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-8">
        <div className="text-center">
          <h1 className={`text-2xl font-bold bg-clip-text text-transparent font-serif sm:text-3xl md:text-4xl ${getHeaderGradient(formData.messType)} mb-2 sm:mb-3 md:mb-4`}>
            Mess Feedback
          </h1>
        </div>
      </div>

      {/* Main Content - Same padding as home page */}
      <div className="px-3 pb-4 sm:px-4 sm:pb-6 md:px-6 md:pb-8">
        {/* Mess Type Header - Same as home page */}
        <div className="flex items-center justify-center mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center mr-2 sm:mr-3">
            {getMessIcon()}
          </div>
          <h2 className={`text-lg font-semibold font-serif sm:text-xl md:text-2xl ${getColorClass(formData.messType)}`}>
            Share Your Dining Experience
          </h2>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 max-w-4xl mx-auto">
        
          <form onSubmit={handleSubmit} className="p-4 space-y-6 sm:p-6">
            {/* Student Information Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <User size={16} className="mr-2" />
                Student Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {formData.studentName}
                    </span>
                    {formData.anonymous && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Anonymous
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Registration Number</label>
                  <span className="font-medium text-gray-900">
                    {formData.anonymous ? '••••••••' : formData.registrationNumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Meal Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Utensils size={16} className="mr-2" />
                Meal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mess Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mess Type
                  </label>
                  <div className="flex space-x-2">
                    {messTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('messType', type.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          formData.messType === type.id
                            ? `${type.bgColor} ${type.color} border-2 border-current`
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meal Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Category *
                  </label>
                  <select
                    required
                    value={formData.mealCategory}
                    onChange={(e) => handleInputChange('mealCategory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {mealCategories.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name} ({meal.time})
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {/* Date */}
                 {/* Mess Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mess Name *
                  </label>
                  <select
                    required
                    value={formData.messName}
                    onChange={(e) => handleInputChange('messName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {messOptions.map((mess) => (
                      <option key={mess.id} value={mess.id}>
                        {mess.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                
              </div>

            </div>

            {/* Ratings Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Ratings</h3>
              
              {/* Overall Rating */}
              <StarRating
                rating={formData.overallRating}
                onRatingChange={(value) => handleRatingChange('overallRating', value)}
                label="Overall Experience *"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StarRating
                  rating={formData.tasteRating}
                  onRatingChange={(value) => handleRatingChange('tasteRating', value)}
                  label="Taste & Flavor"
                />
                <StarRating
                  rating={formData.quantityRating}
                  onRatingChange={(value) => handleRatingChange('quantityRating', value)}
                  label="Quantity & Portion"
                />
                <StarRating
                  rating={formData.freshnessRating}
                  onRatingChange={(value) => handleRatingChange('freshnessRating', value)}
                  label="Freshness & Quality"
                />
                <StarRating
                  rating={formData.varietyRating}
                  onRatingChange={(value) => handleRatingChange('varietyRating', value)}
                  label="Variety & Options"
                />
              </div>
            </div>

            {/* Feedback Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Your Feedback</h3>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description about the mess menu *
                  <span className="text-xs text-gray-500 ml-2">
                    ({wordCount}/1500 characters)
                  </span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Share your detailed experience with today's menu. What did you like? What could be improved? (10-1500 characters)"
                  rows={5}
                  maxLength={1500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Minimum 10 characters required</span>
                  <span>{1500 - wordCount} characters remaining</span>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What stood out positively?
                </label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => handleInputChange('highlights', e.target.value)}
                  placeholder="Mention any particular dishes or aspects you really enjoyed..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Improvements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suggestions for improvement
                </label>
                <textarea
                  value={formData.improvements}
                  onChange={(e) => handleInputChange('improvements', e.target.value)}
                  placeholder="Any suggestions to make the dining experience better..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Submit anonymously (your name and registration number will be hidden)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;