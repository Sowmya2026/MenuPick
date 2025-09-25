import { useAuth } from '../context/AuthContext';
import LoggedInNavbar from './Navbar';
import PublicNavbar from './PublicNavbar';

const MainNavbar = () => {
  const { currentUser } = useAuth();

  return currentUser ? <LoggedInNavbar /> : <PublicNavbar />;
};

export default MainNavbar;