// Entry point: Express server with API routes and socket.io
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: { origin: '*' }
});

// Basic socket.io setup: emit notifications to connected clients.
// In production you'd authenticate sockets and map userId->socketId(s).
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);
  socket.on('registerUser', (userId) => {
    socket.join(userId); // join room per userId
  });
});

// make io available to routes via app.locals
app.locals.io = io;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

// Connect MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/insta_clone';
mongoose.connect(MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 4000;
    server.listen(port, () => console.log('Server listening on', port));
  })
  .catch((err) => console.error('Mongo connection error', err));
