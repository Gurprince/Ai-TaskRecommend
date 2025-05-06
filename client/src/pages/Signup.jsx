import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Signup.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  // Fallback for undefined context
  if (!authContext) {
    console.error('AuthContext is undefined. Ensure Signup is wrapped in AuthProvider.');
    return (
      <div className="signup-container">
        <div className="signup-form text-center">
          <h2 className="signup-title">Error</h2>
          <p className="signup-error">Authentication context is unavailable. Please check app configuration.</p>
        </div>
      </div>
    );
  }

  const { signup } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(name, email, password);
      toast.success('Signed up successfully!');
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Signup failed');
      toast.error(err.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <motion.div
        className="signup-form"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="signup-title">Sign Up for SkillSync</h2>
        {error && (
          <p className="signup-error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Signup form">
          <div>
            <label htmlFor="name" className="signup-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="signup-input"
              placeholder="Your Name"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="email" className="signup-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signup-input"
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="signup-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-input"
              placeholder="••••••••"
              aria-required="true"
            />
          </div>
          <button
            type="submit"
            className="signup-button"
            aria-label="Sign up"
          >
            Sign Up
          </button>
        </form>
        <div className="signup-links">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="signup-link" aria-label="Navigate to login">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;