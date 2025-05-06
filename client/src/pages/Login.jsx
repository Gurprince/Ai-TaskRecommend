import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Login.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
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
      <div className="login-container">
        <div className="login-form text-center">
          <h2 className="login-title">Error</h2>
          <p className="login-error">Authentication context is unavailable. Please check app configuration.</p>
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
    <div className="login-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <motion.div
        className="login-form"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="login-title">Log In to SkillSync</h2>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
          <div>
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
              placeholder="••••••••"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="login-button"
            aria-label="Log in"
          >
            Log In
          </button>
        </form>
        <div className="login-links">
          <p>
            Don’t have an account?{' '}
            <Link to="/signup" className="login-link" aria-label="Navigate to signup">
              Sign Up
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/forgot-password" className="login-link" aria-label="Navigate to forgot password">
              Forgot Password?
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;