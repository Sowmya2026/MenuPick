# ✅ FIXED: Admin Permission Bootstrap Error

**Issue:** 
The previous permissions fix created a "chicken-and-egg" problem:
- You need to be an admin to create an admin user
- But you can't be an admin until you create an admin user
- Result: "Missing or insufficient permissions" when trying to register

**Solution:**
I have updated `firestore.rules` to allow **self-registration**.
Now, any authenticated user can create their *own* admin document (but cannot create others unless they are already an admin).

## 🚀 ACTION REQUIRED: Deploy Rules Again

You **MUST** deploy the updated rules for the fix to work:

1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to **Firestore Database** -> **Rules**
3. Copy the NEW content from `f:\MenuPick\firestore.rules`
4. Paste it into the console
5. Click **Publish**

## 🔄 Then Try Again

1. Go to `http://localhost:5174/admin-setup`
2. Click **Register as Admin**
3. It should work now! ✅

---

## 🔍 Technical Detail
**Old Rule:**
```javascript
allow create: if isAdmin();
```
(Failed because you aren't an admin yet)

**New Rule:**
```javascript
allow create: if isAdmin() || (request.auth != null && request.auth.uid == adminId);
```
(Works because it checks if you are creating *your own* file)
