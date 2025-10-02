import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Whiteboard from '../Whiteboard/Whiteboard';
import Toolbar from '../Toolbar/Toolbar';
import Cursor from '../Cursor/Cursor';
import api from '../../utils/api';
import useDebounce from '../../utils/useDebounce';
import io from 'socket.io-client';

const WhiteboardPage = () => {
  const { boardId: boardIdFromUrl } = useParams();
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const [boardId, setBoardId] = useState(boardIdFromUrl);
  const [boardName, setBoardName] = useState('Untitled Board');
  const [boardData, setBoardData] = useState([]);
  const [otherCursors, setOtherCursors] = useState({});
  const [user, setUser] = useState(null);
  const whiteboardRef = useRef(null);
  const socketRef = useRef(null);

  const debouncedBoardData = useDebounce(boardData, 2000);

  // Effect for Socket.IO connection and events
  useEffect(() => {
    socketRef.current = io.connect("http://localhost:4000");

    if (boardIdFromUrl) {
      socketRef.current.emit('join-board', boardIdFromUrl);
    }

    socketRef.current.on('cursor-update', (data) => {
      if (data.socketId !== socketRef.current.id) {
        setOtherCursors(prevCursors => ({
          ...prevCursors,
          [data.socketId]: data,
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [boardIdFromUrl]);

  // Effect to fetch the current user's data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth');
        setUser(res.data);
      } catch (err) {
        console.error('Could not fetch user', err);
      }
    };
    fetchUser();
  }, []);

  // Effect to load board data
  useEffect(() => {
    const loadBoard = async () => {
      if (boardIdFromUrl) {
        try {
          const res = await api.get(`/boards/${boardIdFromUrl}`);
          setBoardName(res.data.boardName);
          setBoardData(res.data.boardData);
          if (whiteboardRef.current) {
            whiteboardRef.current.loadBoardData(res.data.boardData);
          }
        } catch (err) {
          console.error("Failed to load board", err);
        }
      }
    };
    loadBoard();
  }, [boardIdFromUrl]);

  // Effect for autosaving
  useEffect(() => {
    if (debouncedBoardData.length === 0 && !boardId) return;

    const autoSave = async () => {
      try {
        const boardPayload = { boardName, boardData: debouncedBoardData };
        if (boardId) {
          await api.put(`/boards/${boardId}`, boardPayload);
          console.log('Board updated...');
        } else {
          const res = await api.post('/boards', boardPayload);
          setBoardId(res.data._id);
          console.log('Board saved for the first time...');
        }
      } catch (err) {
        console.error('Autosave failed:', err);
      }
    };
    
    if (debouncedBoardData.length > 0) {
      autoSave();
    }
  }, [debouncedBoardData, boardName, boardId]);

  const handleDrawingChange = (newDrawingData) => {
    setBoardData(newDrawingData);
  };

  const handleMouseMove = (e) => {
    if (boardIdFromUrl && socketRef.current && user) {
      socketRef.current.emit('cursor-move', {
        x: e.clientX,
        y: e.clientY,
        boardId: boardIdFromUrl,
        name: user.name,
      });
    }
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <Toolbar 
        setColor={setColor} 
        setBrushSize={setBrushSize} 
        onClear={() => whiteboardRef.current.clearCanvas()}
      />
      <input 
        type="text" 
        value={boardName} 
        onChange={(e) => setBoardName(e.target.value)}
        style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, padding: '10px', border: '1px solid #ccc',
          borderRadius: '5px', textAlign: 'center', fontSize: '1rem',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}
      />
      <Whiteboard 
        color={color} 
        brushSize={brushSize} 
        ref={whiteboardRef} 
        onDraw={handleDrawingChange}
        socket={socketRef.current}
        boardId={boardIdFromUrl}
      />
      {Object.values(otherCursors).map(cursor => (
        <Cursor key={cursor.socketId} {...cursor} />
      ))}
    </div>
  );
};

export default WhiteboardPage;