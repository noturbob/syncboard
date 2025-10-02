import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import WhiteboardPage from '../src/components/WhiteboardPage/WhiteboardPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/Forgot/Forgot';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Projects from './components/Projects/Projects';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/whiteboard');

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Route for a new, blank whiteboard */}
        <Route path="/whiteboard" element={<WhiteboardPage />} />
        {/* Route for opening a specific, saved whiteboard */}
        <Route path="/whiteboard/:boardId" element={<WhiteboardPage />} />
        <Route path="./home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout />
      </div>
    </Router>
  );
}

export default App;