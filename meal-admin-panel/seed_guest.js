
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDB-Bm3-8ke6lHz8ZhIyQfR4g7PKaTBgNI",
    authDomain: "mealpickerapp.firebaseapp.com",
    projectId: "mealpickerapp",
    storageBucket: "mealpickerapp.appspot.com",
    messagingSenderId: "283526597613",
    appId: "1:283526597613:web:8054416aeeccc6bd25b5e4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedGuest() {
    try {
        const guestId = 'guest_test_' + Date.now();
        console.log("Seeding guest:", guestId);
        await setDoc(doc(db, 'guest_sessions', guestId), {
            lastActive: serverTimestamp(),
            sessionId: guestId
        });
        console.log("Successfully seeded guest session.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding guest:", error);
        process.exit(1);
    }
}

seedGuest();
