import { useAuth } from '../context/AuthContext';
import MainNavbar from './MainNavbar';
import BottomNavigation from './BottomNavigation';
import InstallPrompt from './InstallPrompt';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <MainNavbar />

      {/* Main Content Area - No extra padding, let pages control their own layout */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Mobile only) */}
      {currentUser && <BottomNavigation />}

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default Layout;