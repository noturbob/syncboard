// src/WhiteboardPage.jsx
import { useState, useRef } from 'react';
import Whiteboard from '../Whiteboard/Whiteboard';
import Toolbar from '../Toolbar/Toolbar';

const WhiteboardPage = () => {
  const [color, setColor] = useState("black");
  const [brushSize, setBrushSize] = useState(5);
  const whiteboardRef = useRef(null);

  const handleClear = () => {
    if (whiteboardRef.current) {
      whiteboardRef.current.clearCanvas();
    }
  };

  return (
    <>
      <Toolbar 
        setColor={setColor} 
        setBrushSize={setBrushSize} 
        onClear={handleClear}
      />
      <Whiteboard 
        color={color} 
        brushSize={brushSize} 
        ref={whiteboardRef} 
      />
    </>
  );
};

export default WhiteboardPage;