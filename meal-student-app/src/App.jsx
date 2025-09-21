import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MealProvider } from './context/MealContext'
import { MenuProvider } from './context/MenuContext'
import { FeedbackProvider } from './context/FeedbackContext'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import MealSelection  from './pages/MealSelection'
import MealDetail from './pages/MealDetail'
import Feedback from './pages/Feedback'
import Auth from './pages/Auth'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <AuthProvider>
        <MealProvider>
          <MenuProvider>
            <FeedbackProvider>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/selection" element={<MealSelection />} />
                    <Route path="/meal/:id" element={<MealDetail />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/splash" element={<Splash />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Toaster position="top-right" />
              </div>
            </FeedbackProvider>
          </MenuProvider>
        </MealProvider>
      </AuthProvider>
    </Router>
  )
}

export default App