const express = require('express');
const multer = require('multer');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer config - store in backend/uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const post = await Post.create({ author: req.user._id, caption, imageUrl });
    await post.populate('author', 'username displayName avatarUrl');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Feed: posts from everyone (simple) - sorted desc
router.get('/', auth, async (req, res) => {
  try {
    // For a feed, you could fetch posts only from following users.
    const posts = await Post.find().populate('author', 'username displayName avatarUrl').sort({ createdAt: -1 }).limit(50);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/unlike
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const idx = post.likes.indexOf(req.user._id);
    if (idx === -1) {
      post.likes.push(req.user._id);
      // notify post author via socket
      const io = req.app.locals.io;
      io.to(String(post.author)).emit('notification', { type: 'like', from: req.user._id, postId: post._id });
    } else {
      post.likes.splice(idx, 1);
    }
    await post.save();
    res.json({ likesCount: post.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.comments.push({ author: req.user._id, text });
    await post.save();
    // notify author
    const io = req.app.locals.io;
    io.to(String(post.author)).emit('notification', { type: 'comment', from: req.user._id, postId: post._id, text });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
