import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Fallback for undefined context
  if (!authContext) {
    console.error('AuthContext is undefined. Ensure Login is wrapped in AuthProvider.');
    return (
      <div className="font-roboto bg-gray-100 min-h-screen flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Error</h2>
          <p className="text-red-500">Authentication context is unavailable. Please check app configuration.</p>
        </div>
      </div>
    );
  }

  const { login } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Login failed');
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="font-roboto bg-gray-100 min-h-screen flex items-center justify-center py-12">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <motion.div
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Log In to SkillSync
        </h2>
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center mb-4" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="••••••••"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md"
            aria-label="Log in"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold" aria-label="Navigate to signup">
              Sign Up
            </Link>
          </p>
          <p className="text-gray-600 mt-2">
            <Link to="/forgot-password" className="text-blue-600 hover:underline font-semibold" aria-label="Navigate to forgot password">
              Forgot Password?
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;