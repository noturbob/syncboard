import React, { useState } from 'react';
import styles from './ProjectsCarousel.module.css';

const ProjectsCarousel = () => {
  const projectData = [
    { id: 1, category: "Team Project", title: "Q3 Marketing Brainstorm", src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070" },
    { id: 2, category: "Solo Project", title: "UI/UX Mockups", src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2070" },
    { id: 3, category: "Archived", title: "Old Wireframes", src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070" },
    { id: 4, category: "Team Project", title: "New Feature Planning", src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974" },
    { id: 5, category: "Solo Project", title: "Personal Portfolio", src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? projectData.length - 3 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === projectData.length - 3 ? 0 : prevIndex + 1));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Projects</h2>
      <div className={styles.carouselContainer}>
        <button onClick={handlePrev} className={`${styles.arrow} ${styles.left}`}>‹</button>
        <div className={styles.cardWrapper}>
          {projectData.slice(currentIndex, currentIndex + 3).map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
        <button onClick={handleNext} className={`${styles.arrow} ${styles.right}`}>›</button>
      </div>
    </div>
  );
};

const Card = ({ card }) => {
  return (
    <div className={styles.card}>
      <img src={card.src} alt={card.title} className={styles.cardImage} />
      <div className={styles.cardHeader}>
        <p className={styles.cardCategory}>{card.category}</p>
        <h3 className={styles.cardTitle}>{card.title}</h3>
      </div>
    </div>
  );
};

export default ProjectsCarousel;