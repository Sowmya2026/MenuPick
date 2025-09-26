import { useAuth } from "../context/AuthContext";
import { useMenu } from "../context/MenuContext";
import DaySelector from "../components/DaySelector";
import MealTimeCard from "../components/MealTimeCard";
import { Leaf, Beef, Star, Calendar, Utensils, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from '../components/Layout';

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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

  // Mess type options with icons and updated colors
  const messTypes = [
    {
      id: "veg",
      name: "Vegetarian",
      icon: <Leaf size={22} className="text-green-600" />,
      color: "green",
    },
    {
      id: "non-veg",
      name: "Non-Veg",
      icon: <Beef size={22} className="text-red-600" />,
      color: "red",
    },
    {
      id: "special",
      name: "Special",
      icon: <Star size={22} className="text-purple-600" />,
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
    "Nourish your body, fuel your mind, conquer your day.",
    "Good food is the foundation of genuine happiness.",
    "Eating well is a form of self-respect.",
    "Your diet is a bank account. Good food choices are good investments.",
    "Food is not just energy, it's an experience. Enjoy every bite.",
  ];

  // Select a random quote
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Toggle dropdown based on device
  const toggleDropdown = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      // On desktop, open on click, close only when clicking elsewhere or selecting
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
      if (!event.target.closest('.mess-selector-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isMobile]);

  return (
    <Layout>
    <div className="bg-white space-y-4 px-3 py-3 md:space-y-8 md:px-0 md:py-6">
      {/* Header Section */}
      <div className="text-center">
        <h1 className={`text-2xl font-bold bg-clip-text text-transparent font-serif md:text-4xl ${getHeaderGradient(selectedMess)}`}>
          Campus Dining
        </h1>
        <p className="text-sm text-gray-700 italic font-light mt-1 md:text-lg md:mt-3">
          "{randomQuote}"
        </p>
        <div className="flex items-center justify-center mt-2 text-gray-600 md:mt-3">
          <Calendar size={14} className="mr-1 md:size-4 md:mr-2" />
          <p className="text-xs md:text-sm">{currentDate}</p>
        </div>
      </div>

      {/* Mess Type Selector */}
      <div className="flex items-center justify-center mess-selector-container">
        <div className="relative">
          {/* Clickable area for dropdown */}
          <div
            className="flex items-center p-2 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm md:p-3"
            onClick={toggleDropdown}
            onMouseEnter={() => !isMobile && setIsOpen(true)}
          >
            <div className="flex items-center">
              {selectedMessDetails.icon}
              <ChevronDown 
                size={16} 
                className={`ml-2 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'} md:size-4`}
              />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className={`absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px] ${
              isMobile ? 'w-full' : ''
            }`}>
              {messTypes.map((mess) => (
                <div
                  key={mess.id}
                  className={`flex items-center p-2 hover:bg-gray-50 cursor-pointer transition-colors md:p-3 ${
                    selectedMess === mess.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleMessSelect(mess.id)}
                >
                  <div className="mr-2 md:mr-3">{mess.icon}</div>
                  <span className="text-sm text-gray-800 md:text-base">{mess.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu title with colored text */}
        <h2
          className={`ml-2 text-lg font-semibold font-serif md:text-2xl md:ml-3 ${getColorClass(
            selectedMess
          )}`}
        >
          {selectedMessDetails.name} Menu
        </h2>
      </div>

      {selectedMess && (
        <div className="mt-4 max-w-6xl mx-auto md:mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-6">
            <div className="mt-1 md:mt-0">
              <DaySelector
                days={days}
                selectedDay={selectedDay}
                onSelect={setSelectedDay}
                hideLabel={true}
                messType={selectedMess}
              />
            </div>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {Object.entries(currentTimings).map(([mealTime, timing]) => (
              <MealTimeCard
                key={mealTime}
                mealTime={mealTime}
                timing={timing}
                isSelected={selectedMealTime === mealTime}
                onSelect={setSelectedMealTime}
                items={getMenuItems(selectedMess, selectedDay, mealTime)}
                color={currentMessColor}
                messType={selectedMess}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default Home;