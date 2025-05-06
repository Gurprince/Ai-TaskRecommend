import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let rafId;
    let timeout;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY <= 10); // Small threshold to prevent flicker
    };

    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(handleScroll);
      }, 10);
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isVisible ? '' : 'hidden'}`}>
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo" aria-label="Navigate to home">
          SkillSync
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link
                to="/tasks"
                className="navbar-link"
                aria-label="Navigate to tasks"
              >
                Tasks
              </Link>
              <Link
                to="/accepted-tasks"
                className="navbar-link"
                aria-label="Navigate to accepted tasks"
              >
                Accepted Tasks
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-logout"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-link"
                aria-label="Navigate to login"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="navbar-link"
                aria-label="Navigate to signup"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;