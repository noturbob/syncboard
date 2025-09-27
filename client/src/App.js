// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WhiteboardPage from './components/WhiteboardPage/WhiteboardPage';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Forgot from './components/Forgot/Forgot';
import Home from './components/Home/Home'
import ResetPassword from './components/ResetPassword/ResetPassword';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<WhiteboardPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/home" element={<Home />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;