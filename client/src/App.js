import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import WhiteboardPage from '../src/components/WhiteboardPage/WhiteboardPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/Forgot/Forgot';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Projects from './components/Projects/Projects';
import PrivateRoute from '../src/components/PrivateRoute/PrivateRoute';
import CreateCoBoard from './components/CreateCoBoard/CreateCoBoard';
import Profile from './components/Profile/Profile';
import Settings from './components/Settings/Settings';
import LandingPage from './components/LandingPage/LandingPage';
import './App.css';

const AppLayout = () => {
  const location = useLocation();
  // List of all public-facing pages where the main app Navbar should NOT be shown
  const publicPaths = ['/', '/login', '/signup', '/forgot', '/reset-password'];

  const showNavbar = !location.pathname.startsWith('/whiteboard') && !publicPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* --- Protected Routes --- */}
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/whiteboard" element={<PrivateRoute><WhiteboardPage /></PrivateRoute>} />
        <Route path="/whiteboard/:boardId" element={<PrivateRoute><WhiteboardPage /></PrivateRoute>} />
        <Route path="/create-coboard" element={<PrivateRoute><CreateCoBoard /></PrivateRoute>} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <div className="animated-background"></div>
          <AppLayout />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;