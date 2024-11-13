const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const folderRouter = require('./routes/folder');
const imageRouter = require('./routes/image');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Remove trailing slash
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// Add this before your routes and passport initialization
app.use(session({
  secret: process.env.SESSION_SECRET, // Use environment variable
  resave: false,
  saveUninitialized: false,
  // You may want to configure a store for production use
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', authRouter);
app.use('/folder', folderRouter);
app.use('/image', imageRouter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});