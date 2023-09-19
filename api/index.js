require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const http = require('http');

const app = express();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['https://videochatapp-re9k.vercel.app'],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

const ChatMessage = require('../models/ChatMessage'); // Adjust the path as necessary
const User = require('../models/User'); // Adjust the path as necessary

app.use(cors({
  origin: ['https://videochatapp-re9k.vercel.app'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(express.json());

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/videochatapp';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("Could not connect to MongoDB", error);
});

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const colorClass = `color${Math.floor(Math.random() * 10)}`;
    const newUser = new User({ username, password: hashedPassword, colorClass });
    await newUser.save();

    res.json({ message: 'User registered successfully', colorClass });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.json({ message: 'Logged in successfully', colorClass: user.colorClass });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  ChatMessage.find()
    .sort('timestamp')
    .then((messages) => {
      console.log('Sending previous messages', messages);
      socket.emit('previous_messages', messages);
    });

  socket.on('send_message', (data) => {
    console.log('Received a message', data);
    const newMessage = new ChatMessage(data);
    newMessage.save().then(() => {
      console.log('Saved the message, emitting to other users', data);
      io.emit('receive_message', data);
    });
  });

  socket.on('change_video', (videoID) => {
    io.emit('change_video', videoID); // Broadcast the new video ID to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

module.exports = app;
