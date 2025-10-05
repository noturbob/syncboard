const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');
require('./redisClient');
require('dotenv').config();

const app = express();

// ✅ Correct CORS setup (no trailing slash)
app.use(cors({
  origin: [
    'https://syncboard-xi.vercel.app', // ✅ your Vercel frontend (no slash)
    'http://localhost:3000' // ✅ for local testing
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const server = http.createServer(app);

// ✅ Configure Socket.IO with same CORS rules
const io = new Server(server, {
  cors: {
    origin: [
      'https://syncboard-xi.vercel.app',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const PORT = process.env.PORT || 4000;

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boards', require('./routes/boards'));
app.use('/api/coboards', require('./routes/coboards'));

// ✅ Socket.IO events
io.on('connection', (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  socket.on('join-board', (boardId) => {
    socket.join(boardId);
    console.log(`User ${socket.id} joined board ${boardId}`);
  });

  socket.on('drawing', (data) => {
    if (data.boardId) {
      socket.to(data.boardId).emit('drawing', data);
    }
  });

  socket.on('draw-shape', (data) => {
    if (data.boardId) {
      socket.to(data.boardId).emit('draw-shape', data);
    }
  });

  socket.on('cursor-move', (data) => {
    if (data.boardId) {
      socket.to(data.boardId).emit('cursor-update', { ...data, socketId: socket.id });
    }
  });

  socket.on('clear', (boardId) => {
    if (boardId) {
      socket.to(boardId).emit('clear');
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
