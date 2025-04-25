import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark, faClock, faTag, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import NoTasksSvg from '../assets/no-tasks.svg';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tooltip/dist/react-tooltip.css';

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

  // Consistent skill color coding with gradients
  const getSkillColor = (skill) => {
    const hash = skill.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      'bg-gradient-to-r from-green-500 to-green-600 text-white',
      'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
      'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      'bg-gradient-to-r from-red-500 to-red-600 text-white',
      'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white',
      'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
      'bg-gradient-to-r from-teal-500 to-teal-600 text-white',
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
        Task Recommendation
      </h1>

      {/* Form */}
      <div className="bg-white shadow-xl rounded-xl p-8 mb-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <form onSubmit={handleSubmit} aria-label="Task recommendation form" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-2">
                Skill
              </label>
              <input
                id="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:shadow-md"
                placeholder="e.g., Python, Design"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Available Time (hours)
              </label>
              <input
                id="time"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 hover:shadow-md"
                placeholder="e.g., 4"
                min="1"
                aria-required="true"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 bg-red-100 p-3 rounded-lg text-center animate-pulse" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 flex items-center justify-center shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
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
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pr-10 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gradient-to-r from-gray-50 to-gray-100 transition duration-200 hover:shadow-md"
          placeholder="Search tasks by skill, description, or tags..."
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition duration-200"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Generated Tasks</h2>
        {fetchingTasks ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-xl p-8 text-center animate-fade-in">
            <img src={NoTasksSvg} alt="No tasks available" className="w-48 h-48 mx-auto mb-6" />
            <p className="text-gray-600 text-lg mb-6">
              {searchQuery ? 'No tasks match your search.' : 'No tasks yet! Try generating one above.'}
            </p>
            <button
              onClick={() => document.getElementById('skill').focus()}
              className="py-3 px-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg"
              aria-label="Generate a new task"
            >
              Generate Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-live="polite">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white shadow-md rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-gray-800">{task.description}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getSkillColor(task.skill)} hover:shadow-md transition duration-200`}
                      aria-label={`Skill: ${task.skill}`}
                    >
                      {task.skill}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTask(task._id)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-200"
                    aria-label={expandedTasks[task._id] ? 'Collapse task details' : 'Expand task details'}
                  >
                    <FontAwesomeIcon icon={expandedTasks[task._id] ? faChevronUp : faChevronDown} className="text-gray-600" />
                  </button>
                </div>

                {/* Body */}
                <div className="text-sm text-gray-600 space-y-3">
                  <p className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-600" />
                    <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
                  </p>
                  {expandedTasks[task._id] && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                      <p className="text-gray-700">{task.detailedDescription}</p>
                      <p className="flex items-center">
                        <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-600" />
                        <span className="font-medium">Level:</span> {task.skillLevel}
                      </p>
                      <p><span className="font-medium">Goal:</span> {task.goal}</p>
                      <p><span className="font-medium">Type:</span> {task.type}</p>
                      <p><span className="font-medium">Tags:</span> {task.tags.join(', ')}</p>
                      <div>
                        <p className="font-medium">Resources:</p>
                        <ul className="list-disc pl-5 text-gray-600">
                          {task.resources.map((resource, index) => (
                            <li key={index}>
                              {resource.startsWith('http') ? (
                                <a
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
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
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-6">
                  <button
                    onClick={() => handleAccept(task._id)}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 shadow-md hover:shadow-lg"
                    data-tooltip-id={`accept-${task._id}`}
                    data-tooltip-content="Accept this task"
                    aria-label={`Accept task: ${task.description}`}
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Accept
                  </button>
                  <Tooltip id={`accept-${task._id}`} className="bg-white text-blue-600 border border-blue-200 shadow-md" />
                  <button
                    onClick={() => setShowRejectModal(task._id)}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 shadow-md hover:shadow-lg"
                    data-tooltip-id={`reject-${task._id}`}
                    data-tooltip-content="Reject this task"
                    aria-label={`Reject task: ${task.description}`}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
                    Reject
                  </button>
                  <Tooltip id={`reject-${task._id}`} className="bg-white text-blue-600 border border-blue-200 shadow-md" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              Confirm Rejection
            </h3>
            <p className="text-gray-600 mb-6">Are you sure you want to reject this task?</p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-end">
              <button
                onClick={() => setShowRejectModal(null)}
                className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 shadow-md"
                aria-label="Cancel rejection"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 shadow-md hover:shadow-lg"
                aria-label="Confirm rejection"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;