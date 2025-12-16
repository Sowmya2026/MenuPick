# 🚀 MenuPick - Quick Start Guide

**Last Updated**: December 15, 2025  
**Time to Setup**: ~15 minutes

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:
- [ ] **Node.js 16+** installed ([Download](https://nodejs.org))
- [ ] **npm 8+** (comes with Node.js)
- [ ] **Git** installed
- [ ] **Firebase account** ([Create free](https://firebase.google.com))
- [ ] **Code editor** (VS Code recommended)
- [ ] **Modern browser** (Chrome, Firefox, Edge, Safari)

---

## ⚡ Quick Setup (5 Minutes)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/Sowmya2026/MenuPick.git
cd MenuPick
```

### **Step 2: Install Dependencies**

**Student App:**
```bash
cd meal-student-app
npm install
```

**Admin Panel:**
```bash
cd ../meal-admin-panel
npm install
```

### **Step 3: Configure Firebase**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password)
4. Enable **Cloud Firestore**
5. Enable **Firebase Cloud Messaging**
6. Get your Firebase config

### **Step 4: Environment Variables**

Create `.env` in `meal-student-app/`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=yourproject
VITE_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_VAPID_KEY=BM5H...
```

### **Step 5: Run Applications**

**Terminal 1 - Student App:**
```bash
cd meal-student-app
npm run dev
```
Opens at: http://localhost:5173

**Terminal 2 - Admin Panel:**
```bash
cd meal-admin-panel
npm run dev
```
Opens at: http://localhost:5174

---

## 🎯 First Time Setup

### **For Students:**

1. **Open**: http://localhost:5173
2. **View Splash** screen (first time only)
3. **Onboarding** tutorial
4. **Sign Up**:
   - Enter email & password
   - Complete profile (name, student ID, mess preference)
5. **Browse Menus**:
   - Select mess type (Veg/Non-Veg/Special)
   - View weekly menu
6. **Select Meals** (optional)
7. **Provide Feedback** (optional)

### **For Admins:**

1. **Open**: http://localhost:5174
2. **Create Admin Account** (first admin signup)
3. **Login** with credentials
4. **View Dashboard** - See analytics
5. **Manage Meals** - Add/edit/delete meals
6. **View Feedback** - Read student feedback

---

## 📂 Project Structure Overview

```
MenuPick/
│
├── meal-student-app/              # Student Portal
│   ├── src/
│   │   ├── components/            # UI Components
│   │   │   ├── BottomNavigation.jsx
│   │   │   ├── DaySelector.jsx
│   │   │   ├── MealCard.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── MainNavbar.jsx
│   │   │
│   │   ├── context/               # Global State
│   │   │   ├── AuthContext.jsx
│   │   │   ├── MealContext.jsx
│   │   │   ├── MenuContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── pages/                 # Route Pages
│   │   │   ├── Home.jsx           # Main menu page
│   │   │   ├── MealSelection.jsx  # Select meals
│   │   │   ├── Feedback.jsx       # Submit feedback
│   │   │   ├── Profile.jsx        # User profile
│   │   │   ├── SignUp.jsx         # Registration
│   │   │   └── SignIn.jsx         # Login
│   │   │
│   │   ├── services/              # Firebase
│   │   │   ├── firebaseConfig.js
│   │   │   ├── authService.js
│   │   │   └── firestoreService.js
│   │   │
│   │   ├── data/                  # Static Data
│   │   │   └── menuData.js        # Weekly menu
│   │   │
│   │   └── App.jsx                # Main app
│   │
│   └── package.json
│
└── meal-admin-panel/              # Admin Portal
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── StatsCard.jsx
    │   │
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Main dashboard
    │   │   ├── MealManagement.jsx # CRUD meals
    │   │   ├── FeedbackView.jsx   # View feedback
    │   │   ├── Analytics.jsx      # Charts & reports
    │   │   └── Login.jsx          # Admin login
    │   │
    │   └── App.jsx
    │
    └── package.json
```

---

## 🔥 Firebase Setup Guide

### **1. Create Firebase Project**

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: `menupick-app`
4. Enable Google Analytics (optional)
5. Create project

### **2. Enable Authentication**

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Save

### **3. Setup Firestore Database**

1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select region (closest to users)
4. Create

### **4. Create Collections**

Create these collections manually or let app create them:
- `users` - Student profiles
- `meals` - Meal data
- `selections` - Meal selections
- `feedback` - Student feedback
- `notifications` - Push notification logs

### **5. Firestore Rules** (Important!)

Go to **Firestore Database** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meals are readable by all authenticated users
    match /meals/{mealId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.admin == true;
    }
    
    // Selections
    match /selections/{selectionId} {
      allow read, write: if request.auth != null;
    }
    
    // Feedback
    match /feedback/{feedbackId} {
      allow read: if request.auth.token.admin == true;
      allow create: if request.auth != null;
    }
  }
}
```

### **6. Enable Cloud Messaging**

1. Go to **Project Settings** → **Cloud Messaging**
2. Copy **Server key** and **Sender ID**
3. Generate **Web Push certificate** (VAPID key)
4. Add to `.env` file

---

## 🛠️ Development Commands

### **Common Commands**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code (if prettier configured)
npm run format
```

### **Troubleshooting Commands**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev

# Check for outdated packages
npm outdated

# Update all packages
npm update
```

---

## 🐛 Common Issues & Fixes

### **Issue 1: Port already in use**
```bash
Error: Port 5173 is already in use
```
**Fix:**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use different port
npm run dev -- --port 5175
```

### **Issue 2: Firebase not initialized**
```bash
Error: Firebase app not initialized
```
**Fix:**
- Check `.env` file exists in `meal-student-app/`
- Ensure all VITE_ variables are set
- Restart dev server after changing .env

### **Issue 3: Module not found**
```bash
Error: Cannot find module 'react'
```
**Fix:**
```bash
cd meal-student-app
npm install
```

### **Issue 4: Build fails**
```bash
Error: Build failed with errors
```
**Fix:**
```bash
# Check for ESLint errors
npm run lint

# Clear cache
rm -rf node_modules/.vite dist
npm run build
```

---

## 📱 Testing on Mobile

### **Local Network Testing**

1. **Find your IP**:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Start dev server with host**:
   ```bash
   npm run dev -- --host
   ```

3. **Access on mobile**:
   - Student App: `http://YOUR_IP:5173`
   - Admin Panel: `http://YOUR_IP:5174`

### **Using ngrok (for remote testing)**

```bash
# Install ngrok
npm install -g ngrok

# Expose port 5173
ngrok http 5173
```

---

## 🚀 Deployment Guide

### **Deploy to Vercel (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Student App**:
   ```bash
   cd meal-student-app
   vercel --prod
   ```

3. **Deploy Admin Panel**:
   ```bash
   cd meal-admin-panel
   vercel --prod
   ```

4. **Set Environment Variables**:
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add all VITE_ variables

### **Deploy to Firebase Hosting**

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:
   ```bash
   firebase login
   ```

3. **Initialize**:
   ```bash
   firebase init hosting
   ```

4. **Build & Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

---

## 📊 Database Schema

### **users Collection**
```javascript
{
  uid: string,
  email: string,
  name: string,
  studentId: string,
  messPreference: 'veg' | 'non-veg' | 'special',
  profileCompleted: boolean,
  createdAt: timestamp,
  fcmTokens: [string]
}
```

### **meals Collection**
```javascript
{
  id: string,
  name: string,
  category: 'veg' | 'non-veg' | 'special',
  day: 'Monday' | 'Tuesday' | ...,
  mealTime: 'breakfast' | 'lunch' | 'snacks' | 'dinner',
  items: [string],
  rating: number,
  createdAt: timestamp
}
```

### **selections Collection**
```javascript
{
  id: string,
  userId: string,
  date: string,
  messType: string,
  mealTime: string,
  items: [string],
  createdAt: timestamp
}
```

### **feedback Collection**
```javascript
{
  id: string,
  userId: string,
  userName: string,
  mealName: string,
  rating: number (1-5),
  comment: string,
  createdAt: timestamp
}
```

---

## 🎨 Customization Guide

### **Change Theme Colors**

Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#10B981',    // Change primary color
        secondary: '#3B82F6',  // Change secondary color
      }
    }
  }
}
```

### **Update Logo**

Replace files:
- `meal-student-app/public/logo.png`
- `meal-admin-panel/public/logo.png`

### **Modify Menu Data**

Edit `meal-student-app/src/data/menuData.js`:
```javascript
export const messMenu = {
  timings: { ... },
  days: {
    Monday: {
      breakfast: ['Your items'],
      lunch: ['Your items'],
      ...
    }
  }
}
```

---

## 📚 Useful Resources

### **Documentation**
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Video Tutorials**
- React Crash Course: [YouTube](https://youtube.com)
- Firebase Authentication: [YouTube](https://youtube.com)
- Vite Setup: [YouTube](https://youtube.com)

### **Community**
- React Discord: [Join](https://discord.gg/react)
- Firebase Discord: [Join](https://discord.gg/firebase)
- Stack Overflow: [Ask](https://stackoverflow.com)

---

## ✅ Launch Checklist

Before going to production:

- [ ] All environment variables set in production
- [ ] Firebase Security Rules configured
- [ ] Authentication working
- [ ] Database CRUD operations tested
- [ ] Push notifications working
- [ ] Mobile responsive checked
- [ ] Cross-browser tested
- [ ] Performance optimized
- [ ] Analytics setup (Google Analytics)
- [ ] Error tracking setup (Sentry)
- [ ] Backup strategy in place
- [ ] Documentation complete

---

## 🎓 Next Steps

After setup:

1. ✅ **Explore the app** - Try all features
2. 📖 **Read documentation** - Check PROJECT_OVERVIEW.md
3. 🎨 **Customize** - Add your branding
4. 🧪 **Test thoroughly** - All features and edge cases
5. 🚀 **Deploy** - Go live!
6. 📊 **Monitor** - Track usage and performance
7. 🔄 **Iterate** - Add new features from roadmap

---

## 💡 Pro Tips

- Use React DevTools extension for debugging
- Enable Firebase Emulator for local development
- Use Postman for testing Firebase REST APIs
- Keep Firebase SDK updated
- Monitor Firestore usage (billing)
- Use environment-specific configs
- Enable Firebase Analytics for insights

---

## 🆘 Need Help?

- 📧 **Email**: your-email@example.com
- 💬 **Discord**: [Join Server]
- 🐛 **Issues**: [GitHub Issues](https://github.com/Sowmya2026/MenuPick/issues)
- 📖 **Docs**: Check PROJECT_OVERVIEW.md

---

<p align="center">
  <strong>Happy Coding! 🚀</strong>
</p>

<p align="center">
  <a href="#-menupick---quick-start-guide">Back to Top ⬆️</a>
</p>
