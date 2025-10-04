import { useAuth } from '../context/AuthContext';
import LoggedInNavbar from './Navbar';
import PublicNavbar from './PublicNavbar';

const MainNavbar = () => {
  const { currentUser, loading } = useAuth();

  // Show nothing while loading to prevent flickering
  if (loading) {
    return null;
  }

  return currentUser ? <LoggedInNavbar /> : <PublicNavbar />;
};

export default MainNavbar;