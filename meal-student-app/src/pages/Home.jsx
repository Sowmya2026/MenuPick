import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import DaySelector from "../components/DaySelector";
import MealTimeCard from "../components/MealTimeCard";
import {
  Leaf,
  Beef,
  Star,
  Calendar,
  Utensils,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";

const Home = () => {
  const { currentUser } = useAuth();
  const {
    selectedMess,
    setSelectedMess,
    selectedDay,
    setSelectedDay,
    selectedMealTime,
    setSelectedMealTime,
    getMenuItems,
    getMessColor,
    getTimings,
    days,
  } = useMenu();

  const [currentDate, setCurrentDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set default mess type based on user preference
  useEffect(() => {
    if (currentUser?.messPreference) {
      setSelectedMess(currentUser.messPreference);
    }

    // Set current date in a formatted way
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(formattedDate);
  }, [currentUser, setSelectedMess]);

  // Toggle individual card expand state
  const toggleCardExpand = (mealTime) => {
    setExpandedCards(prev => ({
      ...prev,
      [mealTime]: !prev[mealTime]
    }));
  };

  // Close all cards when mess type changes
  useEffect(() => {
    setExpandedCards({});
  }, [selectedMess]);

  // Close all cards when day changes
  useEffect(() => {
    setExpandedCards({});
  }, [selectedDay]);

  // Mess type options with icons and updated colors
  const messTypes = [
    {
      id: "veg",
      name: "Vegetarian",
      icon: <Leaf size={20} className="text-green-600" />,
      color: "green",
    },
    {
      id: "non-veg",
      name: "Non-Veg",
      icon: <Beef size={20} className="text-red-600" />,
      color: "red",
    },
    {
      id: "special",
      name: "Special",
      icon: <Star size={20} className="text-purple-600" />,
      color: "purple",
    },
  ];

  // Get current mess color
  const currentMessColor = getMessColor(selectedMess);
  const currentTimings = getTimings(selectedMess);

  // Get selected mess details
  const selectedMessDetails =
    messTypes.find((mess) => mess.id === selectedMess) || messTypes[0];

  // Get color class based on mess type
  const getColorClass = (messId) => {
    switch (messId) {
      case "veg":
        return "text-green-600";
      case "non-veg":
        return "text-red-600";
      case "special":
        return "text-purple-600";
      default:
        return "text-gray-800";
    }
  };

  // Get gradient class for header based on mess type
  const getHeaderGradient = (messId) => {
    switch (messId) {
      case "veg":
        return "bg-gradient-to-r from-green-600 to-green-800";
      case "non-veg":
        return "bg-gradient-to-r from-red-600 to-red-800";
      case "special":
        return "bg-gradient-to-r from-purple-600 to-purple-800";
      default:
        return "bg-gradient-to-r from-green-600 to-purple-600";
    }
  };

  // Motivational quotes for students
  const motivationalQuotes = [
    "Fuel your body, conquer your day.",
    "Good food, happy mind, happy life.",
    "Eat well, respect your body daily.",
    "Healthy choices build a better future.",
    "Food is energy, enjoy every bite.",
    "Health first, always take care.",
    "Savor every bite, taste the joy.",
  ];

  // Select a random quote
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Toggle dropdown based on device
  const toggleDropdown = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(true);
    }
  };

  // Handle mess selection
  const handleMessSelect = (messId) => {
    setSelectedMess(messId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".mess-selector-container")) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isMobile]);

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-12">
          <div className="text-center">
            <h1 className={`text-2xl font-bold bg-clip-text text-transparent font-serif sm:text-3xl md:text-4xl ${getHeaderGradient(selectedMess)} mb-3 sm:mb-4 md:mb-5`}>
              Campus Dining
            </h1>

            <p className="text-xs text-gray-700 italic font-light sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-5">
              "{randomQuote}"
            </p>

            <div className="flex items-center justify-center text-gray-600">
              <Calendar size={14} className="mr-1 sm:mr-2 sm:size-4" />
              <p className="text-xs sm:text-sm md:text-base">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pb-6 sm:px-6 sm:pb-8 md:px-8 md:pb-12">
          {/* Mess Type Selector */}
          <div className="flex items-center justify-center mb-5 sm:mb-6 md:mb-8 mess-selector-container">
            <div className="relative mr-3 sm:mr-4">
              {/* Clickable area for dropdown */}
              <div
                className="flex items-center p-3 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm sm:p-3.5 md:p-4"
                onClick={toggleDropdown}
                onMouseEnter={() => !isMobile && setIsOpen(true)}
              >
                <div className="flex items-center">
                  {selectedMessDetails.icon}
                  <ChevronDown
                    size={16}
                    className={`ml-2 text-gray-600 transition-transform sm:size-4 sm:ml-2.5 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* Dropdown */}
              {isOpen && (
                <div
                  className={`absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px] sm:min-w-[180px] ${
                    isMobile ? "w-full" : ""
                  }`}
                >
                  {messTypes.map((mess) => (
                    <div
                      key={mess.id}
                      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors sm:p-3.5 md:p-4 ${
                        selectedMess === mess.id ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleMessSelect(mess.id)}
                    >
                      <div className="mr-3 sm:mr-4">{mess.icon}</div>
                      <span className="text-sm text-gray-800 sm:text-base">
                        {mess.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu title with colored text */}
            <h2
              className={`text-lg font-semibold font-serif sm:text-xl md:text-2xl ${getColorClass(selectedMess)}`}
            >
              {selectedMessDetails.name} Menu
            </h2>
          </div>

          {selectedMess && (
            <div className="max-w-6xl mx-auto">
              {/* Day Selector */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <DaySelector
                  days={days}
                  selectedDay={selectedDay}
                  onSelect={setSelectedDay}
                  hideLabel={true}
                  messType={selectedMess}
                />
              </div>

              {/* Meal Time Cards Grid */}
              <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {Object.entries(currentTimings).map(([mealTime, timing]) => (
                  <MealTimeCard
                    key={mealTime}
                    mealTime={mealTime}
                    timing={timing}
                    isExpanded={expandedCards[mealTime] || false}
                    onToggleExpand={() => toggleCardExpand(mealTime)}
                    items={getMenuItems(selectedMess, selectedDay, mealTime)}
                    messType={selectedMess}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;