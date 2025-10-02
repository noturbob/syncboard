import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateCoBoard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const createBoard = async () => {
      try {
        const res = await api.post('/coboards/create');
        const { boardId } = res.data;
        const inviteLink = `${window.location.origin}/whiteboard/${boardId}`;

        await navigator.clipboard.writeText(inviteLink);
        alert('Co-board created! Invite link copied to clipboard.');

        navigate(`/whiteboard/${boardId}`);
      } catch (err) {
        console.error('Failed to create co-board', err);
        alert('Error: Could not create a new co-board. Redirecting home.');
        navigate('/');
      }
    };

    createBoard();
  }, [navigate]);

  // This component renders nothing, it just performs an action and redirects.
  return null;
};

export default CreateCoBoard;