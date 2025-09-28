import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // This effect closes the menu if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar} ref={menuRef}>
      <Link to="/home" className={styles.brand}>
        Syncboard
      </Link>
      <div className={styles.hamburgerContainer}>
        {/* --- Added Profile Picture --- */}
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
            <Link to="/login" className={styles.menuLink}>Logout</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;