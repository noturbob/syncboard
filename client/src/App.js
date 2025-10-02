import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import WhiteboardPage from './components/WhiteboardPage/WhiteboardPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/Forgot/Forgot';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Projects from './components/Projects/Projects';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CreateCoBoard from './components/CreateCoBoard/CreateCoBoard';
import { AuthProvider } from './context/AuthContext'

const AppLayout = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/whiteboard');

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* --- Protected Routes --- */}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
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