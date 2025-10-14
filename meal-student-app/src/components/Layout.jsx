import { useAuth } from '../context/AuthContext';
import BottomNavigation from './BottomNavigation';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content Area */}
      <main className="flex-1 pb-20"> {/* Increased bottom padding for mobile nav */}
        <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
      
      {/* Bottom Navigation (Mobile only) */}
      {currentUser && <BottomNavigation />}
    </div>
  );
};

export default Layout;