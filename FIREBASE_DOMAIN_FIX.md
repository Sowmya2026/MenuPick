# 🔥 Firebase Authorized Domain Setup - Fix OAuth Error

**Date:** December 16, 2025, 1:48 PM IST  
**Status:** ⚠️ Action Required

---

## ❌ Current Error

```
FirebaseError: Firebase: Error (auth/unauthorized-domain)

The current domain is not authorized for OAuth operations.
Domain: menu-pick.vercel.app
```

**What This Means:**
Firebase doesn't recognize your Vercel domain as authorized for Google Sign-In.

---

## ✅ Solution: Add Vercel Domain to Firebase

### **Step-by-Step Guide:**

---

## 1️⃣ Go to Firebase Console

1. **Open Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Login with your Google account

2. **Select Your Project**
   - Click on your MenuPick project
   - (The one you're using for authentication)

---

## 2️⃣ Navigate to Authentication Settings

1. **Click "Authentication"** in the left sidebar
   
2. **Click "Settings"** tab at the top
   
3. **Scroll down to "Authorized domains"** section

---

## 3️⃣ Add Your Vercel Domain

### **Current Authorized Domains (Probably):**
- `localhost`
- `127.0.0.1`
- Maybe your Firebase hosting domain

### **Domains You Need to Add:**

**For Student App:**
```
menu-pick.vercel.app
```

**For Admin Portal:**
```
[your-admin-portal-domain].vercel.app
```

**How to Add:**

1. **Click "Add domain"** button

2. **Enter domain:**
   ```
   menu-pick.vercel.app
   ```

3. **Click "Add"**

4. **Repeat for admin portal domain** (if different)

---

## 4️⃣ Verify Domains Added

After adding, your authorized domains should look like:

```
✅ localhost
✅ 127.0.0.1
✅ menu-pick.vercel.app
✅ [admin-portal-domain].vercel.app
✅ [your-firebase-domain].firebaseapp.com
```

---

## 5️⃣ Test the Fix

1. **Wait 1-2 minutes** for Firebase to update

2. **Clear browser cache:**
   - Hard reload: `Ctrl + Shift + R` (Windows)
   - Or: `Cmd + Shift + R` (Mac)

3. **Visit your Vercel site:**
   - https://menu-pick.vercel.app

4. **Try Google Sign-In:**
   - Click "Sign in with Google"
   - Should work now! ✅

---

## 📋 Complete Checklist

### **Domains to Add:**

- [ ] Student App: `menu-pick.vercel.app`
- [ ] Admin Portal: `[your-admin-domain].vercel.app`
- [ ] Any preview deployments (optional):
  - `menu-pick-*.vercel.app`

### **Verification:**

- [ ] Domains added in Firebase Console
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Tested Google Sign-In
- [ ] No more auth errors

---

## 🎯 Quick Reference

### **Firebase Console Path:**
```
Firebase Console
  → Your Project
    → Authentication
      → Settings
        → Authorized domains
          → Add domain
```

### **Domain Format:**
```
✅ Correct: menu-pick.vercel.app
❌ Wrong: https://menu-pick.vercel.app
❌ Wrong: menu-pick.vercel.app/
```

**Note:** Don't include `https://` or trailing `/`

---

## 🔍 Find Your Vercel Domains

### **Student App Domain:**

1. Go to Vercel Dashboard
2. Click on your student app project
3. Look for "Domains" section
4. Copy the domain (e.g., `menu-pick.vercel.app`)

### **Admin Portal Domain:**

1. Go to Vercel Dashboard
2. Click on your admin portal project
3. Look for "Domains" section
4. Copy the domain (e.g., `menu-pick-admin.vercel.app`)

---

## 🐛 Troubleshooting

### **Still Getting Error After Adding Domain?**

**1. Check Domain Spelling:**
- Make sure it's exactly as shown in Vercel
- No typos
- No extra characters

**2. Wait Longer:**
- Sometimes takes 2-5 minutes to propagate
- Try waiting a bit longer

**3. Clear All Cache:**
```
Chrome/Edge:
1. Press F12 (DevTools)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"
```

**4. Try Incognito/Private Mode:**
- Open incognito window
- Visit your site
- Try sign-in

**5. Check Firebase Project:**
- Make sure you're in the correct Firebase project
- Verify it's the same project as in your code

---

## 📱 For Multiple Environments

### **If You Have:**

**Production:**
- `menu-pick.vercel.app`

**Staging:**
- `menu-pick-staging.vercel.app`

**Preview Deployments:**
- `menu-pick-*.vercel.app`

### **Add All of Them:**

1. Add each domain individually
2. Or use wildcard (if Firebase supports):
   - `*.vercel.app` (may not work)

**Recommended:** Add each domain explicitly

---

## 🎯 Expected Result

### **Before Fix:**
```
❌ FirebaseError: auth/unauthorized-domain
❌ Google Sign-In fails
❌ OAuth popup doesn't work
```

### **After Fix:**
```
✅ Google Sign-In works
✅ OAuth popup opens
✅ Users can authenticate
✅ No auth errors
```

---

## 📝 Additional Domains to Consider

### **Common Vercel Patterns:**

```
menu-pick.vercel.app              (production)
menu-pick-git-main.vercel.app     (main branch)
menu-pick-[hash].vercel.app       (preview deployments)
```

### **Custom Domains (if you have):**

If you added a custom domain in Vercel:
```
www.menupick.com
menupick.com
```

**Add these too!**

---

## ⚡ Quick Fix Summary

**What to Do Right Now:**

1. **Go to:** https://console.firebase.google.com/
2. **Navigate to:** Authentication → Settings → Authorized domains
3. **Click:** "Add domain"
4. **Enter:** `menu-pick.vercel.app`
5. **Click:** "Add"
6. **Wait:** 1-2 minutes
7. **Test:** Try Google Sign-In again

**That's it!** 🎉

---

## 📞 Still Need Help?

### **Check These:**

1. **Correct Firebase Project?**
   - Verify project ID in your code matches Firebase Console

2. **Correct Domain?**
   - Check exact domain from Vercel Dashboard

3. **Firebase Plan?**
   - Make sure you're on Spark (free) or Blaze plan
   - Some features need paid plan

4. **Google OAuth Enabled?**
   - In Firebase Console → Authentication → Sign-in method
   - Make sure Google is enabled

---

## 🎯 Final Checklist

Before you're done:

- [ ] Added `menu-pick.vercel.app` to Firebase
- [ ] Added admin portal domain (if different)
- [ ] Waited 1-2 minutes
- [ ] Cleared browser cache
- [ ] Tested Google Sign-In
- [ ] Verified no errors in console
- [ ] Users can sign in successfully

---

**Firebase Console:** https://console.firebase.google.com/  
**Your Domain:** menu-pick.vercel.app  
**Action Required:** Add domain to Firebase authorized domains  
**Time Required:** 2-3 minutes
