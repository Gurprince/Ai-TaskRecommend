import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AcceptedTasks.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const AcceptedTasks = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const navigate = useNavigate();

  // Check for token and fetch tasks on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    fetchAcceptedTasks(token);
  }, [navigate]);

  // Fetch accepted tasks
  const fetchAcceptedTasks = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/accepted`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupedTasks(response.data);
    } catch (err) {
      console.error('Error fetching accepted tasks:', err);
      setError('Failed to load accepted tasks');
      toast.error('Failed to load accepted tasks');
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      fetchAcceptedTasks(token);
      setShowDeleteModal(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error(err.response?.data?.message || 'Failed to delete task');
      setShowDeleteModal(null);
    }
  };

  // Sort and filter tasks
  const getSortedAndFilteredTasks = (tasks) => {
    let filteredTasks = [...tasks];
    if (filterLevel !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.skillLevel === filterLevel);
    }
    if (sortBy === 'estimatedTime') {
      filteredTasks.sort((a, b) => a.estimatedTime - b.estimatedTime);
    } else if (sortBy === 'skillLevel') {
      const levelOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      filteredTasks.sort((a, b) => levelOrder[a.skillLevel] - levelOrder[b.skillLevel]);
    }
    return filteredTasks;
  };

  return (
    <div className="accepted-tasks-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="accepted-tasks-title">Accepted Tasks</h1>
      {error && (
        <p className="accepted-tasks-error" role="alert">
          {error}
        </p>
      )}
      <div className="accepted-tasks-filter flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="accepted-tasks-label">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="accepted-tasks-select"
            aria-label="Sort tasks"
          >
            <option value="none">None</option>
            <option value="estimatedTime">Estimated Time</option>
            <option value="skillLevel">Skill Level</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="accepted-tasks-label">Filter Level</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="accepted-tasks-select"
            aria-label="Filter by skill level"
          >
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      {Object.keys(groupedTasks).length === 0 ? (
        <motion.div
          className="accepted-tasks-no-tasks"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <p className="accepted-tasks-no-tasks-text">
            No accepted tasks yet. Start by accepting tasks from the Task Recommendation page.
          </p>
          <button
            onClick={() => navigate('/tasks')}
            className="accepted-tasks-browse-button"
            aria-label="Go to task recommendation page"
          >
            Browse Tasks
          </button>
        </motion.div>
      ) : (
        <div className="space-y-8 max-w-[100%] mx-auto flex flex-col gap-10 px-4">
          {Object.entries(groupedTasks).map(([skill, tasks]) => (
            <motion.div
              key={skill}
              className="accepted-tasks-card"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h2 className="accepted-tasks-skill-title">{skill}</h2>
              <ul className="space-y-4" aria-live="polite">
                {getSortedAndFilteredTasks(tasks).map((task) => (
                  <li key={task._id} className="accepted-tasks-task">
                    <div className="space-y-4">
                      <div>
                        <p className="accepted-tasks-task-title">{task.description}</p>
                        <p className="accepted-tasks-text mt-1">{task.detailedDescription}</p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
                        </p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Level:</span> {task.skillLevel}
                        </p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Goal:</span> {task.goal}
                        </p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Type:</span> {task.type}
                        </p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Tags:</span> {task.tags.join(', ')}
                        </p>
                        <p className="accepted-tasks-text">
                          <span className="font-medium">Resources:</span>
                        </p>
                        <ul className="list-disc pl-5 accepted-tasks-text">
                          {task.resources.map((resource, index) => (
                            <li key={index}>
                              {resource.startsWith('http') ? (
                                <a
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="accepted-tasks-resource-link"
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
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <button
                          onClick={() => navigate(`/tasks/${task._id}/analyze`)}
                          className="flex-1 accepted-tasks-analyze-button"
                          aria-label={`Analyze task: ${task.description}`}
                        >
                          Analyze Task
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(task._id)}
                          className="flex-1 accepted-tasks-delete-button"
                          aria-label={`Delete task: ${task.description}`}
                        >
                          Delete Task
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
      {showDeleteModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="accepted-tasks-modal">
            <h3 className="accepted-tasks-modal-title">Confirm Deletion</h3>
            <p className="accepted-tasks-modal-text">Are you sure you want to delete this task?</p>
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 accepted-tasks-modal-cancel"
                aria-label="Cancel deletion"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTask(showDeleteModal)}
                className="flex-1 accepted-tasks-delete-button"
                aria-label="Confirm deletion"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AcceptedTasks;