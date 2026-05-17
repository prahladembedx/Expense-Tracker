const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [1, 'Budget must be at least 1']
  },
  month: {
    type: Number, // 0-11
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  alertThreshold: {
    type: Number,
    default: 80, // Alert at 80% usage
    min: 1,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique budget per category per month per user
BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
