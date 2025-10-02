import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [boardId, setBoardId] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setInviteLink('');
    setBoardId('');
  };

  const handleInviteByLink = async () => {
    try {
      const res = await api.post('/coboards/create');
      const newBoardId = res.data.boardId;
      const link = `${window.location.origin}/whiteboard/${newBoardId}`;
      setInviteLink(link);
      setBoardId(newBoardId);
    } catch (err) {
      console.error('Failed to create co-board', err);
      alert('Error: Could not create a new co-board.');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copied to clipboard!');
  };

  return (
    <>
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
          {/* This card now opens the modal */}
          <div className={styles.card} onClick={openModal}>
            <h2>Create a Co-board</h2>
            <p>Generate an invite link to collaborate in real-time.</p>
          </div>
          <Link to="/projects" className={styles.card}>
            <h2>Projects</h2>
            <p>View and manage your saved boards.</p>
          </Link>
        </div>
      </div>

      {/* --- Modal Logic --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeButton}>×</button>
            
            {/* Stage 1: Show initial options */}
            {!inviteLink ? (
              <>
                <h2>Create a Co-board</h2>
                <div className={styles.modalOptions}>
                  <button onClick={handleInviteByLink} className={styles.modalButton}>Invite by Link</button>
                  <button className={`${styles.modalButton} ${styles.disabled}`}>Invite by Code (soon)</button>
                </div>
              </>
            ) : (
            /* Stage 2: Show the generated link */
              <>
                <h2>Share This Link</h2>
                <input type="text" readOnly value={inviteLink} className={styles.linkInput} />
                <div className={styles.modalActions}>
                  <button onClick={copyLink} className={styles.modalButton}>Copy Link</button>
                  <button onClick={() => navigate(`/whiteboard/${boardId}`)} className={styles.modalButton}>Go to Board</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;