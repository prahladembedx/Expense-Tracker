const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be positive']
  },
  type: {
    type: String,
    enum: ['expense', 'income'],
    required: true,
    default: 'expense'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
      'Healthcare', 'Utilities', 'Housing', 'Education', 'Travel',
      'Personal Care', 'Investments', 'Salary', 'Freelance', 'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'],
    default: 'Cash'
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', null],
    default: null
  },
  receipt: {
    type: String, // URL to receipt image
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('Expense', ExpenseSchema);
