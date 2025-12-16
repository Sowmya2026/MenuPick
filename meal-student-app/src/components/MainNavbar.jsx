import { useAuth } from '../context/AuthContext';
import LoggedInNavbar from './Navbar';
import PublicNavbar from './PublicNavbar';

const MainNavbar = () => {
  const { currentUser, loading } = useAuth();

  // Show nothing while loading to prevent flickering
  if (loading) {
    return null;
  }

  // Check for guest mode
  const isGuest = localStorage.getItem('isGuest') === 'true';

  return (currentUser || isGuest) ? <LoggedInNavbar /> : <PublicNavbar />;
};

export default MainNavbar;