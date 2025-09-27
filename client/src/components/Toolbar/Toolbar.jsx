// src/components/Toolbar/Toolbar.jsx

import React from 'react';
import styles from './Toolbar.module.css';

const Toolbar = ({ setColor, setBrushSize, onClear }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.tool}>
        <label htmlFor="color">Color</label>
        <input 
          type="color" 
          id="color" 
          onChange={(e) => setColor(e.target.value)} 
        />
      </div>
      <div className={styles.tool}>
        <label htmlFor="brushSize">Brush Size</label>
        <input 
          type="range" 
          id="brushSize" 
          min="1" 
          max="100" 
          onChange={(e) => setBrushSize(e.target.value)} 
        />
      </div>

      {/* --- Added Clear Button --- */}
      <div className={styles.tool}>
        <button onClick={onClear}>Clear</button>
      </div>
      
    </div>
  );
};

export default Toolbar;