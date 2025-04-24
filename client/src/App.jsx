import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import AcceptedTasks from './pages/AcceptedTasks';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/accepted-tasks" element={<AcceptedTasks />} />
        <Route path="/" element={<Tasks />} />
      </Routes>
    </Router>
  );
}

export default App;