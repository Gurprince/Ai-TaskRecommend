import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnalyzeTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [file, setFile] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch task details
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTask(response.data);
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task');
        toast.error('Failed to load task');
      }
    };
    fetchTask();
  }, [id, navigate]);

  // Handle analysis submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !submissionText.trim()) {
      setError('Please upload a file or enter text');
      toast.error('Please upload a file or enter text');
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('submissionText', submissionText);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/${id}/analyze`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setAnalysisResult(response.data);
      if (response.data.score > 80) {
        toast.success('Task completed with high score!');
        // setTimeout(() => navigate('/accepted-tasks'), 2000);
      } else {
        toast.info('Task analyzed. Review the feedback below.');
      }
    } catch (err) {
      console.error('Error analyzing task:', err);
      setError(err.response?.data?.message || 'Failed to analyze task');
      toast.error(err.response?.data?.message || 'Failed to analyze task');
    } finally {
      setLoading(false);
    }
  };

  // Clear form inputs
  const handleClear = () => {
    setFile(null);
    setSubmissionText('');
    setError('');
  };

  if (!task) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Analyze Task: {task.description}</h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md mb-6 text-center" role="alert">
          {error}
        </p>
      )}

      {/* Task Details Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Task Details</h2>
        <div className="space-y-3">
          <p className="text-gray-600 leading-relaxed">{task.detailedDescription}</p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Skill:</span> {task.skill}
          </p>
          <p className="text-sm text-gray-500">
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
      </div>

      {/* Submission Form Card */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Submit Your Work</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              aria-label="Upload file for task analysis"
              accept=".txt,.py,.js,.html,.css"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Text</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Paste your work here (e.g., code, text, or notes)..."
              aria-label="Enter text for task analysis"
              rows="6"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Submit for analysis"
            >
              {loading ? 'Analyzing...' : 'Analyze Submission'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200"
              aria-label="Clear form inputs"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Feedback Card */}
      {analysisResult && (
        <div
          className="bg-white shadow-md rounded-lg p-6 animate-fade-in"
          aria-live="polite"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analysis Feedback</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <span
                className={`inline-block px-4 py-2 rounded-full text-white font-semibold ${
                  analysisResult.score > 80
                    ? 'bg-green-500'
                    : analysisResult.score > 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              >
                Score: {analysisResult.score}/100
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Strengths:</p>
              <p className="text-gray-600">{analysisResult.feedback.strengths}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Weaknesses:</p>
              <p className="text-gray-600">{analysisResult.feedback.weaknesses}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Suggestions:</p>
              <p className="text-gray-600">{analysisResult.feedback.suggestions}</p>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/accepted-tasks')}
          className="py-3 px-6 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
          aria-label="Back to accepted tasks"
        >
          Back to Accepted Tasks
        </button>
      </div>
    </div>
  );
};

export default AnalyzeTask;