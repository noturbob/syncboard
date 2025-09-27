import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import io from 'socket.io-client';
import styles from './Whiteboard.module.css';

const Whiteboard = forwardRef(({ color, brushSize }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const socketRef = useRef();
  const lastPosRef = useRef(null); // Ref to track the last mouse position
  const [isDrawing, setIsDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socketRef.current.emit('clear');
  };

  useImperativeHandle(ref, () => ({
    clearCanvas,
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;

    socketRef.current = io.connect("http://localhost:4000");

    socketRef.current.on('drawing', (data) => {
      const { x0, y0, x1, y1, color, brushSize } = data;
      const context = contextRef.current;
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      context.stroke();
      context.closePath();
    });

    const handleServerClear = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    socketRef.current.on('clear', handleServerClear);

    return () => {
      socketRef.current.off('clear', handleServerClear);
    };
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    lastPosRef.current = { x: offsetX, y: offsetY }; // Set the starting position
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    lastPosRef.current = null; // Clear the last position
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    
    // Use the stored last position as the start point for a continuous line
    socketRef.current.emit('drawing', { 
      x0: lastPosRef.current.x,
      y0: lastPosRef.current.y,
      x1: offsetX,
      y1: offsetY,
      color: color,
      brushSize: brushSize,
    });
    
    lastPosRef.current = { x: offsetX, y: offsetY }; // Update the last position
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  return (
    <canvas
      className={styles.canvas}
      onMouseDown={startDrawing}
      onMouseUp={stopDrawing}
      onMouseMove={draw}
      ref={canvasRef}
    />
  );
});

export default Whiteboard;