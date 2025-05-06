import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AnalyzeTask.css';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

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
      <motion.div
        className="analyze-task-loading"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <svg className="animate-spin h-8 w-8 text-#8C49E9 mr-2 analyze-task-spinner" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading task...
      </motion.div>
    );
  }

  return (
    <div className="analyze-task-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h1 className="analyze-task-title">Analyze Task: {task.description}</h1>
      {error && (
        <p className="analyze-task-error max-w-4xl mx-auto" role="alert">
          {error}
        </p>
      )}

      {/* Task Details Card */}
      <motion.div
        className="analyze-task-card max-w-[100%] mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="analyze-task-card-title">Task Details</h2>
        <div className="space-y-3">
          <p className="analyze-task-text text-white">{task.detailedDescription}</p>
          <p className="analyze-task-text text-white">
            <span className="font-medium ">Skill:</span> {task.skill}
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium">Estimated Time:</span> {task.estimatedTime} hours
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium">Level:</span> {task.skillLevel}
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium text-white">Goal:</span> {task.goal}
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium text-white">Type:</span> {task.type}
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium text-white">Tags:</span> {task.tags.join(', ')}
          </p>
          <p className="analyze-task-text text-white">
            <span className="font-medium">Resources:</span>
          </p>
          <ul className="list-disc pl-5 analyze-task-text">
            {task.resources.map((resource, index) => (
              <li key={index}>
                {resource.startsWith('http') ? (
                  <a
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="analyze-task-resource-link"
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

      {/* Submission Form Card */}
      <motion.div
        className="analyze-task-card max-w-[100%] mx-auto text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="analyze-task-card-title">Submit Your Work</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="analyze-task-label">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="analyze-task-file-input"
              aria-label="Upload file for task analysis"
              accept=".txt,.py,.js,.html,.css"
            />
            {file && (
              <p className="mt-2 analyze-task-text">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <div>
            <label className="analyze-task-label">Or Enter Text</label>
            <textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="analyze-task-textarea"
              placeholder="Paste your work here (e.g., code, text, or notes)..."
              aria-label="Enter text for task analysis"
              rows="6"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 analyze-task-submit-button"
              aria-label="Submit for analysis"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white inline" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Submission'
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 analyze-task-clear-button"
              aria-label="Clear form inputs"
            >
              Clear
            </button>
          </div>
        </form>
      </motion.div>

      {/* Analysis Feedback Card */}
      {analysisResult && (
        <motion.div
          className="analyze-task-card max-w-[100%] mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          aria-live="polite"
        >
          <h2 className="analyze-task-card-title">Analysis Feedback</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <span
                className={`analyze-task-score ${
                  analysisResult.score > 80
                    ? 'analyze-task-score-high'
                    : analysisResult.score > 50
                    ? 'analyze-task-score-medium'
                    : 'analyze-task-score-low'
                }`}
              >
                Score: {analysisResult.score}/100
              </span>
            </div>
            <div>
              <p className="analyze-task-text font-bold text-xl text-purple-600">Strengths:</p>
              <p className="analyze-task-text text-white">{analysisResult.feedback.strengths}</p>
            </div>
            <div>
              <p className="analyze-task-text font-bold text-xl text-purple-600">Weaknesses:</p>
              <p className="analyze-task-text text-white">{analysisResult.feedback.weaknesses}</p>
            </div>
            <div>
              <p className="analyze-task-text font-bold text-xl text-purple-600">Suggestions:</p>
              <p className="analyze-task-text text-white">{analysisResult.feedback.suggestions}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/accepted-tasks')}
          className="analyze-task-back-button"
          aria-label="Back to accepted tasks"
        >
          Back to Accepted Tasks
        </button>
      </div>
    </div>
  );
};

export default AnalyzeTask;