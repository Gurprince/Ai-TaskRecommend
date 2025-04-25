import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import AcceptedTasks from './pages/AcceptedTasks';
import AnalyzeTask from './pages/AnalyzeTask';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/home' element={<Home/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/accepted-tasks" element={<AcceptedTasks />} />
          <Route path="/tasks/:id/analyze" element={<AnalyzeTask />} />
          <Route path="/" element={<Tasks />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;