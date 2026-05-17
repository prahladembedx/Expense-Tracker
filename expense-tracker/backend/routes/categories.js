const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', type: 'expense' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#45B7D1', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#96CEB4', type: 'expense' },
  { name: 'Healthcare', icon: '🏥', color: '#FFEAA7', type: 'expense' },
  { name: 'Utilities', icon: '💡', color: '#DDA0DD', type: 'expense' },
  { name: 'Housing', icon: '🏠', color: '#98D8C8', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#F7DC6F', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#BB8FCE', type: 'expense' },
  { name: 'Personal Care', icon: '💅', color: '#F1948A', type: 'expense' },
  { name: 'Investments', icon: '📈', color: '#52BE80', type: 'income' },
  { name: 'Salary', icon: '💰', color: '#27AE60', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#2980B9', type: 'income' },
  { name: 'Other', icon: '📦', color: '#BDC3C7', type: 'both' }
];

// @route GET /api/categories
router.get('/', (req, res) => {
  res.json({ success: true, data: CATEGORIES });
});

module.exports = router;
