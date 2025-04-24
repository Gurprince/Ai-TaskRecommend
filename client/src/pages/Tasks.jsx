import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark, faChevronDown, faChevronUp, faClock, faTag } from '@fortawesome/free-solid-svg-icons';
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

  // Filter tasks by search query
  const filteredTasks = tasks.filter((task) =>
    [task.skill, task.description, ...task.tags]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Consistent skill color coding
  const getSkillColor = (skill) => {
    const hash = skill.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-teal-100 text-teal-800 border-teal-200',
    ];
    return colors[hash % colors.length];
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-8xl min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Recommendation</h1>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit} aria-label="Task recommendation form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                Skill
              </label>
              <input
                id="skill"
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., Python, Design"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Available Time (hours)
              </label>
              <input
                id="time"
                type="number"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., 4"
                min="1"
                aria-required="true"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4 animate-pulse">{error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Generate task recommendation"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {isLoading ? 'Generating...' : 'Get Recommendation'}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          placeholder="Search tasks by skill, description, or tags..."
          aria-label="Search tasks"
        />
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Tasks</h2>
        {fetchingTasks ? (
          <div className="flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img src={NoTasksSvg} alt="No tasks available" className="w-48 h-48 mb-4" />
            <p className="text-gray-500 text-lg italic">
              {searchQuery ? 'No tasks match your search.' : 'No tasks yet! Try generating one above.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white shadow-md rounded-lg p-6 relative overflow-hidden border-l-4 border-gradient-to-r from-blue-500 to-blue-600 animate-fade-in"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-gray-800">{task.description}</h3>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${getSkillColor(task.skill)} hover:shadow-md transition cursor-default`}
                      aria-label={`Skill: ${task.skill}`}
                    >
                      {task.skill}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleTask(task._id)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                    aria-label={expandedTasks[task._id] ? 'Collapse task details' : 'Expand task details'}
                  >
                    <FontAwesomeIcon icon={expandedTasks[task._id] ? faChevronUp : faChevronDown} className="text-gray-600" />
                  </button>
                </div>

                {/* Body */}
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-2 text-blue-500" />
                    <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
                  </p>
                  {expandedTasks[task._id] && (
                    <div className="mt-3 space-y-3 transition-all duration-300">
                      <p className="text-gray-700">{task.detailedDescription}</p>
                      <p className="flex items-center">
                        <FontAwesomeIcon icon={faTag} className="mr-2 text-blue-500" />
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
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => handleAccept(task._id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:scale-105 transition-transform flex items-center"
                    data-tooltip-id={`accept-${task._id}`}
                    data-tooltip-content="Accept this task"
                    aria-label="Accept task"
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Accept
                  </button>
                  <Tooltip id={`accept-${task._id}`} className="bg-white text-blue-600 border border-blue-200" />
                  <button
                    onClick={() => setShowRejectModal(task._id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:scale-105 transition-transform flex items-center"
                    data-tooltip-id={`reject-${task._id}`}
                    data-tooltip-content="Reject this task"
                    aria-label="Reject task"
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
                    Reject
                  </button>
                  <Tooltip id={`reject-${task._id}`} className="bg-white text-blue-600 border border-blue-200" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to reject this task?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                aria-label="Cancel rejection"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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