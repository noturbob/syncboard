import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Placeholder data - later, this will come from your API
  const metrics = {
    boardsCreated: 12,
    sessionsJoined: 5,
    lastEdited: '2 hours ago',
  };

  const recentProjects = [
    { id: 1, name: 'Project Alpha' },
    { id: 2, name: 'Team Brainstorm' },
    { id: 3, name: 'UI/UX Mockups' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <p>Here's a summary of your activity on Syncboard.</p>
      </header>

      {/* Metrics Section */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h2>{metrics.boardsCreated}</h2>
          <p>Boards Created</p>
        </div>
        <div className={styles.metricCard}>
          <h2>{metrics.sessionsJoined}</h2>
          <p>Sessions Joined</p>
        </div>
        <div className={styles.metricCard}>
          <h2>{metrics.lastEdited}</h2>
          <p>Last Edited</p>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className={styles.projectsSection}>
        <h2>Recent Projects</h2>
        <div className={styles.projectsGrid}>
          {recentProjects.map(project => (
            <div key={project.id} className={styles.projectCard}>
              <h3>{project.name}</h3>
              <button>Open</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;