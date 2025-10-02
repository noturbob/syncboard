import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import styles from './Navbar.module.css';

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
    <nav className={styles.navbar} ref={menuRef}>
      <Link to="/" className={styles.brand}>
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
            <Link to="/dashboard" className={styles.menuLink} onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link to="/projects" className={styles.menuLink} onClick={() => setIsOpen(false)}>Projects</Link>
            <Link to="/settings" className={styles.menuLink} onClick={() => setIsOpen(false)}>Settings</Link>
            <div className={styles.divider}></div>
            {isAuthenticated ? (
              <button onClick={handleLogout} className={styles.menuLink}>Logout</button>
            ) : (
              <Link to="/login" className={styles.menuLink} onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;