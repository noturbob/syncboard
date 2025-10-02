import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Make sure you have your api helper
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
      // Call the backend to blacklist the token before clearing it locally
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Error logging out on server', err);
    } finally {
      // Always perform client-side logout
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className={styles.navbar} ref={menuRef}>
      <Link to="/home" className={styles.brand}>
        Syncboard
      </Link>
      <div className={styles.hamburgerContainer}>
        <img 
          src="https://i.pravatar.cc/150?img=3" 
          alt="Profile" 
          className={styles.profilePic} 
        />
        <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        {isOpen && (
          <div className={styles.menu}>
            <Link to="/dashboard" className={styles.menuLink}>Dashboard</Link>
            <Link to="/profile" className={styles.menuLink}>Profile</Link>
            <Link to="/settings" className={styles.menuLink}>Settings</Link>
            <div className={styles.divider}></div>
            {/* Changed to a button with an onClick handler */}
            <button onClick={handleLogout} className={styles.menuLink}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;