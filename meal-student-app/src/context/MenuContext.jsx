import { createContext, useContext, useState, useEffect } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

// Create context
const MenuContext = createContext();

// Static fallback menu data (default)
const fallbackMenus = {
  veg: {
    color: "green",
    days: {
      Monday: {
        breakfast: ["Pongal", "Vada", "Chutney"],
        lunch: ["Rice", "Sambar", "Poriyal"],
        snacks: ["Corn"],
        dinner: ["Chapathi", "Kurma"]
      }
      // Minimal fallback to avoid crashes if DB is empty
    }
  },
  "non-veg": {
    color: "red",
    days: {
      Monday: {
        breakfast: ["Idly", "Chicken Curry"],
        lunch: ["Rice", "Fish Fry"],
        snacks: ["Egg Puff"],
        dinner: ["Parotta", "Chicken Salna"]
      }
    }
  },
  special: {
    color: "violet",
    days: {
      Monday: {
        breakfast: ["Special Dosa"],
        lunch: ["Fried Rice"],
        snacks: ["Burger"],
        dinner: ["Naan", "Paneer"]
      }
    }
  }
};

// Menu Provider Component
export const MenuProvider = ({ children }) => {
  const [menuData, setMenuData] = useState(fallbackMenus);
  const [selectedMess, setSelectedMess] = useState("veg");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMealTime, setSelectedMealTime] = useState(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    // Subscribe to the weekly menu updates
    const unsubscribe = onSnapshot(doc(db, "weeklyMenu", "current"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && (data.veg || data['non-veg'] || data.special)) {
          setMenuData(data);
        }
      } else {
        console.log("No menu data found in Firestore, using fallback.");
      }
    }, (error) => {
      console.error("Error fetching menu data:", error);
    });

    return () => unsubscribe();
  }, [db]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const messTypes = ["veg", "non-veg", "special"];

  // Centralized timing configuration
  const timings = {
    weekday: {
      breakfast: "7:00 AM - 9:00 AM",
      lunch: "12:00 PM - 2:00 PM",
      snacks: "5:00 PM - 6:00 PM",
      dinner: "7:00 PM - 9:00 PM",
    },
    weekend: {
      breakfast: "7:30 AM - 9:30 AM",
      lunch: "12:30 PM - 2:30 PM",
      snacks: "5:00 PM - 6:00 PM",
      dinner: "7:30 PM - 9:30 PM",
    },
  };

  // Check if a day is weekend (Saturday or Sunday)
  const isWeekend = (day) => {
    return day === "Saturday" || day === "Sunday";
  };

  // Get menu items for a specific mess type, day and meal time
  const getMenuItems = (messType, day, mealTime) => {
    // Safety checks for undefined data
    if (
      !menuData[messType] ||
      !menuData[messType].days ||
      !menuData[messType].days[day] ||
      !menuData[messType].days[day][mealTime]
    ) {
      return [];
    }
    return menuData[messType].days[day][mealTime];
  };

  // Get color for a specific mess type
  const getMessColor = (messType) => {
    return menuData[messType]?.color || "gray";
  };

  // Get timings for a specific day type
  const getTimings = (day) => {
    return isWeekend(day) ? timings.weekend : timings.weekday;
  };

  // Get timing for a specific meal time on a given day
  const getMealTiming = (day, mealTime) => {
    const dayTimings = getTimings(day);
    return dayTimings[mealTime] || "Timing not available";
  };

  const value = {
    selectedMess,
    setSelectedMess,
    selectedDay,
    setSelectedDay,
    selectedMealTime,
    setSelectedMealTime,
    days,
    messTypes,
    getMenuItems,
    getMessColor,
    getTimings,
    getMealTiming,
    isWeekend,
    timingsConfig: timings,
    isMenuModalOpen,
    setIsMenuModalOpen,
    menuData, // Expose raw data if needed
  };

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

// Custom hook
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export default MenuContext;
