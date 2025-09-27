import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Your Dashboard</h1>
        <p>Select an option to get started.</p>
      </header>
      <div className={styles.cardContainer}>
        <a href="/" className={styles.card}>
          <h2>New Whiteboard</h2>
          <p>Start with a fresh, blank canvas.</p>
        </a>
        <div className={`${styles.card} ${styles.disabled}`}>
          <h2>My Saved Boards</h2>
          <p>View your saved projects (coming soon).</p>
        </div>
      </div>
    </div>
  );
};

export default Home;