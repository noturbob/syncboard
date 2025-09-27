const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// --- Use cors middleware for all Express requests ---
app.use(cors());

const server = http.createServer(app);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", 
  }
});

const PORT = 4000;

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));
// -------------------------

app.use('/api/auth', require('./routes/auth'));

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('clear', () => {
    socket.broadcast.emit('clear');
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});