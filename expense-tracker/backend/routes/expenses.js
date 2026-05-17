const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// @route GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 20, category, type, startDate, endDate,
      search, sortBy = 'date', sortOrder = 'desc', tags
    } = req.query;

    const filter = { user: req.user.id };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (tags) filter.tags = { $in: tags.split(',') };

    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter).sort(sort).skip(skip).limit(parseInt(limit));

    res.json({
      success: true,
      count: expenses.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: expenses
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route GET /api/expenses/:id
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST /api/expenses
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('type').isIn(['expense', 'income']).withMessage('Type must be expense or income')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const expense = await Expense.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route DELETE /api/expenses/bulk/delete
router.delete('/bulk/delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await Expense.deleteMany({ _id: { $in: ids }, user: req.user.id });
    res.json({ success: true, message: `${ids.length} expenses deleted` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
