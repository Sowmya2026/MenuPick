import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, AlertCircle, FileJson, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MenuImport = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [parsedPreview, setParsedPreview] = useState(null);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);

        try {
            if (value.trim()) {
                const parsed = JSON.parse(value);
                setParsedPreview(parsed);
            } else {
                setParsedPreview(null);
            }
        } catch (error) {
            setParsedPreview(null);
        }
    };

    const handleSaveMenu = async () => {
        if (!parsedPreview) {
            toast.error('Invalid JSON format');
            return;
        }

        setLoading(true);
        try {
            // Save directly to a single document 'current' in 'weeklyMenu' collection
            await setDoc(doc(db, 'weeklyMenu', 'current'), parsedPreview);
            toast.success('Menu updated successfully!');
            setJsonInput('');
            setParsedPreview(null);
        } catch (error) {
            console.error('Error saving menu:', error);
            toast.error('Failed to save menu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadExampleTemplate = () => {
        const template = {
            "veg": {
                "days": {
                    "Monday": {
                        "breakfast": ["Pongal, Medhu Vada, Coconut Chutney", "Veg Kichadi, Sambar, Kesari", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Rice, Rajma Curry", "White Rice, Mor Kuzhambu, Rasam, Fry, Papad", "Butter Milk"],
                        "snacks": ["Boiled Sweet Corn, Masala, Lemon", "Tea, Coffee, Milk"],
                        "dinner": ["Chapathi, Veg Kadai Gravy", "Fried Idly, Radish Sambar, Mint Chutney", "White Rice, Rasam, Vendakkai Poriyal", "Curd Rice, Beetroot", "Butter Milk"]
                    },
                    "Tuesday": {
                        "breakfast": ["Thin Dosa, Sambar, Onion Chutney, Porridge Vada", "Aloo Paratha, Curd, Pickle", "Tea, Milk, Coffee", "Brown Bread, Butter, Jam"],
                        "lunch": ["Rice / Lemon Rice / Tomato Rice, Carrot Beans Poriyal", "Potato Podimas, Rasam, Curd, Papad", "Lemon Juice"],
                        "snacks": ["Pani Puri / Dahi Puri", "Tea, Coffee, Milk"],
                        "dinner": ["Pulka, Paneer Tikka Masala", "Veg Semiya Upma, Coconut Chutney", "White Rice, Sambar, Podalangai Poriyal", "Gulab Jamun, Salad, Milk"]
                    },
                    "Wednesday": {
                        "breakfast": ["Idiyappam, Coconut Milk, Veg Kurma", "Kitchadi, Sambar, Chutney", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Rice, Lemon Mint Rice", "Sambar, Chayote, Beans, Butter Milk", "Pickle"],
                        "snacks": ["Red Sauce Pasta / Veg Noodles", "Tea, Coffee, Milk"],
                        "dinner": ["Chole Bature, White Channa Masala", "Upma Kozhukattai, Peerkangai Chutney", "White Rice, Carrot Poriyal, Brinjal Rasam", "Banana, Milk"]
                    },
                    "Thursday": {
                        "breakfast": ["Wheat Dosa, Tomato Chutney, Kara Chutney, Medhu Vada", "Paneer Paratha, Curd, Pickle", "Tea, Milk, Coffee", "Brown Bread, Butter, Jam"],
                        "lunch": ["White Rice, Curry / Mitter Gravy", "Cabbage Poriyal, Chips", "Rasam, Curd, Pickle, Papad", "Lemon Juice"],
                        "snacks": ["Veg Curry / Veg Samosa, Green Chutney", "Tea, Coffee, Milk"],
                        "dinner": ["Chapathi, Kofta Curry / Paruppu Kolambu", "Veg Biryani / Brinjal Curry, Raitha", "White Rice, Sambar, Tomato Rasam", "Gulab Jamun, Salad, Milk"]
                    },
                    "Friday": {
                        "breakfast": ["Idly, Sambar, Radish Chutney, Mysore Bonda", "Poori Aloo Masala / Channa Masala", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Pumpkin Sambar / Brinjal Sambar", "Vegetable Kurma, Beans Poriyal", "Rasam, Curd, Pickle, Papad"],
                        "snacks": ["Papadi Chat / Masala Poori", "Tea, Coffee, Milk"],
                        "dinner": ["Wheat Parotta, MT Sambar, Cauliflower Kurma", "White Rice, Dal, Cabbage Poriyal", "Curd Rice, Tomato Rasam, Salad, Butter Milk"]
                    },
                    "Saturday": {
                        "breakfast": ["White Rice Puttu / Red Rice Puttu, Grated Coconut, Ghee, Banana", "Rava Bhaji, Masala, Onion Sambar", "Tea, Milk, Coffee", "Brown Bread, Butter, Jam"],
                        "lunch": ["Rice, Aloo Gravy / Dhal Makhani", "Sambar, Carrot Beans Poriyal", "White Rice, Rasam, Pumpkin Poriyal", "Curd, Pickle, Papad"],
                        "snacks": ["Pacha Pattani with Masala / Banana Bajji, Chutney", "Tea, Coffee, Milk"],
                        "dinner": ["Masala Dosa, Sambar, Chutney", "Chapathi, Veg Palak Gravy / Navaratna Kurma", "White Rice, Rasam, Dry Yam Poriyal", "Fruit Custard, Milk"]
                    },
                    "Sunday": {
                        "breakfast": ["Vegetable Ragi Semiya, Coconut Chutney", "Veg Paratha / Matar Paratha, Curd, Pickle", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Veg Biryani, Paneer Biryani, Gobi 65, Onion Raitha, Pickle", "White Rice, Rasam, Fry", "Payasam, Lemon Juice"],
                        "snacks": ["Thatthuvadai Set / Pungulu with Chutney", "Tea, Coffee, Milk"],
                        "dinner": ["Kulcha, Veg Makhaniwala / Aloo Capsicum Gravy", "Mini Idly, Tomato Mix Veg Kurma", "White Rice, Rasam, Curd", "Salad (Tomato + Cucumber + Carrot + Lemon), Milk"]
                    }
                }
            },
            "non-veg": {
                "days": {
                    "Monday": {
                        "breakfast": ["Idiyappam, Vadacurry, Coconut Milk", "Aloo Paratha, Curd, Pickle", "Egg Bhurji", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Phulka, Rajma Curry", "Veg Rice, Mor Kuzhambu, Rasam, Beetroot Fry, Curd", "White Rice, Tamarind Rice, Rasam, Beetroot Fry, Curd", "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad", "Fruit, Lemon Mint Juice"],
                        "snacks": ["Panipuri / Dahipuri", "Tea, Coffee, Milk"],
                        "dinner": ["Roti, Tomato Egg Gravy", "Dosa, Sambar, Mint Chutney", "White Rice, Rasam, Dry Kovakkai Poriyal, Butter Milk", "Salad", "Fruit - Papaya, Milk"]
                    },
                    "Tuesday": {
                        "breakfast": ["Idly, Vada, Sambar, Chutney", "Vegetable Masala Poha", "Boiled Egg", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Chapathi, Paneer Butter Masala / Chicken Gravy", "Egg Fried Rice, Dhal Rasam, Beetroot Fry, Curd", "White Rice, Lemon Rice, Rasam, Beetroot Fry, Curd", "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad", "Fruit, Fruit Custard"],
                        "snacks": ["Mysore Bonda / Sambar Vada", "Tea, Coffee, Milk"],
                        "dinner": ["Chole Bhature, Channa Masala, Mirchi Ratha", "Lemon Sevai / Tomato Sevai, Potukadalai Chutney", "White Rice, Rasam, Beans Fry, Butter Milk", "Milk, Salad"]
                    },
                    "Wednesday": {
                        "breakfast": ["Millet Upma / Wheat Upma, Coconut Chutney, Paruppu Vada", "Gobi Paratha, Curd, Pickle", "Omelette", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Phulka, Veg Kurma / Chicken Gravy", "White Rice, Dhal, Rasam, Tomato, Beans Poriyal, Curd", "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad", "Fruit, Banana"],
                        "snacks": ["Burger / Cutlet", "Tea, Coffee, Milk"],
                        "dinner": ["Phulka, Mushroom Masala", "Podi Dosa, Sambar, Groundnut Chutney", "White Rice, Beetroot Rasam, Dry Vazhaikkai Poriyal, Butter Milk", "Milk, Salad, Ice Cream"]
                    },
                    "Thursday": {
                        "breakfast": ["Thin Onion Dosa, Sambar, Chutney, Medu Vada", "Poori, Channa Masala / Aloo Masala", "Scrambled Egg", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Chapathi, Paneer Butter Masala / Paneer Tikka", "Lemon Rice / Coconut Rice, Sambar, Rasam, Carrot Beans Poriyal, Curd", "Paruppu Podi, Gingely Oil, Thovaiyal, Pickle, Papad", "Fruit - Pineapple, Lemon Mint Juice"],
                        "snacks": ["Bread Pakoda / Samosa, Green Chutney", "Tea, Coffee, Milk"],
                        "dinner": ["Brinji / Veg Biryani, Veg Raita, French Fries", "Chapathi, Egg Gravy", "White Rice, Rasam, Mix Veg Poriyal, Butter Milk", "Fruit Salad, Milk, Gulab Jamun"]
                    },
                    "Friday": {
                        "breakfast": ["Carrot Uttappam, Sambar, Onion Tomato Chutney", "Veg Khichdi / Sabudana Khichdi, Curd", "French Toast", "Tea, Milk, Coffee", "Wheat Bread, Butter, Jam"],
                        "lunch": ["Phulka, Paneer Masala / Chicken Gravy", "Coriander Rice / Mint Rice, Rasam, Potato Fry, Curd", "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad", "Fruit, Lemon Mint Juice"],
                        "snacks": ["Boiled Sweet Corn with Masala", "Tea, Coffee, Milk"],
                        "dinner": ["Wheat Paratha (Chettinad Chicken Gravy)", "Millet Idly, Chilli Idly, Sambar, Tomato Chutney", "White Rice, Rasam, Butter Milk", "Milk, Salad"]
                    },
                    "Saturday": {
                        "breakfast": ["Gobi Paratha / Paneer Paratha, Curd, Pickle", "Pongal, Coconut Chutney, Sambar, Vada", "Boiled Egg", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Chapathi, Veg Kurma / Chicken Curry", "Curry Leaf Rice, Sambar, Beans Poriyal, Rasam, Curd", "Paruppu Podi, Ghee, Thovaiyal, Pickle, Papad", "Fruit, Lemon Juice"],
                        "snacks": ["Masala Puri / Veg Noodles", "Tea, Coffee, Milk"],
                        "dinner": ["Chapathi, Methi Paneer Gravy", "Masala Dosa, Sambar, Chutney", "White Rice, Rasam, Cabbage Poriyal, Butter Milk", "Salad, Milk"]
                    },
                    "Sunday": {
                        "breakfast": ["White Puttu / Ragi Puttu, Kadala Curry, Coconut", "Pav Bhaji, Masala, Chopped Onions", "Tea, Milk, Coffee", "Bread, Butter, Jam"],
                        "lunch": ["Chicken Gravy, Veg Pulav, Raita, French Fries", "Phulka, Matter Curry, Curd Rice, Pickle", "White Rice, Rasam, Butter Milk", "Fruit - Apple"],
                        "snacks": ["Red Pasta / Dahi Puri", "Tea, Coffee, Milk"],
                        "dinner": ["Phulka, Veg Sabji / Dal Makhani", "Onion Podi Uttappam, Sambar, Kara Chutney", "White Rice, Sambar, Tomato Rasam, Carrot Poriyal", "Butter Milk, Salad, Milk"]
                    }
                }
            },
            "special": {
                "days": {
                    "Monday": {
                        "breakfast": ["Thinai Pongal, Sambar", "Mysore Bonda", "Poha", "Boiled Egg", "Bread, Butter, Jam", "Juice"],
                        "lunch": ["Chapatti, Soya Gravy", "White Rice, Sambar, Fry", "Paruppu Podi"],
                        "snacks": ["Samosa Masala", "Tea, Coffee"],
                        "dinner": ["Naan / Poori", "Butter Chicken / Fish Curry", "Idly, Sambar", "Rice, Rasam", "Gulab Jamun"]
                    },
                    "Tuesday": {
                        "breakfast": ["Paratha, Curd", "Ragi Dosa, Chutney", "Omelette"],
                        "lunch": ["Pulka, Kurma", "White Rice, Sambar", "Papad"],
                        "snacks": ["Sev Puri"],
                        "dinner": ["Egg Dosa / Plain Dosa", "Chapatti", "Rice, Rasam", "Ice Cream"]
                    },
                    "Wednesday": {
                        "breakfast": ["Millet Idly", "Sabudana Vada", "Thepla", "French Toast"],
                        "lunch": ["Chapatti, Paneer", "White Rice, Sambar", "Fryums"],
                        "snacks": ["Corn Chat"],
                        "dinner": ["Chole Puri", "Masala Dosa", "Rice, Rasam", "Rasmallai"]
                    },
                    "Thursday": {
                        "breakfast": ["Pav Bhaji", "Neer Dosa", "Vada", "Omelette"],
                        "lunch": ["Chapatti, Baby Corn", "White Rice, Sambar", "Fryums"],
                        "snacks": ["Sandwich"],
                        "dinner": ["Pulka, Mushroom", "Ghee Rice", "Mysore Pak"]
                    },
                    "Friday": {
                        "breakfast": ["Kichadi", "Idiyappam", "French Toast"],
                        "lunch": ["Roti, Paneer", "White Rice, Rasam"],
                        "snacks": ["Chat"],
                        "dinner": ["Paratha, Chicken", "Ragi Semiya", "Rose Milk"]
                    },
                    "Saturday": {
                        "breakfast": ["Paratha", "Pongal", "Egg"],
                        "lunch": ["Chapatti, Kurma", "Variety Rice"],
                        "snacks": ["Roll"],
                        "dinner": ["Tandoori Roti", "Upma", "Jelabi"]
                    },
                    "Sunday": {
                        "breakfast": ["Puttu", "Pav Bhaji"],
                        "lunch": ["Chicken Gravy, Pulav", "Phulka"],
                        "snacks": ["Pasta"],
                        "dinner": ["Phulka", "Uttappam", "Milk"]
                    }
                }
            }
        };
        setJsonInput(JSON.stringify(template, null, 2));
        setParsedPreview(template);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Import Weekly Menu</h1>
                <p className="text-gray-600 mt-2">
                    Paste your JSON menu data here to update the student app directly.
                    Ensure it follows the structure: <code>veg/non-veg/special</code> &gt; <code>days</code>.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileJson className="w-5 h-5 text-blue-500" />
                            JSON Input
                        </h2>
                        <button
                            onClick={loadExampleTemplate}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Load Template
                        </button>
                    </div>

                    <textarea
                        value={jsonInput}
                        onChange={handleInputChange}
                        className="w-full h-[500px] font-mono text-sm p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Paste your menu JSON here..."
                    />
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className={`w-5 h-5 ${parsedPreview ? 'text-green-500' : 'text-gray-400'}`} />
                        Preview & Validation
                    </h2>

                    <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-auto border border-gray-100">
                        {parsedPreview ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-100">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-medium">Valid JSON Format</span>
                                </div>

                                {/* Preview Categories */}
                                {Object.keys(parsedPreview).map(category => (
                                    <div key={category} className="border border-gray-200 rounded-lg p-3">
                                        <h3 className="font-bold capitalize text-gray-800 mb-2">{category} Menu</h3>
                                        <div className="grid grid-cols-3 gap-2">
                                            {parsedPreview[category]?.days && Object.keys(parsedPreview[category].days).map(day => (
                                                <div key={day} className="bg-white p-1 px-2 rounded border border-gray-100 text-xs text-center text-gray-600">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <AlertCircle className="w-12 h-12 mb-2 opacity-50" />
                                <p>Waiting for valid JSON input...</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleSaveMenu}
                            disabled={!parsedPreview || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            {loading ? 'Publishing...' : 'Publish Menu to Live App'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuImport;
