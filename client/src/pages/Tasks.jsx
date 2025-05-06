import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark, faClock, faTag, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import NoTasksSvg from '../assets/no-tasks.svg';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';
import '../styles/Tasks.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Tasks = () => {
  const [skill, setSkill] = useState('');
  const [time, setTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTasks, setExpandedTasks] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);
  const navigate = useNavigate();

  // Check for token and fetch tasks
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchTasks(token);
  }, [navigate]);

  // Fetch pending tasks
  const fetchTasks = async (token) => {
    setFetchingTasks(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setFetchingTasks(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const token = localStorage.getItem('token');

    if (!skill.trim() || !time) {
      setError('Please enter a skill and time');
      setIsLoading(false);
      toast.error('Please enter a skill and time');
      return;
    }

    if (parseInt(time) < 1) {
      setError('Time must be at least 1 hour');
      setIsLoading(false);
      toast.error('Time must be at least 1 hour');
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/recommend`,
        { skill, time: parseInt(time) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([...tasks, response.data]);
      setSkill('');
      setTime('');
      toast.success('Task generated successfully!');
    } catch (err) {
      console.error('Error recommending task:', err);
      setError(err.response?.data?.message || 'Failed to generate task');
      toast.error(err.response?.data?.message || 'Failed to generate task');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task acceptance
  const handleAccept = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task accepted!');
    } catch (err) {
      console.error('Error accepting task:', err);
      setError('Failed to accept task');
      toast.error('Failed to accept task');
    }
  };

  // Handle task rejection
  const handleReject = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success('Task rejected!');
      setShowRejectModal(null);
    } catch (err) {
      console.error('Error rejecting task:', err);
      setError('Failed to reject task');
      toast.error('Failed to reject task');
      setShowRejectModal(null);
    }
  };

  // Toggle task expansion
  const toggleTask = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter tasks by search query
  const filteredTasks = tasks.filter((task) =>
    [task.skill, task.description, ...task.tags]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Consistent skill color coding with purple-based gradients
  const getSkillColor = (skill) => {
    const hash = skill.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'bg-gradient-to-r from-purple-600 to-purple-700 text-white',
      'bg-gradient-to-r from-purple-700 to-purple-800 text-white',
      'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
      'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white',
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'bg-gradient-to-r from-blue-600 to-blue-700 text-white',
      'bg-gradient-to-r from-violet-500 to-violet-600 text-white',
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="tasks-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="tasks-title">Task Recommendation</h1>

      {/* Form */}
      <motion.div
        className="tasks-form"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <form onSubmit={handleSubmit} aria-label="Task recommendation form" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="skill" className="tasks-label">
                Skill
              </label>
              <input
                id="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="tasks-input"
                placeholder="e.g., Python, Design"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="time" className="tasks-label">
                Available Time (hours)
              </label>
              <input
                id="time"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="tasks-input"
                placeholder="e.g., 4"
                min="1"
                aria-required="true"
              />
            </div>
          </div>
          {error && (
            <p className="tasks-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="tasks-button flex gap-2"
            aria-label="Generate task recommendation"
          >
            {isLoading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isLoading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </form>
      </motion.div>

      {/* Search Bar */}
      <div className="tasks-search">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="tasks-search-input"
          placeholder="Search tasks by skill, description, or tags..."
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="tasks-search-clear"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="max-w-[100%] ">
        <h2 className="tasks-list-title">Generated Tasks</h2>
        {fetchingTasks ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-3 w-3 text-#8C49E9" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredTasks.length === 0 ? (
          <motion.div
            className="tasks-no-tasks max-w-[100%] flex flex-col justify-center items-center gap-1"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <img src={NoTasksSvg} alt="No tasks available" className="w-35 h-35 mx-auto mb-6" />
            <p className="tasks-no-tasks-text">
              {searchQuery ? 'No tasks match your search.' : 'No tasks yet! Try generating one above.'}
            </p>
            <button
              onClick={() => document.getElementById('skill').focus()}
              className="tasks-button"
              aria-label="Generate a new task"
            >
              Generate Task
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
            {filteredTasks.map((task) => (
              <motion.div
                key={task._id}
                className="tasks-card"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="tasks-card-title">{task.description}</h3>
                    <span
                      className={`tasks-skill-tag ${getSkillColor(task.skill)}`}
                      aria-label={`Skill: ${task.skill}`}
                    >
                      {task.skill}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTask(task._id)}
                    className="tasks-expand-button"
                    aria-label={expandedTasks[task._id] ? 'Collapse task details' : 'Expand task details'}
                  >
                    <FontAwesomeIcon
                      icon={expandedTasks[task._id] ? faChevronUp : faChevronDown}
                      className="text-#D4D4D4"
                    />
                  </button>
                </div>

                {/* Body */}
                <div className="tasks-text space-y-3">
                  <p className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="tasks-icon" />
                    <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
                  </p>
                  {expandedTasks[task._id] && (
                    <motion.div
                      className="mt-4 space-y-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="tasks-text">{task.detailedDescription}</p>
                      <p className="flex items-center">
                        <FontAwesomeIcon icon={faTag} className="tasks-icon" />
                        <span className="font-medium">Level:</span> {task.skillLevel}
                      </p>
                      <p><span className="font-medium">Goal:</span> {task.goal}</p>
                      <p><span className="font-medium">Type:</span> {task.type}</p>
                      <p><span className="font-medium">Tags:</span> {task.tags.join(', ')}</p>
                      <div>
                        <p className="font-medium">Resources:</p>
                        <ul className="list-disc pl-5 tasks-text">
                          {task.resources.map((resource, index) => (
                            <li key={index}>
                              {resource.startsWith('http') ? (
                                <a
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tasks-resource-link"
                                >
                                  {resource}
                                </a>
                              ) : (
                                resource
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-6">
                  <button
                    onClick={() => handleAccept(task._id)}
                    className="flex-1 tasks-accept-button"
                    data-tooltip-id={`accept-${task._id}`}
                    data-tooltip-content="Accept this task"
                    aria-label={`Accept task: ${task.description}`}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Accept
                  </button>
                  <Tooltip id={`accept-${task._id}`} className="bg-#28292A text-#D4D4D4 border border-#4A4B4C" />
                  <button
                    onClick={() => setShowRejectModal(task._id)}
                    className="flex-1 tasks-reject-button"
                    data-tooltip-id={`reject-${task._id}`}
                    data-tooltip-content="Reject this task"
                    aria-label={`Reject task: ${task.description}`}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
                    Reject
                  </button>
                  <Tooltip id={`reject-${task._id}`} className="bg-#28292A text-#D4D4D4 border border-#4A4B4C" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="tasks-modal">
            <h3 className="tasks-modal-title">Confirm Rejection</h3>
            <p className="tasks-modal-text">Are you sure you want to reject this task?</p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-end">
              <button
                onClick={() => setShowRejectModal(null)}
                className="flex-1 tasks-modal-cancel"
                aria-label="Cancel rejection"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="flex-1 tasks-reject-button"
                aria-label="Confirm rejection"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Tasks;