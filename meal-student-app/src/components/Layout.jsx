import { useAuth } from '../context/AuthContext';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content Area - No extra padding, let pages control their own layout */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom Navigation (Handles its own visibility logic) */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;