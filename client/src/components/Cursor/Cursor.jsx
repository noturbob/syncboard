import React from 'react';
import styles from './Cursor.module.css';

const Cursor = ({ x, y, name, color }) => {
  return (
    <div className={styles.cursor} style={{ left: x, top: y }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill={color || '#007bff'}>
        <path d="M6.3,9.5l4.8,11.3c0.2,0.5,0.8,0.8,1.3,0.6c0.5-0.2,0.8-0.8,0.6-1.3L8.2,9.4L6.3,9.5z"/>
        <path d="M9.2,8.4l11.3-4.8c0.5-0.2,0.8-0.8,0.6-1.3c-0.2-0.5-0.8-0.8-1.3-0.6L8.4,6.5L9.2,8.4z"/>
      </svg>
      <div className={styles.name} style={{ backgroundColor: color || '#007bff' }}>
        {name || 'Anonymous'}
      </div>
    </div>
  );
};

export default Cursor;