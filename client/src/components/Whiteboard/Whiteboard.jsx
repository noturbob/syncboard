import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import styles from './Whiteboard.module.css';

const Whiteboard = forwardRef(({ color, brushSize, onDraw, socket, boardId }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const lastPosRef = useRef(null);
  const drawingHistoryRef = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      drawingHistoryRef.current = [];
      if (onDraw) onDraw([]);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (socket) socket.emit('clear', boardId);
    },
    loadBoardData: (data) => {
      if (!contextRef.current) return;
      drawingHistoryRef.current = data || [];
      const context = contextRef.current;
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      
      (data || []).forEach(line => {
        context.beginPath();
        context.moveTo(line.x0, line.y0);
        context.lineTo(line.x1, line.y1);
        context.strokeStyle = line.color;
        context.lineWidth = line.brushSize;
        context.stroke();
        context.closePath();
      });
    }
  }));

  // Initial setup effect
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

    // Listen for drawing data from server
    if (socket) {
      const handleDrawing = (data) => {
        const { x0, y0, x1, y1, color, brushSize } = data;
        const context = contextRef.current;
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        context.stroke();
        context.closePath();
      };

      const handleServerClear = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      };

      socket.on('drawing', handleDrawing);
      socket.on('clear', handleServerClear);

      return () => {
        socket.off('drawing', handleDrawing);
        socket.off('clear', handleServerClear);
      };
    }
  }, [socket]);

  // Effect to update drawing style
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
    lastPosRef.current = { x: offsetX, y: offsetY };
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    lastPosRef.current = null;
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !socket) return;
    const { offsetX, offsetY } = nativeEvent;

    const lineData = {
      x0: lastPosRef.current.x,
      y0: lastPosRef.current.y,
      x1: offsetX,
      y1: offsetY,
      color: color,
      brushSize: brushSize,
      boardId: boardId,
    };

    socket.emit('drawing', lineData);
    drawingHistoryRef.current.push(lineData);

    if (onDraw) {
      onDraw([...drawingHistoryRef.current]);
    }
    
    lastPosRef.current = { x: offsetX, y: offsetY };
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