import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Syncboard</h1>
        <p>Choose an option to begin collaborating.</p>
      </header>
      <div className={styles.cardContainer}>
        <Link to="/whiteboard" className={styles.card}>
          <h2>Create New Board</h2>
          <p>Start a solo project on a fresh canvas.</p>
        </Link>
        <Link to="/create-coboard" className={styles.card}>
          <h2>Create a Co-board</h2>
          <p>Generate an invite link to collaborate in real-time.</p>
        </Link>
        <Link to="/projects" className={styles.card}>
          <h2>Projects</h2>
          <p>View and manage your saved boards.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;