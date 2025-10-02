import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import styles from './ProjectsCarousel.module.css';

const ProjectsCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/boards');
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? Math.max(0, projects.length - 3) : prevIndex - 1));
  };

  const handleNext = () => {
    if (currentIndex >= projects.length - 3) return;
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <div className={styles.container}><p>Loading projects...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Projects</h2>
      {projects.length === 0 ? (
        <p style={{ textAlign: 'center' }}>You haven't created any boards yet.</p>
      ) : (
        <div className={styles.carouselContainer}>
          <button onClick={handlePrev} className={`${styles.arrow} ${styles.left}`}>‹</button>
          <div className={styles.cardWrapper}>
            {projects.slice(currentIndex, currentIndex + 3).map((project) => (
              <Card key={project._id} card={project} />
            ))}
          </div>
          <button onClick={handleNext} className={`${styles.arrow} ${styles.right}`}>›</button>
        </div>
      )}
    </div>
  );
};

const Card = ({ card }) => {
  const navigate = useNavigate();
  const imageUrl = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070";

  const handleOpen = () => {
    navigate(`/whiteboard/${card._id}`);
  };
  
  return (
    <div className={styles.card} onClick={handleOpen}>
      <img src={imageUrl} alt={card.boardName} className={styles.cardImage} />
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{card.boardName}</h3>
      </div>
    </div>
  );
};

export default ProjectsCarousel;