// LocalStorage utility functions

const KEYS = {
  EXPENSES: 'spendwise_expenses',
  BUDGETS: 'spendwise_budgets',
  SETTINGS: 'spendwise_settings',
};

// Generate unique ID
export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// EXPENSES
export const getExpenses = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.EXPENSES)) || [];
  } catch { return []; }
};

export const saveExpenses = (expenses) => {
  localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
};

export const addExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = { ...expense, id: generateId(), createdAt: new Date().toISOString() };
  expenses.unshift(newExpense);
  saveExpenses(expenses);
  return newExpense;
};

export const updateExpense = (id, updated) => {
  const expenses = getExpenses();
  const index = expenses.findIndex(e => e.id === id);
  if (index !== -1) {
    expenses[index] = { ...expenses[index], ...updated };
    saveExpenses(expenses);
    return expenses[index];
  }
  return null;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
};

export const deleteExpenses = (ids) => {
  const expenses = getExpenses().filter(e => !ids.includes(e.id));
  saveExpenses(expenses);
};

// BUDGETS
export const getBudgets = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.BUDGETS)) || [];
  } catch { return []; }
};

export const saveBudget = (budget) => {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.category === budget.category && b.month === budget.month && b.year === budget.year);
  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...budget };
  } else {
    budgets.push({ ...budget, id: generateId() });
  }
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
};

export const deleteBudget = (id) => {
  const budgets = getBudgets().filter(b => b.id !== id);
  localStorage.setItem(KEYS.BUDGETS, JSON.stringify(budgets));
};

// SETTINGS
export const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || { currency: '₹', name: 'User' };
  } catch { return { currency: '₹', name: 'User' }; }
};

export const saveSettings = (settings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};
// Request notification permission
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

// Send notification
export const sendNotification = (title, body) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/android-chrome-192x192.png'
    });
  }
};