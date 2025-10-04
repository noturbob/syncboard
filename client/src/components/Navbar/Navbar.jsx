import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out on server:', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav 
      className="absolute top-5 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl py-2 px-6 box-border flex justify-between items-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg"
      ref={menuRef}
    >
      <Link to="/" className="text-2xl font-bold text-highlight">
      <p>
        <span className="text-highlight">Sync</span>Board
      </p>
      </Link>
      <div className="relative flex items-center gap-4">
        <img 
          src="https://i.pravatar.cc/150?img=3" 
          alt="Profile" 
          className="w-10 h-10 rounded-full border-2 border-white/30 cursor-pointer" 
        />
        <div className="cursor-pointer flex flex-col gap-1.5 p-1" onClick={() => setIsOpen(!isOpen)}>
          <div className="w-6 h-0.5 bg-highlight rounded-full"></div>
          <div className="w-6 h-0.5 bg-highlight rounded-full"></div>
          <div className="w-6 h-0.5 bg-highlight rounded-full"></div>
        </div>
        {isOpen && (
          <div className="absolute top-full mt-3 right-0 w-48 py-2 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl flex flex-col">
            <Link to="/profile" className="px-4 py-2 text-highlight hover:bg-white/10 transition-colors" onClick={() => setIsOpen(false)}>Profile</Link>
            <Link to="/dashboard" className="px-4 py-2 text-highlight hover:bg-white/10 transition-colors" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/settings" className="px-4 py-2 text-highlight hover:bg-white/10 transition-colors" onClick={() => setIsOpen(false)}>Settings</Link>
            <div className="h-px bg-white/20 my-2"></div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-left w-full px-4 py-2 text-highlight hover:bg-white/10 transition-colors">Logout</button>
            ) : (
              <Link to="/login" className="px-4 py-2 text-highlight hover:bg-white/10 transition-colors" onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;