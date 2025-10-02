import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

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
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-highlight font-sans">
            Welcome to <span className="text-accent">Syncboard</span>
          </h1>
          <p className="text-lg sm:text-xl text-subtle max-w-2xl mx-auto mt-4">
            Choose an option to begin collaborating in real time.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
          {/* Create New Board Card */}
          <Link to="/whiteboard" className="group p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-left transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-accent/20">
            <h2 className="text-2xl font-bold text-highlight mb-2">Create New Board</h2>
            <p className="text-subtle">Start a solo project on a fresh canvas.</p>
          </Link>

          {/* Create a Co-board Card */}
          <div onClick={openModal} className="group p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-left transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-accent/20 cursor-pointer">
            <h2 className="text-2xl font-bold text-highlight mb-2">Create a Co-board</h2>
            <p className="text-subtle">Generate an invite link to collaborate.</p>
          </div>

          {/* Projects Card */}
          <Link to="/projects" className="group p-8 bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg text-left transition-all duration-300 hover:border-accent hover:scale-105 hover:shadow-accent/20">
            <h2 className="text-2xl font-bold text-highlight mb-2">Projects</h2>
            <p className="text-subtle">View and manage your saved boards.</p>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="w-full max-w-lg p-8 bg-secondary rounded-2xl border border-white/10 shadow-lg relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-subtle hover:text-highlight text-2xl">&times;</button>
            {!inviteLink ? (
              <>
                <h2 className="text-2xl font-bold text-highlight mb-6 text-center">Create a Co-board</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleInviteByLink} className="flex-1 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105">Invite by Link</button>
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 text-subtle font-semibold rounded-lg cursor-not-allowed">Invite by Code (soon)</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-highlight mb-4 text-center">Share This Link</h2>
                <input type="text" readOnly value={inviteLink} className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-highlight text-center" />
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button onClick={copyLink} className="flex-1 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105">Copy Link</button>
                  <button onClick={() => navigate(`/whiteboard/${boardId}`)} className="flex-1 py-3 bg-white/10 border border-white/20 text-highlight font-semibold rounded-lg hover:bg-white/20 transition-all duration-300">Go to Board</button>
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