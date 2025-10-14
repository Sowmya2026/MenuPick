import { createContext, useContext, useState } from "react";

// Create context
const MenuContext = createContext();

// Static menu data for different mess types
const messMenus = {
  veg: {
    color: "green",
    days: {
      Monday: {
        breakfast: [
          "Pongal, Medhu Vada, Coconut Chutney",
          "Veg Kichadi, Sambar, Kesari",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Rice, Rajma Curry",
          "White Rice, Mor Kuzhambu, Rasam, Fry, Papad",
          "Butter Milk",
        ],
        snacks: [
          "Boiled Sweet Corn, Masala, Lemon (boiled channa with little masala)",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Chapathi, Veg Kadai Gravy",
          "Fried Idly, Radish Sambar, Mint Chutney",
          "White Rice, Rasam, Vendakkai Poriyal",
          "Curd Rice, Beetroot",
          "Butter Milk",
        ],
      },
      Tuesday: {
        breakfast: [
          "Thin Dosa, Sambar, Onion Chutney, Porridge Vada",
          "Aloo Paratha, Curd, Pickle",
          "Tea, Milk, Coffee",
          "Brown Bread, Butter, Jam",
        ],
        lunch: [
          "Rice / Lemon Rice / Tomato Rice, Carrot Beans Poriyal",
          "Potato Podimas, Rasam, Curd, Papad",
          "Lemon Juice",
        ],
        snacks: ["Pani Puri / Dahi Puri", "Tea, Coffee, Milk"],
        dinner: [
          "Pulka, Paneer Tikka Masala",
          "Veg Semiya Upma, Coconut Chutney",
          "White Rice, Sambar, Podalangai Poriyal",
          "Gulab Jamun, Salad, Milk",
        ],
      },
      Wednesday: {
        breakfast: [
          "Idiyappam, Coconut Milk, Veg Kurma",
          "Kitchadi, Sambar, Chutney",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Rice, Lemon Mint Rice",
          "Sambar, Chayote, Beans, Butter Milk",
          "Pickle",
        ],
        snacks: ["Red Sauce Pasta / Veg Noodles", "Tea, Coffee, Milk"],
        dinner: [
          "Chole Bature, White Channa Masala",
          "Upma Kozhukattai, Peerkangai Chutney",
          "White Rice, Carrot Poriyal, Brinjal Rasam",
          "Banana, Milk",
        ],
      },
      Thursday: {
        breakfast: [
          "Wheat Dosa, Tomato Chutney, Kara Chutney, Medhu Vada",
          "Paneer Paratha, Curd, Pickle",
          "Tea, Milk, Coffee",
          "Brown Bread, Butter, Jam",
        ],
        lunch: [
          "White Rice, Curry / Mitter Gravy",
          "Cabbage Poriyal, Chips",
          "Rasam, Curd, Pickle, Papad",
          "Lemon Juice",
        ],
        snacks: ["Veg Curry / Veg Samosa, Green Chutney", "Tea, Coffee, Milk"],
        dinner: [
          "Chapathi, Kofta Curry / Paruppu Kolambu",
          "Veg Biryani / Brinjal Curry, Raitha",
          "White Rice, Sambar, Tomato Rasam",
          "Gulab Jamun, Salad (Onion, Cucumber, Carrot), Milk",
        ],
      },
      Friday: {
        breakfast: [
          "Idly, Sambar, Radish Chutney, Mysore Bonda",
          "Poori Aloo Masala / Channa Masala",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Pumpkin Sambar / Brinjal Sambar",
          "Vegetable Kurma, Beans Poriyal",
          "Rasam, Curd, Pickle, Papad",
        ],
        snacks: ["Papadi Chat / Masala Poori", "Tea, Coffee, Milk"],
        dinner: [
          "Wheat Parotta, MT Sambar, Cauliflower Kurma",
          "White Rice, Dal, Cabbage Poriyal",
          "Curd Rice, Tomato Rasam, Salad, Butter Milk",
        ],
      },
      Saturday: {
        breakfast: [
          "White Rice Puttu / Red Rice Puttu, Grated Coconut, Ghee, Banana",
          "Rava Bhaji, Masala, Onion Sambar",
          "Tea, Milk, Coffee",
          "Brown Bread, Butter, Jam",
        ],
        lunch: [
          "Rice, Aloo Gravy / Dhal Makhani",
          "Sambar, Carrot Beans Poriyal",
          "White Rice, Rasam, Pumpkin Poriyal",
          "Curd, Pickle, Papad",
        ],
        snacks: [
          "Pacha Pattani with Masala / Banana Bajji, Chutney",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Masala Dosa, Sambar, Chutney",
          "Chapathi, Veg Palak Gravy / Navaratna Kurma",
          "White Rice, Rasam, Dry Yam Poriyal",
          "Fruit Custard, Milk",
        ],
      },
      Sunday: {
        breakfast: [
          "Vegetable Ragi Semiya, Coconut Chutney",
          "Veg Paratha / Matar Paratha, Curd, Pickle",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Veg Biryani, Paneer Biryani, Gobi 65, Onion Raitha, Pickle",
          "White Rice, Rasam, Fry",
          "Payasam, Lemon Juice",
        ],
        snacks: [
          "Thatthuvadai Set / Pungulu with Chutney",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Kulcha, Veg Makhaniwala / Aloo Capsicum Gravy",
          "Mini Idly, Tomato Mix Veg Kurma",
          "White Rice, Rasam, Curd",
          "Salad (Tomato + Cucumber + Carrot + Lemon), Milk",
        ],
      },
    },
  },

  "non-veg": {
    color: "red",
    days: {
      Monday: {
        breakfast: [
          "Idiyappam, Vadacurry, Coconut Milk",
          "Aloo Paratha, Curd, Pickle",
          "Egg Bhurji",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Rajma Curry",
          "Veg Rice, Mor Kuzhambu, Rasam, Beetroot Fry, Curd",
          "White Rice, Tamarind Rice, Rasam, Beetroot Fry, Curd",
          "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad",
          "Fruit, Lemon Mint Juice",
        ],
        snacks: ["Panipuri / Dahipuri", "Tea, Coffee, Milk"],
        dinner: [
          "Roti, Tomato Egg Gravy",
          "Dosa, Sambar, Mint Chutney",
          "White Rice, Rasam, Dry Kovakkai Poriyal, Butter Milk",
          "Salad (Carrot, Cucumber, Tomato)",
          "Fruit - Papaya, Milk",
        ],
      },
      Tuesday: {
        breakfast: [
          "Idly, Vada, Sambar, Chutney",
          "Vegetable Masala Poha",
          "Boiled Egg",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chapathi, Paneer Butter Masala / Chicken Gravy",
          "Egg Fried Rice, Dhal Rasam, Beetroot Fry, Curd",
          "White Rice, Lemon Rice, Rasam, Beetroot Fry, Curd",
          "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad",
          "Fruit, Fruit Custard",
        ],
        snacks: ["Mysore Bonda / Sambar Vada", "Tea, Coffee, Milk"],
        dinner: [
          "Chole Bhature, Channa Masala, Mirchi Ratha",
          "Lemon Sevai / Tomato Sevai, Potukadalai Chutney",
          "White Rice, Rasam, Beans Fry, Butter Milk",
          "Milk, Salad (Carrot, Beetroot, Cucumber)",
        ],
      },
      Wednesday: {
        breakfast: [
          "Millet Upma / Wheat Upma, Coconut Chutney, Paruppu Vada",
          "Gobi Paratha, Curd, Pickle",
          "Omelette",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Veg Kurma / Chicken Gravy",
          "White Rice, Dhal, Rasam, Tomato, Beans Poriyal, Curd",
          "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad",
          "Fruit, Banana",
        ],
        snacks: ["Burger / Cutlet", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Mushroom Masala",
          "Podi Dosa, Sambar, Groundnut Chutney",
          "White Rice, Beetroot Rasam, Dry Vazhaikkai Poriyal, Butter Milk",
          "Milk, Salad, Ice Cream",
        ],
      },
      Thursday: {
        breakfast: [
          "Thin Onion Dosa, Sambar, Chutney, Medu Vada",
          "Poori, Channa Masala / Aloo Masala",
          "Scrambled Egg",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chapathi, Paneer Butter Masala / Paneer Tikka",
          "Lemon Rice / Coconut Rice, Sambar, Rasam, Carrot Beans Poriyal, Curd",
          "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad",
          "Fruit - Pineapple, Lemon Mint Juice",
        ],
        snacks: ["Bread Pakoda / Samosa, Green Chutney", "Tea, Coffee, Milk"],
        dinner: [
          "Brinji / Veg Biryani, Veg Raita, French Fries",
          "Chapathi, Egg Gravy",
          "White Rice, Rasam, Mix Veg Poriyal, Butter Milk",
          "Fruit Salad, Milk, Gulab Jamun",
        ],
      },
      Friday: {
        breakfast: [
          "Carrot Uttappam, Sambar, Onion Tomato Chutney",
          "Veg Khichdi / Sabudana Khichdi with Carrot & Beans, Curd",
          "French Toast",
          "Tea, Milk, Coffee",
          "Wheat Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Paneer Masala / Chicken Gravy",
          "Coriander Rice / Mint Rice, Rasam, Potato Fry, Curd",
          "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad",
          "Fruit, Lemon Mint Juice",
        ],
        snacks: ["Boiled Sweet Corn with Masala", "Tea, Coffee, Milk"],
        dinner: [
          "Wheat Paratha (Chettinad Chicken Gravy / Butter Chicken)",
          "Millet Idly, Chilli Idly, Sambar, Tomato Chutney",
          "White Rice, Rasam, Butter Milk",
          "Milk, Salad",
        ],
      },
      Saturday: {
        breakfast: [
          "Gobi Paratha / Paneer Paratha, Curd, Pickle",
          "Pongal, Coconut Chutney, Sambar, Vada",
          "Boiled Egg",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chapathi, Veg Kurma / Chicken Curry",
          "Curry Leaf Rice, Sambar, Beans Poriyal, Rasam, Curd",
          "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad",
          "Fruit, Lemon Juice",
        ],
        snacks: ["Masala Puri / Veg Noodles", "Tea, Coffee, Milk"],
        dinner: [
          "Chapathi, Methi Paneer Gravy",
          "Masala Dosa, Sambar, Chutney",
          "White Rice, Rasam, Cabbage Poriyal, Butter Milk",
          "Salad (Carrot, Beetroot, Cucumber), Milk",
        ],
      },
      Sunday: {
        breakfast: [
          "White Puttu / Ragi Puttu, Kadala Curry, Grated Coconut, Banana, Sugar, Ghee",
          "Pav Bhaji, Masala, Chopped Onions",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chicken Gravy, Veg Pulav, Raita, French Fries",
          "Phulka, Matter Curry, Curd Rice, Pickle",
          "White Rice, Rasam, Butter Milk",
          "Fruit - Apple",
        ],
        snacks: ["Red Pasta / Dahi Puri", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Veg Sabji / Dal Makhani",
          "Onion Podi Uttappam, Sambar, Kara Chutney",
          "White Rice, Sambar, Tomato Rasam, Carrot Poriyal",
          "Butter Milk, Salad, Milk",
        ],
      },
    },
  },
  special: {
    color: "violet",
    days: {
      Monday: {
        breakfast: [
          "Thinai Pongal, Sambar, Coconut Chutney",
          "Mysore Bonda",
          "Kanda Batata Poha",
          "Boiled Egg (Salt & Pepper - Keep Separately)",
          "Bread, Butter, Jam",
          "Chocos, Cold Milk, Green Gram Sprouts with onion, cucumber, and lemon",
          "Pomegranate Juice",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Chapatti, Soya Gravy",
          "White Rice, Drumstick Sambar, Vazhaikkai Tava Fry",
          "Paruppu Podi, Ghee, Lemon Thovaiyal, Pickle, Rice",
          "Curd",
          "Fruit - Pineapple",
          "Lemon Juice",
        ],
        snacks: ["Bread Chilli / Samosa Masala", "Tea, Coffee, Milk"],
        dinner: [
          "Naan / Poori with Two Gravies - Butter Chicken Masala / Fish Kuzhambu and Fish Fry",
          "Idly, Sambar, Coconut Chutney",
          "White Rice, Rasam, Beetroot Poriyal, Butter Milk",
          "Vazhaithandu Kootu",
          "Gulab Jamun, Milk",
          "Salad (Carrot, Onion, Cucumber)",
        ],
      },

      Tuesday: {
        breakfast: [
          "Plain Paratha, Tomato Onion Gravy, Curd",
          "Ragi Dosa, Peanut Chutney, Paneer Bhurji, Podi, Oil, Medhu Vada",
          "Veggie Omelette",
          "Bread, Butter, Jam",
          "Cornflakes, Cold Milk",
          "Boiled Black Channa (Onion, Cucumber, Tomato and Lemon)",
          "Orange Juice",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Pulka, Cauliflower Kurma / Aloo Peas Gravy",
          "White Rice, Drumstick Sambar, Keerai Poriyal, Curd",
          "Paruppu Podi, Gingerly Oil, Lemon Thovaiyal, Pickle, Papad",
          "Lemon Mint Juice",
        ],
        snacks: ["Sev Puri / Churumuri", "Tea, Coffee, Milk"],
        dinner: [
          "Egg Dosa (Only for Egg & Plain Dosa)",
          "Chilli Chapatti, Mint Sambar, Pepper Baby Corn Dry Fry",
          "White Rice, Dhal, Rasam, Butter Milk",
          "Spicy Mushroom Soup, Ice Cream",
          "Salad (Carrot, Cucumber, Beetroot, Onion)",
          "Milk",
          "Fruit - Grapes",
        ],
      },

      Wednesday: {
        breakfast: [
          "Mixed Millet Idly, Sambar, Kara Chutney",
          "Sabudana Vada",
          "Methi Thepla / Gobi Paratha, Pickle and Curd",
          "French Toast",
          "Bread, Butter, Jam",
          "Chocos, Cold Milk, Boiled Groundnut, Onion and Lemon",
          "Carrot Juice",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Chapatti, Paneer Lababdar",
          "White Rice, Dhal, Drumstick Sambar, Cluster Beans Poriyal, Curd",
          "Paruppu Podi, Curry Leaves Thovaiyal, Pickle, Bat Fryums",
          "Fruit - Banana",
        ],
        snacks: [
          "Sweet Corn with Chat Masala and Lemon / Channa with Tadka",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Chole Puri, Kumbakonam Kadappa",
          "Mysore Masala Dosa, Sambar, Coconut Chutney",
          "White Rice, Dhal, Rasam, Aviyal with Less Potato and Curd",
          "Butter Milk",
          "Sweet Corn Soup",
          "Rasmallai / Badam Milk",
          "Salad (Carrot, Beetroot, Cucumber)",
        ],
      },

      Thursday: {
        breakfast: [
          "Pav Bhaji, Masala, Chopped Onion",
          "Neer Dosa, Mixed Veg Kurma, Tomato Chutney",
          "Medhu Vada, Podi, Oil",
          "Masala Omelette",
          "Bread, Butter, Jam",
          "Chocos, Cold Milk, Boiled Jowar (Onion, Cucumber, Tomato and Lemon)",
          "Muskmelon Juice",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Chapatti, Baby Corn Butter Masala",
          "White Rice, Drumstick Sambar, Vendakkai Poriyal, Curd",
          "Paruppu Podi, Gingerly Oil, Mint Thovaiyal, Pickle, Bat Fryums",
          "Fruit - Watermelon",
        ],
        snacks: ["Paneer Sandwich, Sauce, Green Chutney", "Tea, Coffee, Milk"],
        dinner: [
          "Pulka, Mushroom Kurma, Egg Curry",
          "Ghee Rice, Roasted Veggies",
          "White Rice, Dhal Rasam, Butter Milk",
          "Clear Soup, Salad (Onion, Cucumber, Carrot)",
          "Soft Mysore Pak / Coconut Burfi",
          "Milk",
        ],
      },

      Friday: {
        breakfast: [
          "Veg Kichadi, Curd, Vada",
          "Idiyappam, Coconut Milk, Vadacurry",
          "Spinach Omelette",
          "Bread, Butter, Jam",
          "Chocos, Cold Milk, Boiled Horse Gram (Onion and Lemon)",
          "Mosambi Juice",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Roti, Dhal Matar Paneer",
          "White Rice, Beetroot Thovaiyal, Pickle, Lemon Rasam, Curd",
          "Fruit - Grapes",
        ],
        snacks: ["Khakra Sandwich / Papri Chat", "Tea, Coffee, Milk"],
        dinner: [
          "Wheat Paratha, Chettinad Chicken Gravy / Afghani Chicken Gravy",
          "Ragi Semiya, Coconut Chutney",
          "White Rice, Rasam, Paruppu Poriyal, Butter Milk",
          "Veg Creamy Soup, Salad (Carrot, Cucumber)",
          "Rose Milk / Badam Milk",
        ],
      },

      Saturday: {
        breakfast: [
          "Spicy Garlic Dosa / Pesarattu Dosa, Sambar, Coconut Chutney, Medhu Vada",
          "Aloo Masala",
          "Tea, Milk, Coffee",
        ],
        lunch: [
          "Ajwain Chapatti, Bottle Gourd Kootu, Paruppu Podi, Beetroot Poriyal, Curd",
          "Fruit - Apple",
        ],
        snacks: [
          "Veg Kathi Roll / Puli Sundal with Coconut and Jaggery",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Tandoori Roti, Hariyali Paneer",
          "Samba Rava Upma, Chutney",
          "White Rice, Cabbage Paruppu Kootu, Rasam",
          "Salad (Carrot, Cucumber)",
          "Jelabi / Carrot Halwa",
        ],
      },

      Sunday: {
        breakfast: [
          "White Puttu / Ragi Puttu, Kadala Curry, Grated Coconut, Banana, Sugar, Ghee",
          "Pav Bhaji, Masala, Chopped Onions",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chicken Gravy, Veg Pulav, Raita, French Fries",
          "Phulka, Matter Curry, Curd Rice, Pickle",
          "White Rice, Rasam, Butter Milk",
          "Fruit - Apple",
        ],
        snacks: ["Red Pasta / Dahi Puri", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Veg Sabji / Dal Makhani",
          "Onion Podi Uttappam, Sambar, Kara Chutney",
          "White Rice, Sambar, Tomato Rasam, Carrot Poriyal",
          "Butter Milk, Salad, Milk",
        ],
      },
    },
  },
};

// Menu Provider Component
export const MenuProvider = ({ children }) => {
  const [selectedMess, setSelectedMess] = useState("veg");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMealTime, setSelectedMealTime] = useState(null);

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
    if (
      !messMenus[messType] ||
      !messMenus[messType].days[day] ||
      !messMenus[messType].days[day][mealTime]
    ) {
      return [];
    }
    return messMenus[messType].days[day][mealTime];
  };

  // Get color for a specific mess type
  const getMessColor = (messType) => {
    return messMenus[messType]?.color || "gray";
  };

  // Get timings for a specific day type
  const getTimings = (day) => {
    return isWeekend(day) ? timings.weekend : timings.weekday;
  };

  // Get timing for a specific meal time on a given day - FIXED FUNCTION
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
