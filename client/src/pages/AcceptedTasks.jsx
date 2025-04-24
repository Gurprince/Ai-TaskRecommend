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

  // Handle task completion
  const handleComplete = async (taskId, completed) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${taskId}/complete`,
        { completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGroupedTasks((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((skill) => {
          updated[skill] = updated[skill].map((task) =>
            task._id === taskId ? { ...task, completed: response.data.completed } : task
          );
        });
        return updated;
      });
      toast.success(completed ? 'Task marked as completed!' : 'Task marked as incomplete!');
    } catch (err) {
      console.error('Error updating task completion:', err);
      setError('Failed to update task completion');
      toast.error('Failed to update task completion');
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
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Accepted Tasks</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4 flex space-x-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="none">None</option>
            <option value="estimatedTime">Estimated Time</option>
            <option value="skillLevel">Skill Level</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filter Level</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>
      {Object.keys(groupedTasks).length === 0 ? (
        <p>No accepted tasks yet. Accept tasks from the Task Recommendation page.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([skill, tasks]) => (
            <div key={skill}>
              <h2 className="text-xl font-semibold mb-2">{skill}</h2>
              <ul className="space-y-4">
                {getSortedAndFilteredTasks(tasks).map((task) => (
                  <li key={task._id} className="p-4 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{task.description}</p>
                        <p className="text-sm text-gray-600 mt-1">{task.detailedDescription}</p>
                        <p className="text-sm text-gray-500 mt-2">Estimated Time: {task.estimatedTime} hours</p>
                        <p className="text-sm text-gray-500">Level: {task.skillLevel}</p>
                        <p className="text-sm text-gray-500">Goal: {task.goal}</p>
                        <p className="text-sm text-gray-500">Type: {task.type}</p>
                        <p className="text-sm text-gray-500">Tags: {task.tags.join(', ')}</p>
                        <p className="text-sm text-gray-500">Resources:</p>
                        <ul className="list-disc pl-5 text-sm text-gray-500">
                          {task.resources.map((resource, index) => (
                            <li key={index}>
                              {resource.startsWith('http') ? (
                                <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                  {resource}
                                </a>
                              ) : (
                                resource
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => handleComplete(task._id, !task.completed)}
                        className="h-5 w-5"
                      />
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