import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
          SkillSync
        </Link>
        <div className="flex space-x-6 items-center">
          {user ? (
            <>
              <Link
                to="/tasks"
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
                aria-label="Navigate to tasks"
              >
                Tasks
              </Link>
              <Link
                to="/accepted-tasks"
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
                aria-label="Navigate to accepted tasks"
              >
                Accepted Tasks
              </Link>
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 shadow-md"
                aria-label="Log out"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
                aria-label="Navigate to login"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600 transition duration-200 font-semibold"
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