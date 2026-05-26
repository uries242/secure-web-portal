const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');
const { authMiddleware } = require('../utils/auth');

// Protect all bookmark routes 
router.use(authMiddleware);

// POST /api/bookmarks
router.post('/', async (req, res) => {
  try {
    const bookmark = await Bookmark.create({
      ...req.body,
      user: req.user.id, // associate with logged-in user
    });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/bookmarks  - retrieves all bookmarks for logged-in user
router.get('/', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.status(200).json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookmarks/:id  - retrieves a single bookmark
router.get('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Ownership check 
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User is not authorized to view this bookmark' });
    }

    res.status(200).json(bookmark);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookmarks/:id  — to update a bookmark
router.put('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Ownership check
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User is not authorized to update this bookmark' });
    }

    const updated = await Bookmark.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/bookmarks/:id — to delete a bookmark
router.delete('/:id', async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    // Ownership check 
    if (bookmark.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'User is not authorized to delete this bookmark' });
    }

    await Bookmark.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Bookmark deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;