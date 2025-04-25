import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AcceptedTasks = () => {
  const [groupedTasks, setGroupedTasks] = useState({});
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [filterLevel, setFilterLevel] = useState('all');
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
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Task deleted successfully');
      // Refresh tasks
      fetchAcceptedTasks(token);
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error(err.response?.data?.message || 'Failed to delete task');
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
    <div className="container mx-auto p-6 max-w-4xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Accepted Tasks</h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center" role="alert">
          {error}
        </p>
      )}
      <div className="mb-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label="Sort tasks"
          >
            <option value="none">None</option>
            <option value="estimatedTime">Estimated Time</option>
            <option value="skillLevel">Skill Level</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Level</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
        <div className="bg-white shadow-md rounded-lg p-6 text-center animate-fade-in">
          <p className="text-gray-600 mb-4">
            No accepted tasks yet. Start by accepting tasks from the Task Recommendation page.
          </p>
          <button
            onClick={() => navigate('/tasks')}
            className="py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            aria-label="Go to task recommendation page"
          >
            Browse Tasks
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTasks).map(([skill, tasks]) => (
            <div key={skill} className="bg-white shadow-md rounded-lg p-6 animate-fade-in">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{skill}</h2>
              <ul className="space-y-4" aria-live="polite">
                {getSortedAndFilteredTasks(tasks).map((task) => (
                  <li
                    key={task._id}
                    className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition duration-200"
                  >
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-gray-800">{task.description}</p>
                        <p className="text-sm text-gray-600 mt-1">{task.detailedDescription}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Level:</span> {task.skillLevel}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Goal:</span> {task.goal}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Type:</span> {task.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Tags:</span> {task.tags.join(', ')}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Resources:</span>
                        </p>
                        <ul className="list-disc pl-5 text-sm text-gray-500">
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
                      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                        <button
                          onClick={() => navigate(`/tasks/${task._id}/analyze`)}
                          className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                          aria-label={`Analyze task: ${task.description}`}
                        >
                          Analyze Task
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="flex-1 py-3 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                          aria-label={`Delete task: ${task.description}`}
                        >
                          Delete Task
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedTasks;