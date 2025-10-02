import React from 'react';
import styles from './Toolbar.module.css';

const Toolbar = ({ setColor, setBrushSize, setTool, activeTool, onClear }) => {
  const tools = ['pencil', 'line', 'rectangle', 'circle', 'eraser'];

  return (
    <div className={styles.toolbar}>
      {/* Tool Selection */}
      <div className={styles.toolSection}>
        {tools.map(tool => (
          <button 
            key={tool}
            className={`${styles.toolButton} ${activeTool === tool ? styles.active : ''}`}
            onClick={() => setTool(tool)}
            title={tool.charAt(0).toUpperCase() + tool.slice(1)}
          >
            {/* You can replace these with actual icons later */}
            {tool.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>

      <div className={styles.divider}></div>

      {/* Color and Brush Size */}
      <div className={styles.toolSection}>
        <div className={styles.tool}>
          <label htmlFor="color">Color</label>
          <input 
            type="color" 
            id="color" 
            onChange={(e) => setColor(e.target.value)} 
          />
        </div>
        <div className={styles.tool}>
          <label htmlFor="brushSize">Size</label>
          <input 
            type="range" 
            id="brushSize" 
            min="1" 
            max="100" 
            defaultValue="5"
            onChange={(e) => setBrushSize(e.target.value)} 
          />
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Actions */}
      <div className={styles.toolSection}>
        <button className={styles.actionButton} onClick={onClear}>Clear</button>
      </div>
    </div>
  );
};

export default Toolbar;