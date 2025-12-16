# MenuPick - Campus Meal Management System

## 🎯 Project Motive

**MenuPick** is a comprehensive digital solution designed to revolutionize hostel/campus mess management. The system aims to:

1. **Reduce Food Wastage**: By allowing students to pre-select their meals, the mess can prepare accurate quantities
2. **Enhance Student Experience**: Provide transparency in meal options and allow personalized meal selection
3. **Streamline Operations**: Give administrators powerful tools to manage menus, track analytics, and respond to feedback
4. **Improve Communication**: Enable real-time notifications and feedback mechanisms between students and mess management

## 🏗️ Project Architecture

The project consists of **two main applications**:

### 1. **Meal Student App** (Student Portal)
- **Purpose**: Student-facing application for meal selection and feedback
- **Technology**: React + Vite
- **Hosting**: Firebase (Authentication & Firestore Database)
- **Primary Users**: College/Hostel Students

### 2. **Meal Admin Panel** (Admin Portal)
- **Purpose**: Administrative dashboard for mess management
- **Technology**: React + Vite
- **Hosting**: Firebase (Authentication & Firestore Database)
- **Primary Users**: Mess Administrators, Managers

## ✨ Key Features

### **Student App Features**

#### 🏠 **Home/Dashboard**
- **Dynamic Menu Display**: View daily menu with three mess types:
  - 🥬 Vegetarian (Green theme)
  - 🍖 Non-Vegetarian (Red theme)
  - ⭐ Special (Purple theme)
- **Day-wise Menu**: Browse menu for all 7 days of the week
- **Meal Timings Display**: 
  - Breakfast: 7:00 AM - 9:00 AM
  - Lunch: 12:00 PM - 2:00 PM
  - Snacks: 5:00 PM - 6:00 PM
  - Dinner: 7:00 PM - 9:00 PM
- **Motivational Quotes**: Encourages healthy eating habits
- **Responsive Design**: Mobile-first approach with beautiful UI

#### 🍽️ **Meal Selection**
- Pre-select meals for upcoming days
- Choose specific items from the menu
- Save meal preferences
- Modify selections before the deadline

#### 📝 **Feedback System**
- Rate meals (1-5 stars)
- Provide detailed feedback
- Suggest improvements
- Track submitted feedback

#### 🔔 **Notifications**
- Real-time notifications using Firebase Cloud Messaging (FCM)
- Menu updates alerts
- Important announcements
- Deadline reminders

#### 👤 **Profile Management**
- Update personal information
- Set mess preferences (Veg/Non-Veg/Special)
- View meal history
- Manage account settings

#### 🔐 **Authentication**
- Secure sign-up/sign-in with Firebase
- Email verification
- Password reset functionality
- Profile completion workflow

#### 🎨 **UI/UX Highlights**
- **Splash Screen**: Beautiful first impression
- **Onboarding**: Guide new users through the app
- **Bottom Navigation**: Quick access to key features
- **Smooth Animations**: Framer Motion powered transitions
- **Toast Notifications**: React Hot Toast for user feedback

---

### **Admin Panel Features**

#### 📊 **Dashboard**
- **Real-time Statistics**:
  - Total meals served today
  - Active students
  - Pending feedback
  - Meal preferences breakdown
- **Recent Activity Feed**
- **Quick Actions**
- **Data Visualization**: Charts using Chart.js

#### 🍲 **Meal Management**
- **CRUD Operations**: Create, Read, Update, Delete meals
- **Menu Planning**: Schedule menus for upcoming weeks
- **Categorization**: Organize by mess type (Veg/Non-Veg/Special)
- **Meal Details Management**: Update nutritional information, ingredients, allergens

#### 💬 **Feedback Management**
- View all student feedback
- Filter by date, rating, meal type
- Export feedback reports (Excel)
- Respond to feedback

#### 📈 **Analytics**
- **Meal Consumption Analytics**: Track popular meals
- **Student Engagement Metrics**: Participation rates
- **Waste Management Reports**: Identify food wastage patterns
- **Trend Analysis**: Historical data visualization
- **Export Capability**: Download reports as Excel files

#### 👨‍💼 **Profile Management**
- Admin account settings
- Update credentials
- Security settings

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18.2.0**: Component-based UI development
- **Vite 4.4.5**: Lightning-fast build tool
- **React Router DOM 6.15.0**: Client-side routing
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Framer Motion 10.18.0**: Smooth animations
- **Lucide React 0.263.1**: Modern icon library

### **Backend & Services**
- **Firebase 10.3.1**:
  - Firebase Authentication
  - Cloud Firestore (Database)
  - Firebase Cloud Messaging (Notifications)
  - Firebase Storage

### **Form & State Management**
- **React Hook Form 7.45.4**: Form validation
- **Context API**: Global state management (Auth, Meal, Menu, Notifications)

### **Data Visualization**
- **Chart.js 4.4.0**: Charts and graphs
- **React ChartJS-2 5.2.0**: React wrapper for Chart.js

### **Notifications & Alerts**
- **React Hot Toast 2.6.0**: Toast notifications (Student App)
- **SweetAlert2 11.26.2**: Beautiful alerts (Student App)
- **React Toastify 11.0.5**: Toast notifications (Admin Panel)

### **Utilities**
- **date-fns 2.30.0**: Date formatting
- **XLSX 0.18.5**: Excel export (Admin Panel)
- **file-saver 2.0.5**: File download (Admin Panel)

---

## 📁 Project Structure

```
MenuPick/
├── meal-student-app/          # Student Portal
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── assets/
│   │   ├── backend/
│   │   │   └── notificationService.js
│   │   ├── components/
│   │   │   ├── BottomNavigation.jsx
│   │   │   ├── DaySelector.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── MainNavbar.jsx
│   │   │   ├── MealCard.jsx
│   │   │   ├── MealTimeCard.jsx
│   │   │   ├── NotificationsPanel.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── MealContext.jsx
│   │   │   ├── MenuContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── data/
│   │   │   └── menuData.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── MealSelection.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── CompleteProfile.jsx
│   │   │   ├── Splash.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── firebaseConfig.js
│   │   │   └── firestoreService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── meal-admin-panel/          # Admin Portal
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── MealForm.jsx
│   │   │   └── RecentMeals.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── MealContext.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MealManagement.jsx
│   │   │   ├── FeedbackView.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔥 Firebase Configuration

### **Firebase Services Used**

1. **Firebase Authentication**
   - Email/Password authentication
   - User session management
   - Password reset

2. **Cloud Firestore**
   - Collections:
     - `users` - Student profiles and preferences
     - `meals` - Meal data and menu items
     - `selections` - Student meal selections
     - `feedback` - Student feedback and ratings
     - `notifications` - Push notification logs
     - `analytics` - Usage and consumption data

3. **Firebase Cloud Messaging (FCM)**
   - Push notifications
   - Real-time updates
   - Scheduled reminders

### **Environment Variables**
```
VITE_FIREBASE_API_KEY=AIzaSyDB-Bm3-8ke6lHz8ZhIyQfR4g7PKaTBgNI
VITE_FIREBASE_AUTH_DOMAIN=mealpickerapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mealpickerapp
VITE_FIREBASE_STORAGE_BUCKET=mealpickerapp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=283526597613
VITE_FIREBASE_APP_ID=1:283526597613:web:8054416aeeccc6bd25b5e4
VITE_FIREBASE_VAPID_KEY=BC8eYTXMf_ctwr9kDFtdPN1x-9Wusq70m_7zDqGFraIUlhBFucKJPH_M_blRQVY6Hv1y7DmknuZW26UF8UKzI34
```

---

## 🎨 Design System

### **Color Themes**
- **Vegetarian**: Green (#059669, #047857)
- **Non-Vegetarian**: Red (#DC2626, #991B1B)
- **Special**: Purple (#9333EA, #7E22CE)
- **Neutral**: Gray scale for UI elements

### **Typography**
- **Headers**: Serif fonts for elegance
- **Body**: Sans-serif for readability
- **Responsive**: Scale based on screen size

### **Components**
- **Cards**: Rounded corners, shadows, hover effects
- **Buttons**: Primary, secondary, outlined variants
- **Forms**: Clean inputs with validation
- **Navigation**: Fixed navbar + bottom navigation (mobile)

---

## 🚀 Current Plans & Roadmap

### **Phase 1: Core Functionality** ✅ (Completed)
- [x] Student authentication system
- [x] Menu display system
- [x] Meal selection feature
- [x] Feedback submission
- [x] Admin dashboard
- [x] Basic analytics

### **Phase 2: Enhanced Features** 🔄 (In Progress)
- [ ] Advanced notifications with scheduling
- [ ] QR code-based meal tracking
- [ ] Meal history and analytics for students
- [ ] Dietary preferences and restrictions
- [ ] Allergen warnings
- [ ] Nutritional information display

### **Phase 3: Integration & Automation** 📋 (Planned)
- [ ] Integration with hostel management system
- [ ] Automated meal counting
- [ ] AI-based menu suggestions based on popularity
- [ ] Waste prediction algorithms
- [ ] Automated inventory management
- [ ] SMS/WhatsApp notifications

### **Phase 4: Advanced Analytics** 📋 (Planned)
- [ ] Predictive analytics for meal planning
- [ ] Cost optimization reports
- [ ] Student health tracking (BMI, calorie intake)
- [ ] Custom report generation
- [ ] Data export in multiple formats
- [ ] Real-time dashboards

### **Phase 5: Mobile App** 📋 (Planned)
- [ ] Native Android app (React Native)
- [ ] Native iOS app (React Native)
- [ ] Offline mode support
- [ ] Push notifications on mobile
- [ ] Camera integration for food photos

### **Phase 6: Additional Features** 💡 (Future Ideas)
- [ ] Multi-campus support
- [ ] Payment integration (for special meals)
- [ ] Guest meal booking
- [ ] Recipe sharing community
- [ ] Meal rating and reviews with photos
- [ ] Social features (share favorite meals)
- [ ] Integration with fitness apps
- [ ] Carbon footprint calculator
- [ ] Sustainability metrics

---

## 🎯 Business Goals

### **For Students**
1. ✅ Transparency in meal options
2. ✅ Ability to provide feedback
3. ✅ Personalized experience
4. ⏳ Better nutritional awareness
5. ⏳ Reduced wait times (future: QR-based tracking)

### **For Administrators**
1. ✅ Reduced food wastage
2. ✅ Better demand forecasting
3. ✅ Streamlined operations
4. ✅ Data-driven decision making
5. ⏳ Cost optimization
6. ⏳ Improved student satisfaction

### **For Institution**
1. ✅ Modern, tech-enabled campus image
2. ✅ Better resource utilization
3. ⏳ Sustainability through waste reduction
4. ⏳ Enhanced student services
5. ⏳ Data for strategic planning

---

## 📊 Key Metrics to Track

### **Student Engagement**
- Daily active users
- Meal selection rate
- Feedback submission rate
- App retention rate

### **Operational Efficiency**
- Food wastage reduction (%)
- Accurate meal count (% accuracy)
- Feedback response time
- Menu variety index

### **Financial Impact**
- Cost savings from reduced wastage
- Efficiency gains
- Student satisfaction scores

---

## 🐛 Known Issues & Fixes Needed

### **Build Status**
- ✅ **Student App Build**: Successful (1m 3s)
- ✅ **Admin Panel Build**: Successful (2m 5s)

### **Current Issues**
1. **None**: Both applications build successfully without errors
2. **Warnings**: Some build size warnings (can be optimized later)

### **Improvement Areas**
1. **Performance**: Code splitting and lazy loading
2. **SEO**: Meta tags for better discoverability
3. **Accessibility**: ARIA labels, keyboard navigation
4. **Testing**: Unit tests, integration tests
5. **Documentation**: Code comments, API documentation

---

## 🔧 Development Commands

### **Student App**
```bash
cd meal-student-app

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### **Admin Panel**
```bash
cd meal-admin-panel

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🌐 Deployment

### **Current Deployment**
Both apps are set up for Vercel deployment:
- Student App: Configured with `vercel.json`
- Admin Panel: Configured with `vercel.json`

### **Deployment Steps**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

---

## 📝 Menu Data Structure

The system currently supports a comprehensive weekly menu with:
- **7 Days**: Monday to Sunday
- **4 Meal Times**: Breakfast, Lunch, Snacks, Dinner
- **3 Mess Types**: Vegetarian, Non-Vegetarian, Special
- **Rich Menu Items**: Indian cuisine with variety

Example menu items include:
- South Indian: Idly, Dosa, Pongal, Vada
- North Indian: Paratha, Paneer dishes, Dal
- Indo-Chinese: Fried Rice, Noodles, Manchurian
- Beverages: Tea, Coffee, Juices
- Desserts: Ice Cream, Gulab Jamun, Fruit Custard

---

## 👥 User Roles

### **Student**
- View menu
- Select meals
- Submit feedback
- Update profile
- Receive notifications

### **Admin**
- Manage menus
- View analytics
- Read feedback
- Send notifications
- Generate reports
- User management

### **Super Admin** (Future)
- Multi-campus management
- System configuration
- Advanced analytics
- Billing management

---

## 🔐 Security Features

1. **Firebase Authentication**: Industry-standard security
2. **Protected Routes**: Client-side route protection
3. **Environment Variables**: Sensitive data secured
4. **Firestore Rules**: Database-level security
5. **HTTPS**: Encrypted data transmission
6. **Input Validation**: React Hook Form validation
7. **XSS Protection**: React's built-in protection

---

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adjusted layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Breakpoints**: 
  - xs: 475px
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

---

## 🎓 Conclusion

**MenuPick** is a modern, feature-rich solution designed to transform campus dining experiences. With its dual-portal architecture, real-time data synchronization, and student-centric design, it addresses the key pain points of traditional mess management systems.

The project is production-ready with both applications building successfully and deployed on modern infrastructure. The roadmap includes exciting features like AI-powered menu suggestions, mobile apps, and advanced analytics.

---

## 📞 Support & Contribution

For questions, suggestions, or contributions, please:
1. Check the documentation
2. Review existing GitHub issues
3. Create a new issue with detailed description
4. Follow coding standards
5. Submit pull requests for review

---

**Last Updated**: December 15, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
