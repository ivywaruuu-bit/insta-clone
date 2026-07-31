const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get profile by username
router.get('/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-passwordHash').populate('followers following', 'username displayName');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow/unfollow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const me = await User.findById(req.user._id);
    const idx = target.followers.indexOf(me._id);
    if (idx === -1) {
      target.followers.push(me._id);
      me.following.push(target._id);
    } else {
      target.followers.splice(idx, 1);
      me.following = me.following.filter(id => String(id) !== String(target._id));
    }
    await target.save();
    await me.save();
    res.json({ followersCount: target.followers.length, followingCount: me.following.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
