import React from 'react';

const Toolbar = ({ setColor, setBrushSize, setTool, activeTool, onClear }) => {
  const tools = ['pencil', 'line', 'rectangle', 'circle', 'eraser'];

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 p-2 flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg">
      
      {/* Tool Selection */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
        {tools.map(tool => (
          <button 
            key={tool}
            className={`w-10 h-10 rounded-md flex justify-center items-center text-xl transition-colors
                        ${activeTool === tool ? 'bg-accent text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setTool(tool)}
            title={tool.charAt(0).toUpperCase() + tool.slice(1)}
          >
            {tool.charAt(0).toUpperCase()}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-gray-300"></div>

      {/* Color and Brush Size */}
      <div className="flex items-center gap-3 p-1">
        <div className="flex items-center gap-2">
          <label htmlFor="color" className="text-sm text-gray-600 font-medium">Color</label>
          <input 
            type="color" 
            id="color"
            className="w-8 h-8 bg-transparent border-none cursor-pointer"
            defaultValue="#000000"
            onChange={(e) => setColor(e.target.value)} 
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="brushSize" className="text-sm text-gray-600 font-medium">Size</label>
          <input 
            type="range" 
            id="brushSize" 
            min="1" 
            max="100" 
            defaultValue="5"
            className="w-24"
            onChange={(e) => setBrushSize(e.target.value)} 
          />
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-px h-8 bg-gray-300"></div>

      {/* Actions */}
      <div className="p-1">
        <button 
          onClick={onClear}
          className="px-3 h-10 rounded-md flex justify-center items-center text-gray-600 font-medium hover:bg-gray-200 hover:text-black transition-colors"
        >
          Clear
        </button>
      </div>

    </div>
  );
};

export default Toolbar;