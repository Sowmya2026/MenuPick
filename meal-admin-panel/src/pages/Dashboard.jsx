import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Users,
  Utensils,
  Clock,
  Plus,
  ChefHat,
  TrendingUp,
  MessagesSquare,
  RefreshCw,
  UserPlus,
  Settings,
} from "lucide-react";
import { useMeal } from "../context/MealContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const { meals, fetchStats } = useMeal();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMeals: 0,
    pendingStudents: 0,
    messTypes: {
      veg: { students: 0, meals: 0 },
      "non-veg": { students: 0, meals: 0 },
      special: { students: 0, meals: 0 },
    },
  });

  // Enhanced color scheme with pastel gradients
  const messTypeColors = {
    veg: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      primary: "green",
      gradient: "from-green-100 to-emerald-100",
      progress: "text-green-600",
      light: "bg-green-100",
      card: "bg-gradient-to-br from-green-50 to-emerald-50",
      badge: "bg-green-400",
      button: "bg-gradient-to-r from-green-400 to-emerald-500",
    },
    "non-veg": {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      primary: "red",
      gradient: "from-red-100 to-orange-100",
      progress: "text-red-600",
      light: "bg-red-100",
      card: "bg-gradient-to-br from-red-50 to-orange-50",
      badge: "bg-red-400",
      button: "bg-gradient-to-r from-red-400 to-orange-500",
    },
    special: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      primary: "purple",
      gradient: "from-purple-100 to-violet-100",
      progress: "text-purple-600",
      light: "bg-purple-100",
      card: "bg-gradient-to-br from-purple-50 to-violet-50",
      badge: "bg-purple-400",
      button: "bg-gradient-to-r from-purple-400 to-violet-500",
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (percentage) => ({
      width: `${percentage}%`,
      transition: {
        type: "spring",
        stiffness: 50,
        delay: 0.5,
      },
    }),
  };

  // Load all data from Firebase
  const loadDashboardData = async () => {
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

      // Count students by mess type
      const messTypeCounts = {
        veg: 0,
        "non-veg": 0,
        special: 0,
      };

      studentsData.forEach((student) => {
        if (messTypeCounts.hasOwnProperty(student.messPreference)) {
          messTypeCounts[student.messPreference]++;
        } else {
          messTypeCounts.veg++; // Default to veg if invalid
        }
      });

      // Count meals by mess type using the MealContext data
      const messTypeMeals = {
        veg: 0,
        "non-veg": 0,
        special: 0,
      };

      // Count meals by mess type
      meals.forEach((meal) => {
        if (messTypeMeals.hasOwnProperty(meal.messType)) {
          messTypeMeals[meal.messType]++;
        }
      });

      // Count students who haven't submitted preferences
      let pendingStudents = 0;
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

          if (!selectionsDoc.exists()) {
            pendingStudents++;
          }
        } catch (error) {
          console.error(
            `Error checking selections for student ${student.id}:`,
            error
          );
          pendingStudents++;
        }
      }

      // Update stats state
      setStats({
        totalStudents: studentsData.length,
        totalMeals: meals.length,
        pendingStudents,
        messTypes: {
          veg: { students: messTypeCounts.veg, meals: messTypeMeals.veg },
          "non-veg": {
            students: messTypeCounts["non-veg"],
            meals: messTypeMeals["non-veg"],
          },
          special: {
            students: messTypeCounts.special,
            meals: messTypeMeals.special,
          },
        },
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    fetchStats();
  }, [meals]);

  const handleRefresh = () => {
    loadDashboardData();
    fetchStats();
  };

  const quickActions = [
    {
      title: "Add Meal",
      description: "Create new meal",
      icon: Plus,
      color: "bg-gradient-to-r from-blue-400 to-cyan-500",
      action: () => navigate("/meals"),
    },
    {
      title: "Feedbacks",
      description: "Student feedbacks",
      icon: MessagesSquare,
      color: "bg-gradient-to-r from-indigo-400 to-purple-500",
      action: () => navigate("/students"),
    },
    {
      title: "Analytics",
      description: "Meal analytics",
      icon: TrendingUp,
      color: "bg-gradient-to-r from-green-400 to-teal-500",
      action: () => navigate("/analytics"),
    },
    {
      title: "Settings",
      description: "System settings",
      icon: Settings,
      color: "bg-gradient-to-r from-gray-400 to-slate-500",
      action: () => navigate("/settings"),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 p-3 sm:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/50 rounded w-1/3"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white/50 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/50 rounded-xl"></div>
              ))}
            </div>
            <div className="h-40 bg-white/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-900">
              Admin Panel
            </h1>
            <p className="text-xs sm:text-sm text-green-700 mt-1">
              Manage meals and student preferences
            </p>
          </div>
        </motion.div>

        {/* Overview Cards - Mobile optimized */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Total Students Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Students
              </h2>
              <div className="p-1 sm:p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.totalStudents}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Registered</p>
          </motion.div>

          {/* Total Meals Card */}
          <motion.div
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Meals
              </h2>
              <div className="p-1 sm:p-2 bg-green-100 rounded-lg">
                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.totalMeals}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Available</p>
          </motion.div>

          {/* Pending Students Card */}
          <motion.div
            className="col-span-2 md:col-span-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 sm:p-6"
            variants={itemVariants}
            whileHover="hover"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                Pending
              </h2>
              <div className="p-1 sm:p-2 bg-amber-100 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {stats.pendingStudents}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              No preferences
            </p>
          </motion.div>
        </motion.div>

        {/* Mess Type Breakdown - Horizontal Scroll for Mobile, Original Desktop */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile Horizontal Scroll */}
          <div className="flex md:hidden space-x-3 pb-2 overflow-x-auto scrollbar-hide">
            {Object.entries(stats.messTypes).map(([messType, data]) => {
              const colors = messTypeColors[messType];
              const studentPercentage = stats.totalStudents
                ? (data.students / stats.totalStudents) * 100
                : 0;
              const mealPercentage = stats.totalMeals
                ? (data.meals / stats.totalMeals) * 100
                : 0;

              return (
                <motion.div
                  key={messType}
                  className={`min-w-[140px] rounded-xl shadow-sm border p-3 backdrop-blur-sm ${colors.card} ${colors.border}`}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  {/* Compact Mobile Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold capitalize text-gray-900 truncate">
                      {messType}
                    </h2>
                    <div className={`p-1 rounded-lg ${colors.light}`}>
                      <ChefHat className={`h-3 w-3 ${colors.text}`} />
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-600">
                          Students
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {data.students}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${colors.progress.replace(
                            "text-",
                            "bg-"
                          )}`}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                          custom={studentPercentage}
                        ></motion.div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-gray-600">Meals</span>
                        <span className="text-xs font-bold text-gray-900">
                          {data.meals}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${colors.progress.replace(
                            "text-",
                            "bg-"
                          )}`}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                          custom={mealPercentage}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop - EXACT Previous Design */}
          <div className="hidden md:grid md:grid-cols-3 gap-4">
            {Object.entries(stats.messTypes).map(([messType, data]) => {
              const colors = messTypeColors[messType];
              const studentPercentage = stats.totalStudents
                ? (data.students / stats.totalStudents) * 100
                : 0;
              const mealPercentage = stats.totalMeals
                ? (data.meals / stats.totalMeals) * 100
                : 0;

              return (
                <motion.div
                  key={messType}
                  className={`rounded-xl shadow-sm border p-6 backdrop-blur-sm ${colors.card} ${colors.border}`}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold capitalize text-gray-900">
                      {messType} Mess
                    </h2>
                    <div className={`p-2 rounded-lg ${colors.light}`}>
                      <ChefHat className={`h-5 w-5 ${colors.text}`} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">Students</span>
                        <span className="text-sm font-bold text-gray-900">
                          {data.students}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${colors.progress.replace(
                            "text-",
                            "bg-"
                          )}`}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                          custom={studentPercentage}
                        ></motion.div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-700">
                          Meal Count
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {data.meals}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${colors.progress.replace(
                            "text-",
                            "bg-"
                          )}`}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                          custom={mealPercentage}
                        ></motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions - Mobile optimized */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="border-b border-gray-200/30 px-4 sm:px-6 py-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Common administrative tasks
            </p>
          </div>

          <div className="p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  onClick={action.action}
                  className="flex flex-col items-center text-center p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-200/50 hover:bg-white transition-all backdrop-blur-sm min-h-[80px] sm:min-h-[100px]"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`p-2 sm:p-3 rounded-full ${action.color} text-white mb-2`}
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <action.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-tight">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
