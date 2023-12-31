require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['https://videoplay-chat-app-38f126c44487.herokuapp.com'],
    methods: ["GET", "POST", "PUT", "DELETE"],
  }
});

const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

app.use(cors({
  origin: ['https://videoplay-chat-app-38f126c44487.herokuapp.com/'],
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

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  console.log("GET / - serving the index.html file");
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/register', async (req, res) => {
  console.log("POST /register - received registration request");
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
    console.error("POST /register - error occurred while registering", error);
    res.status(500).json({ message: 'An error occurred', error });
  }
});

app.post('/login', async (req, res) => {
  console.log("POST /login - received login request");
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
    console.error("POST /login - error occurred while logging in", error);
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
    }).catch((error) => {
      console.error('Error saving the message', error);
    });
  });
  socket.on('change_video', (videoID) => {
    console.log(`Changing video to ID: ${videoID}`);
    io.emit('change_video', videoID);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
