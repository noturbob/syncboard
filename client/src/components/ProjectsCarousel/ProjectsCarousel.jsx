import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ProjectsCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const refreshProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/boards');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    if (projects.length > 3) {
      setCurrentIndex((prev) => (prev < projects.length - 3 ? prev + 1 : prev));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-subtle text-xl">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-highlight font-sans">
          Your <span className="text-accent">Projects</span>
        </h1>
      </header>

      {projects.length === 0 ? (
        <p className="text-subtle text-xl">You haven't created any boards yet.</p>
      ) : (
        <div className="relative w-full max-w-6xl">
          <div className="overflow-hidden">
            <div className="flex gap-8 transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}>
              {projects.map((project) => (
                <Card key={project._id} card={project} onRefresh={refreshProjects} />
              ))}
            </div>
          </div>
          <button onClick={handlePrev} className="absolute top-1/2 -translate-y-1/2 left-0 -ml-12 text-5xl text-subtle hover:text-highlight transition-colors">‹</button>
          <button onClick={handleNext} className="absolute top-1/2 -translate-y-1/2 right-0 -mr-12 text-5xl text-subtle hover:text-highlight transition-colors">›</button>
        </div>
      )}
    </div>
  );
};

const Card = ({ card, onRefresh }) => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !card.boardData) return;
    const context = canvas.getContext('2d');
    const { width, height } = canvas;
    const bounds = getBounds(card.boardData);
    const scale = Math.min(width / bounds.width, height / bounds.height) * 0.8;
    const offsetX = (width - bounds.width * scale) / 2 - bounds.minX * scale;
    const offsetY = (height - bounds.height * scale) / 2 - bounds.minY * scale;
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);
    (card.boardData || []).forEach(item => drawItem(context, item));
    context.restore();
  }, [card.boardData]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const handlePin = (e) => { e.stopPropagation(); alert(`Pinning "${card.boardName}" (feature coming soon)`); };
  const handleRename = (e) => { e.stopPropagation(); alert(`Renaming "${card.boardName}" (feature coming soon)`); };
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${card.boardName}"?`)) {
      try {
        await api.delete(`/boards/${card._id}`);
        alert('Board deleted successfully.');
        onRefresh();
      } catch (err) {
        console.error('Failed to delete board', err);
        alert('Failed to delete board.');
      }
    }
  };

  return (
    <div 
      onClick={() => navigate(`/whiteboard/${card._id}`)}
      className="group w-1/3 flex-shrink-0 aspect-square p-6 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-left transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-accent/20 cursor-pointer flex flex-col justify-between relative"
    >
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={toggleMenu} 
          className="w-8 h-8 flex flex-col justify-center items-center gap-1 rounded-full bg-black/30 text-white focus:outline-none"
        >
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </button>
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-secondary rounded-lg border border-white/10 shadow-xl py-2">
            <button onClick={handlePin} className="w-full text-left px-4 py-2 text-highlight hover:bg-white/10">Pin</button>
            <button onClick={handleRename} className="w-full text-left px-4 py-2 text-highlight hover:bg-white/10">Rename</button>
            <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20">Delete</button>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} width="400" height="400" className="w-full h-full rounded-lg bg-white/5"></canvas>
      <h3 className="text-2xl font-bold text-highlight mt-4">{card.boardName}</h3>
    </div>
  );
};

// Helper functions (getBounds, drawItem)
const getBounds = (data) => {
  if (!data || data.length === 0) return { minX: 0, minY: 0, maxX: 1, maxY: 1, width: 1, height: 1 };
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  data.forEach(item => {
    const points = item.tool ? [ {x: item.startX, y: item.startY}, {x: item.endX, y: item.endY} ] : [ {x: item.x0, y: item.y0}, {x: item.x1, y: item.y1} ];
    points.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });
  return { minX, minY, maxX, maxY, width: maxX - minX || 1, height: maxY - minY || 1 };
};

const drawItem = (context, item) => {
  context.strokeStyle = item.color;
  context.lineWidth = item.brushSize;
  context.beginPath();
  if (item.tool) { // Shape
    switch (item.tool) {
      case 'line': context.moveTo(item.startX, item.startY); context.lineTo(item.endX, item.endY); break;
      case 'rectangle': context.rect(item.startX, item.startY, item.endX - item.startX, item.endY - item.startY); break;
      case 'circle': const radius = Math.sqrt(Math.pow(item.endX - item.startX, 2) + Math.pow(item.endY - item.startY, 2)); context.arc(item.startX, item.startY, radius, 0, 2 * Math.PI); break;
      default: break;
    }
  } else { // Pencil line
    context.moveTo(item.x0, item.y0);
    context.lineTo(item.x1, item.y1);
  }
  context.stroke();
};

export default ProjectsCarousel;