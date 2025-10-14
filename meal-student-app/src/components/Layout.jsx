import { useAuth } from "../context/AuthContext";
import BottomNavigation from "./BottomNavigation";

const Layout = ({ children }) => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Main Content */}
      <main
        className={`flex-1 ${
          currentUser ? "pb-[env(safe-area-inset-bottom)]" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (Mobile only, fixed flush to bottom) */}
      {currentUser && (
        <div className="fixed inset-x-0 bottom-0">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};

export default Layout;