import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MealProvider } from './context/MealContext';
import { MenuProvider } from './context/MenuContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import AppContent from './AppContent';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <MealProvider>
            <MenuProvider>
              <NotificationProvider>
                <AppContent />
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '14px',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10B981',
                        secondary: 'white',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: 'white',
                      },
                    },
                  }}
                />
              </NotificationProvider>
            </MenuProvider>
          </MealProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;