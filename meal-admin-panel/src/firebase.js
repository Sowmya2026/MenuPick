import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Add this import


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB-Bm3-8ke6lHz8ZhIyQfR4g7PKaTBgNI",
  authDomain: "mealpickerapp.firebaseapp.com",
  projectId: "mealpickerapp",
  storageBucket: "mealpickerapp.appspot.com",
  messagingSenderId: "283526597613",
  appId: "1:283526597613:web:8054416aeeccc6bd25b5e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log("✅ Firebase connected in Admin Web");

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app); // ✅ Export auth

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // ✅ Already exported

// Export the app instance as well
export default app;