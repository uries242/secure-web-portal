require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./config/passport');

const userRoutes = require('./routes/userRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ------ Middleware ------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ------ Routes ------
app.use('/api/users', userRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));