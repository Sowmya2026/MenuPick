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
          "Onion Upma, Sambar, Coconut Chutney, Medu Vada",
          "Aloo paratha, Tomato onion gravy",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Chapati, Mushroom Gravy",
          "Coriander Rice/ Vangi Bath, Bhindi Fry",
          "White Rice, Drumstick Sambar, Curd",
          "Paruppu podi, Ghee, Beetroot Thovayal, Pickle, Appad",
          "Fruit Banana",
          "Lemon Mint Juice",
        ],
        snacks: ["Veg Noodles/Red Patha + Sauce", "Tea, Coffee, Milk"],
        dinner: [
          "Chapati, Bhature, Black Channa Masala",
          "Vegetable Semiya, Chutney",
          "White Rice, Rasam, Butter Milk, Dry Vazhakkai Fry",
          "Salad (Carrot, Cucumber)",
          "Mosambi",
        ],
      },
      Tuesday: {
        breakfast: [
          "Idlyupma, Coconut Milk, Vada Curry",
          "Veg Khichadi, Paruppu vada, Chutney",
          "Tea, Milk, Coffee",
          "Wheat Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Paneer Butter Masala",
          "Plain kuzhambu with fried Onions",
          "White Rice, Green Dhal, Cabbage Poriyal, Rasam, Curd",
          "Paruppu podi, Gingely oil, Paruppu Thovayal, Pickle, Brinjal Podi Fryums",
          "Fruit Watermelon",
          "Lemon Juice",
        ],
        snacks: ["Burger/Sandwich", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Rajma Masala",
          "Veg Biryani, Raita, Gobi 65",
          "White Rice, Rasam, Butter Milk",
          "Salad (Carrot, Beetroot, Cucumber)",
          "Ice Cream",
        ],
      },
      Wednesday: {
        breakfast: [
          "Idly, Groundnut Chutney, Sambar",
          "Pav Bhaji, Masala, Chopped Onion",
          "Besan Chilla",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Veg Kadai Masala",
          "Kashmiri Pulav",
          "White Rice, Dhal, Beetroot Poriyal, Rasam, Curd",
          "Paruppu podi, Curd, Thovayal, Pickle",
          "Fruit Jack Fruit",
          "Jal Jeera",
        ],
        snacks: ["Boiled Sweet Corn (Salt + Masala)", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Chapathi, Veg curry",
          "Chana Sambar, Tomato Thovaiyal",
          "White Rice, Dhal, Rasam, French Fries, Butter Milk",
          "Salad, Fruit Custard",
        ],
      },
      Thursday: {
        breakfast: [
          "Mini Dosa, Sambar, Chutney",
          "Vada",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Veg Fried Rice, Gobi Manchurian",
          "White Rice, Raddish Sambar, Rasam, Curd",
          "Paruppu podi, Ghee, Thovaiyal, Pickle, Bat Fryums",
          "Fruit Salad",
          "Lemon Juice",
        ],
        snacks: ["Vada Pav / Papdi Chat", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, Tomato Gravy",
          "Chilly Podi Idly, Chutney, Sambar",
          "White Rice, Mor kuzhambu, Rasam, Beans Poriyal, Butter Milk, Bread",
          "Salad, Milk",
        ],
      },
      Friday: {
        breakfast: [
          "Poori, Aloo Sabji",
          "Dosa, Sambhar, Kara Chutney",
          "Tea, Milk, Coffee",
          "Wheat Bread, Butter, Jam",
        ],
        lunch: [
          "Phulka, Jeera Dhal, Palak Paneer",
          "Bisibelbath, Potato Chips",
          "White Rice, Bhindi puli kolambu, Carrot Poriyal, Rasam, Curd",
          "Paruppu podi, Ghee, Kothu Thovayal, Pickle",
          "Fruit Lemon Juice",
          "Fruit Papaya",
        ],
        snacks: [
          "Veg Samosa, Green chutney / Banana Bajji Coconut Chutney",
          "Tea, Coffee, Milk",
        ],
        dinner: [
          "Paratha (Veg Salna)",
          "Idly Veg Kurma, Chutney",
          "White Rice, Rasam, Butter Milk, Yam Poriyal",
          "Gulab Jamun, Milk, Salad",
        ],
      },
      Saturday: {
        breakfast: [
          "Red Rice Puttu, Kadala Curry, Grated coconut, Banana, Sugar +Ghee",
          "Paneer paratha, Curd, Pickle",
          "Fruit Salt+Pepper",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Ajwain Chapatti, Mixed Veg Kadai Gravy",
          "Veg Pepper Rice, Veg Ball Manchurian",
          "White Rice, Moochai Karakolambu, Keerai poriyal, Rasam, Curd",
          "Lemon Mint Juice",
          "Salad (Carrot, Cucumber)",
        ],
        snacks: ["Pani Puri", "Tea, Coffee, Milk"],
        dinner: [
          "Chapatti, Navarathna Kurma",
          "Masala Dosa, Sambar, Kara chutney",
          "White Rice, Black Dhal Rasam, Kovakkai Poriyal, Butter Milk",
          "Milk, Salad (Carrot, Beetroot, Cucumber)",
        ],
      },
      Sunday: {
        breakfast: [
          "Pongal, Vada, Sambar, White Chutney",
          "Veg Poha, Onion Chutney",
          "Tea, Milk, Coffee",
          "Bread, Butter, Jam",
        ],
        lunch: [
          "Onion Paratha, Brinjal Curry, Chutney",
          "Chapatti, Dhal Tadka",
          "White Rice, Rasam, Fruit Curd Rice, Pickle",
          "Pineapple Kesari, Lemon Juice (salt and pepper)",
        ],
        snacks: ["Bread Pakora", "Tea, Coffee, Milk"],
        dinner: [
          "Phulka, White Peas Gravy",
          "Panneer Sabda",
          "White Rice, Tomato Rasam, Poriyal, Butter Milk",
          "Milk, Salad, Pappad",
          "Fruit Pineapple",
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
          "Onion Upma, Sambar, Coconut Chutney, Medu Vada",
          "Aloo paratha, Tomato onion gravy",
          "Masala Omelette",
          "Fresh Orange Juice, Apple Juice",
          "Boiled Eggs",
          "Tea, Milk, Coffee, Cappuccino",
          "Bread, Butter, Jam, Honey",
        ],
        lunch: [
          "Chapati, Mushroom Gravy, Paneer Butter Masala",
          "Coriander Rice/ Vangi Bath, Bhindi Fry",
          "White Rice, Drumstick Sambar, Curd, Buttermilk",
          "Chicken Curry, Fish Fry",
          "Paruppu podi, Ghee, Beetroot Thovayal, Pickle, Appad",
          "Fruit Banana, Apple, Orange",
          "Lemon Mint Juice, Sweet Lassi",
        ],
        snacks: [
          "Veg Noodles/Red Patha + Sauce",
          "Chicken Spring Rolls",
          "Tea, Coffee, Milk, Green Tea",
        ],
        dinner: [
          "Chapati, Bhature, Black Channa Masala, Chicken Masala",
          "Vegetable Semiya, Chutney",
          "White Rice, Rasam, Butter Milk, Dry Vazhakkai Fry",
          "Fish Curry, Prawn Fry",
          "Salad (Carrot, Cucumber, Beetroot)",
          "Mosambi, Pomegranate Juice",
          "Ice Cream, Gulab Jamun",
        ],
      },
      Tuesday: {
        breakfast: [
          "Idlyupma, Coconut Milk, Vada Curry",
          "Veg Khichadi, Paruppu vada, Chutney",
          "Egg Benedict, Scrambled Eggs",
          "Fresh Pineapple Juice, Watermelon Juice",
          "Boiled Egg",
          "Tea, Milk, Coffee, Latte",
          "Wheat Bread, Butter, Jam, Nutella",
        ],
        lunch: [
          "Phulka, Paneer Butter Masala, Chicken Butter Masala",
          "Plain kuzhambu with fried Onions",
          "White Rice, Green Dhal, Cabbage Poriyal, Rasam, Curd",
          "Mutton Curry, Fish Amritsari",
          "Paruppu podi, Gingely oil, Paruppu Thovayal, Pickle, Brinjal Podi Fryums",
          "Fruit Watermelon, Papaya, Kiwi",
          "Lemon Juice, Mango Lassi",
        ],
        snacks: [
          "Burger/Sandwich (Veg & Chicken)",
          "French Fries",
          "Tea, Coffee, Milk, Herbal Tea",
        ],
        dinner: [
          "Phulka, Rajma Masala, Chicken Tikka Masala",
          "Veg Biryani, Chicken Biryani, Raita, Gobi 65",
          "White Rice, Rasam, Butter Milk",
          "Crab Masala, Egg Curry",
          "Salad (Carrot, Beetroot, Cucumber, Olives)",
          "Ice Cream, Brownie",
          "Fresh Fruit Platter",
        ],
      },
      Wednesday: {
        breakfast: [
          "Idly, Groundnut Chutney, Sambar",
          "Pav Bhaji, Masala, Chopped Onion",
          "Eggs Florentine, Omelette Station",
          "Fresh Mosambi Juice, Grape Juice",
          "Besan Chilla",
          "Tea, Milk, Coffee, Espresso",
          "Bread, Butter, Jam, Croissants",
        ],
        lunch: [
          "Phulka, Chicken Kadai Masala, Paneer Kadai",
          "Kashmiri Pulav, Veg Pulav",
          "White Rice, Dhal, Beetroot Poriyal, Rasam, Curd",
          "Butter Chicken, Fish Curry",
          "Paruppu podi, Curd, Thovayal, Pickle",
          "Fruit Jack Fruit, Dragon Fruit, Berries",
          "Jal Jeera, Sweet Lime Juice",
        ],
        snacks: [
          "Boiled Sweet Corn (Salt + Masala)",
          "Chicken Tikka",
          "Tea, Coffee, Milk, Black Tea",
        ],
        dinner: [
          "Phulka, Chapathi, Veg curry, Chicken Curry",
          "Chana Sambar, Tomato Thovaiyal",
          "White Rice, Dhal, Rasam, French Fries, Butter Milk",
          "Prawn Biryani, Mutton Korma",
          "Salad, Fruit Custard, Jelly",
          "Fresh Juice Bar",
          "Pastries, Cookies",
        ],
      },
      Thursday: {
        breakfast: [
          "Mini Dosa, Sambar, Chutney",
          "Vada",
          "Eggs Benedict, Poached Eggs",
          "Fresh Pomegranate Juice, Apple Juice",
          "Boiled Eggs",
          "Tea, Milk, Coffee, Americano",
          "Bread, Butter, Jam, Pancakes",
        ],
        lunch: [
          "Veg Fried Rice, Gobi Manchurian, Chicken Fried Rice",
          "White Rice, Raddish Sambar, Rasam, Curd",
          "Butter Naan, Paneer Makhani",
          "Chicken Manchurian, Fish Fry",
          "Paruppu podi, Ghee, Thovaiyal, Pickle, Bat Fryums",
          "Fruit Salad, Fruit Platter",
          "Lemon Juice, Banana Shake",
        ],
        snacks: [
          "Vada Pav / Papdi Chat",
          "Chicken Wings",
          "Tea, Coffee, Milk, Lemon Tea",
        ],
        dinner: [
          "Phulka, Tomato Egg Gravy, Paneer Gravy",
          "Chilly Podi Idly, Chutney, Sambar",
          "White Rice, Mor kuzhambu, Rasam, Beans Poriyal, Butter Milk, Bread",
          "Mutton Biryani, Egg Roast",
          "Salad, Milk, Badam Milk",
          "Fresh Fruit Juice",
          "Cakes, Donuts",
        ],
      },
      Friday: {
        breakfast: [
          "Poori, Aloo Sabji",
          "Dosa, Sambhar, Kara Chutney",
          "Omelette Station with Cheese and Veggies",
          "Fresh Orange Juice, Pineapple Juice",
          "Egg Bhurji",
          "Tea, Milk, Coffee, Cappuccino",
          "Wheat Bread, Butter, Jam, Waffles",
        ],
        lunch: [
          "Phulka, Jeera Dhal, Palak Paneer",
          "Bisibelbath, Potato Chips",
          "White Rice, Bhindi puli kolambu, Carrot Poriyal, Rasam, Curd",
          "Chicken 65, Fish Curry",
          "Paruppu podi, Ghee, Kothu Thovayal, Pickle",
          "Fruit Lemon Juice, Mixed Fruit Juice",
          "Fruit Papaya, Melon",
        ],
        snacks: [
          "Veg Samosa, Green chutney / Banana Bajji Coconut Chutney",
          "Chicken Lollipop",
          "Tea, Coffee, Milk, Green Tea",
        ],
        dinner: [
          "Paratha (Chicken Salna with pieces/ Afgani Chicken Gravy)",
          "Idly Veg Kurma, Chutney",
          "White Rice, Rasam, Butter Milk, Yam Poriyal",
          "Prawn Curry, Mutton Rogan Josh",
          "Gulab Jamun, Milk, Salad",
          "Fresh Juice Bar",
          "Ice Cream Sundaes",
        ],
      },
      Saturday: {
        breakfast: [
          "Red Rice Puttu, Kadala Curry, Grated coconut, Banana, Sugar +Ghee",
          "Paneer paratha, Curd, Pickle",
          "Egg Station: Omelettes, Boiled, Poached",
          "Fresh Sweet Lime Juice, Watermelon Juice",
          "Fruit Salt+Pepper",
          "Tea, Milk, Coffee, Latte",
          "Bread, Butter, Jam, French Toast",
        ],
        lunch: [
          "Ajwain Chapatti, Mixed Veg Kadai Gravy",
          "Egg Pepper Rice, Chicken Pepper Rice, Veg Ball Manchurian",
          "White Rice, Moochai Karakolambu, Keerai poriyal, Rasam, Curd",
          "Butter Chicken, Fish Amritsari",
          "Lemon Mint Juice, Mango Lassi",
          "Salad (Carrot, Cucumber, Radish)",
        ],
        snacks: ["Pani Puri", "Chicken Tikka", "Tea, Coffee, Milk, Herbal Tea"],
        dinner: [
          "Chapatti, Navarathna Kurma",
          "Masala Dosa, Sambar, Kara chutney",
          "White Rice, Black Dhal Rasam, Kovakkai Poriyal, Butter Milk",
          "Crab Masala, Egg Curry",
          "Milk, Salad (Carrot, Beetroot, Cucumber)",
          "Fresh Fruit Platter",
          "Pastries, Cookies",
        ],
      },
      Sunday: {
        breakfast: [
          "Pongal, Vada, Sambar, White Chutney",
          "Veg Poha, Onion Chutney",
          "Eggs Benedict, Scrambled Eggs",
          "Fresh Mosambi Juice, Apple Juice",
          "Tea, Milk, Coffee, Espresso",
          "Bread, Butter, Jam, Pancakes with Maple Syrup",
        ],
        lunch: [
          "Chicken, Onion Paratha, Brinjal Curry, Chutney",
          "Chapatti, Dhal Tadka",
          "White Rice, Rasam, Fruit Curd Rice, Pickle",
          "Special Chicken Biryani, Mutton Korma",
          "Pineapple Kesari, Lemon Juice (salt and pepper)",
          "Fresh Fruit Salad",
        ],
        snacks: [
          "Bread Pakora",
          "Chicken Spring Rolls",
          "Tea, Coffee, Milk, Green Tea",
        ],
        dinner: [
          "Phulka, White Peas Gravy",
          "Panneer Sabda",
          "White Rice, Tomato Rasam, Poriyal, Butter Milk",
          "Fish Curry, Prawn Fry",
          "Milk, Salad, Pappad",
          "Fruit Pineapple, Fruit Cocktail",
          "Ice Cream Bar with Toppings",
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
      dinner: "7:00 PM - 9:00 PM"
    },
    weekend: {
      breakfast: "7:30 AM - 9:30 AM",
      lunch: "12:30 PM - 2:30 PM",
      snacks: "5:00 PM - 6:00 PM", 
      dinner: "7:30 PM - 9:30 PM"
    }
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
    timingsConfig: timings
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