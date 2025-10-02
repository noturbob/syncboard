const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

const PORT = 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/coboards', require('./routes/coboards'));

// Socket.IO Connection Logic
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Event to join a specific board's room
  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  // Updated drawing event
  socket.on('drawing', (data) => {
    // Broadcast only to the room the drawing belongs to
    if (data.boardId) {
      socket.to(data.boardId).emit('drawing', data);
    }
  });

  // New event for cursor movement
  socket.on('cursor-move', (data) => {
    // Broadcast cursor position to the specific room
    if (data.boardId) {
      socket.to(data.boardId).emit('cursor-update', { ...data, socketId: socket.id });
    }
  });

  // Updated clear event
  socket.on('clear', (boardId) => {
    if (boardId) {
      socket.to(boardId).emit('clear');
    }
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
    // In a more advanced version, you could notify rooms that a user has left
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});