import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const Whiteboard = forwardRef(({ color, brushSize, onDraw, socket, boardId, tool }, ref) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const snapshot = useRef(null);
  const drawingHistoryRef = useRef([]);

  // --- Imperative Handle to expose functions to parent ---
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
      (data || []).forEach(item => {
        if (item.tool) { // It's a shape
          onDrawShapeEvent(item);
        } else { // It's a line
          onDrawingEvent(item);
        }
      });
    }
  }));

  // --- Initial Setup and Socket Listeners ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;

    if (socket) {
      socket.on('drawing', onDrawingEvent);
      socket.on('draw-shape', onDrawShapeEvent);
      socket.on('clear', handleServerClear);
      return () => {
        socket.off('drawing', onDrawingEvent);
        socket.off('draw-shape', onDrawShapeEvent);
        socket.off('clear', handleServerClear);
      };
    }
  }, [socket]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const handleServerClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  // --- Handlers for Drawing Events from Server ---
  const onDrawingEvent = ({ x0, y0, x1, y1, color, brushSize }) => {
    const context = contextRef.current;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.stroke();
    context.closePath();
  };

  const onDrawShapeEvent = ({ tool, startX, startY, endX, endY, color, brushSize }) => {
    const context = contextRef.current;
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.beginPath();
    switch (tool) {
      case 'line':
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        break;
      case 'rectangle':
        context.rect(startX, startY, endX - startX, endY - startY);
        break;
      case 'circle':
        const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        context.arc(startX, startY, radius, 0, 2 * Math.PI);
        break;
      default:
        break;
    }
    context.stroke();
  };

  // --- Mouse Drawing Functions ---
  const startDrawing = ({ nativeEvent }) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = nativeEvent;
    startPos.current = { x: offsetX, y: offsetY };
    if (tool === 'pencil' || tool === 'eraser') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
    } else {
      snapshot.current = contextRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current || !socket) return;
    const context = contextRef.current;
    const { offsetX, offsetY } = nativeEvent;
    const lineColor = tool === 'eraser' ? '#FFFFFF' : color;
    
    switch (tool) {
      case 'pencil':
      case 'eraser':
        context.strokeStyle = lineColor;
        context.lineTo(offsetX, offsetY);
        context.stroke();
        const lineData = { x0: startPos.current.x, y0: startPos.current.y, x1: offsetX, y1: offsetY, color: lineColor, brushSize, boardId };
        socket.emit('drawing', lineData);
        drawingHistoryRef.current.push(lineData);
        startPos.current = { x: offsetX, y: offsetY };
        break;
      case 'line':
      case 'rectangle':
      case 'circle':
        context.putImageData(snapshot.current, 0, 0);
        onDrawShapeEvent({ tool, startX: startPos.current.x, startY: startPos.current.y, endX: offsetX, endY: offsetY, color, brushSize });
        break;
      default:
        break;
    }
  };

  const stopDrawing = ({ nativeEvent }) => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const { offsetX, offsetY } = nativeEvent;
    if (tool !== 'pencil' && tool !== 'eraser') {
      const shapeData = {
        tool,
        startX: startPos.current.x,
        startY: startPos.current.y,
        endX: offsetX,
        endY: offsetY,
        color,
        brushSize,
        boardId,
      };
      onDrawShapeEvent(shapeData);
      socket.emit('draw-shape', shapeData);
      drawingHistoryRef.current.push(shapeData);
    }
    contextRef.current.closePath();

    if (onDraw) {
      onDraw([...drawingHistoryRef.current]);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-white bg-dotted-pattern bg-dotted-size">
      <canvas
        className="absolute top-0 left-0 bg-transparent"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        ref={canvasRef}
      />
    </div>
  );
});

export default Whiteboard;