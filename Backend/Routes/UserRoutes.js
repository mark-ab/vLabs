const express = require('express');
const router = express.Router();
const User = require('../models/User');
const BorrowHistory = require('../Models/BorrowHistory');
const Book = require('../Models/book');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get borrow history
router.get('/history', protect, async (req, res) => {
  try {
    const history = await BorrowHistory.find({ user: req.user._id })
      .populate('book', 'title')
      .sort('-createdAt');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete account
router.delete('/me', protect, async (req, res) => {
  try {
    // Check if user has any borrowed books
    const borrowedBooks = await Book.findOne({ 
      currentBorrower: req.user._id,
      status: 'BORROWED'
    });

    if (borrowedBooks) {
      return res.status(400).json({ message: 'Please return all books before deleting account' });
    }

    // Delete user's borrow history
    await BorrowHistory.deleteMany({ user: req.user._id });
    
    // Delete user
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = router;
