const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  action: {
    type: String,
    enum: ['borrowed', 'returned'],
    required: true
  }
}, {
  timestamps: true
});

const BorrowHistory = mongoose.model('BorrowHistory', borrowHistorySchema);
module.exports = BorrowHistory;