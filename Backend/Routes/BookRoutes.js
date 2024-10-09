const express = require('express');
const router = express.Router();
const Book = require('../Models/book');
const BorrowHistory = require('../Models/BorrowHistory');
const { protect } = require('../middleware/auth');

// Get all books
router.get('/', protect, async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrow a book
router.post('/:id/borrow', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.status === 'BORROWED') {
      return res.status(400).json({ message: 'Book is already borrowed' });
    }

    book.status = 'BORROWED';
    book.currentBorrower = req.user._id;
    await book.save();

    await BorrowHistory.create({
      user: req.user._id,
      book: book._id,
      action: 'borrowed'
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Return a book
router.post('/:id/return', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.status !== 'BORROWED' || book.currentBorrower.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot return this book' });
    }

    book.status = 'AVAILABLE';
    book.currentBorrower = null;
    await book.save();

    await BorrowHistory.create({
      user: req.user._id,
      book: book._id,
      action: 'returned'
    });

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;