// firestoreService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebaseConfig";

//
// 🔹 OPTIONS
//
export async function setMonthlyOptions(monthId, category, items) {
  const id = `${monthId}-${category}`;
  await setDoc(doc(db, "options", id), { items });
}

export async function getMonthlyOptions(monthId, category) {
  const id = `${monthId}-${category}`;
  const snap = await getDoc(doc(db, "options", id));
  return snap.exists() ? snap.data() : { items: [] };
}

//
// 🔹 MENUS
//
export async function setMenuDay(monthId, category, day, meals) {
  const ref = doc(db, "menus", `${monthId}-${category}`);
  await setDoc(
    ref,
    {
      meta: { category, month: monthId, locked: false },
      days: { [day]: meals }
    },
    { merge: true }
  );
}

export async function getMenu(monthId, category) {
  const snap = await getDoc(doc(db, "menus", `${monthId}-${category}`));
  return snap.exists() ? snap.data() : null;
}

//
// 🔹 PREFERENCES
//
export async function setUserPreference(userId, monthId, category, selected) {
  const id = `${userId}-${monthId}-${category}`;
  await setDoc(doc(db, "preferences", id), {
    selected,
    submittedAt: serverTimestamp()
  });
}

export async function getUserPreference(userId, monthId, category) {
  const id = `${userId}-${monthId}-${category}`;
  const snap = await getDoc(doc(db, "preferences", id));
  return snap.exists() ? snap.data() : null;
}

//
// 🔹 USERS
//
export async function createOrUpdateUser(userId, data) {
  await setDoc(doc(db, "users", userId), data, { merge: true });
}

export async function getUser(userId) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}

//
// 🔹 FEEDBACK
//
export async function addFeedback(monthId, category, day, mealTime, entry) {
  const id = `${monthId}-${category}-${day}-${mealTime}`;
  const ref = doc(db, "feedback", id);

  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    await updateDoc(ref, { entries: [...(data.entries || []), entry] });
  } else {
    await setDoc(ref, { entries: [entry] });
  }
}

export async function getFeedback(monthId, category, day, mealTime) {
  const id = `${monthId}-${category}-${day}-${mealTime}`;
  const snap = await getDoc(doc(db, "feedback", id));
  return snap.exists() ? snap.data() : { entries: [] };
}

//
// 🔹 MEALS (🔥 FIXED SCHEMA)
// Meals/{messType}/categories/{category}/subcategories/{subcategory}/items/{mealId}
//
export async function addMeal(messType, category, subcategory, mealData) {
  const mealRef = doc(
    collection(
      db,
      "Meals",
      messType,
      "categories",
      category,
      "subcategories",
      subcategory,
      "items"
    )
  ); // auto-ID
  await setDoc(mealRef, mealData);
  return mealRef.id;
}

export async function updateMeal(
  messType,
  category,
  subcategory,
  mealId,
  mealData
) {
  const mealRef = doc(
    db,
    "Meals",
    messType,
    "categories",
    category,
    "subcategories",
    subcategory,
    "items",
    mealId
  );
  await updateDoc(mealRef, mealData);
}

export async function getMeals(messType, category, subcategory) {
  const itemsRef = collection(
    db,
    "Meals",
    messType,
    "categories",
    category,
    "subcategories",
    subcategory,
    "items"
  );
  const snap = await getDocs(itemsRef);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

//
// 🔹 GENERIC HELPERS
//
export async function getAllDocs(colName) {
  const querySnap = await getDocs(collection(db, colName));
  return querySnap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addNewDoc(colName, data) {
  return await addDoc(collection(db, colName), data);
}
