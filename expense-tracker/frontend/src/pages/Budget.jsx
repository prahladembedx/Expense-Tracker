import React, { useState, useEffect } from 'react';
import { getBudgets, saveBudget, deleteBudget, getExpenses } from '../utils/storage';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Healthcare','Utilities','Housing','Education','Travel','Personal Care','Other'
];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [form, setForm] = useState({ category: 'Food & Dining', amount: '', alertThreshold: 80 });
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { refresh(); }, [month, year]);

  const refresh = () => {
    setBudgets(getBudgets());
    setExpenses(getExpenses());
  };

  const monthBudgets = budgets.filter(b => b.month === month && b.year === year).map(b => {
    const spent = expenses.filter(e => e.type === 'expense' && e.category === b.category && new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year).reduce((a, c) => a + c.amount, 0);
    const percentage = Math.round((spent / b.amount) * 100);
    return { ...b, spent, remaining: b.amount - spent, percentage };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveBudget({ ...form, amount: parseFloat(form.amount), alertThreshold: parseInt(form.alertThreshold), month, year });
    toast.success(editBudget ? 'Budget updated' : 'Budget set');
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this budget?')) return;
    deleteBudget(id);
    toast.success('Budget deleted');
    refresh();
  };

  const openAdd = () => { setForm({ category: 'Food & Dining', amount: '', alertThreshold: 80 }); setEditBudget(null); setShowModal(true); };
  const openEdit = (b) => { setForm({ category: b.category, amount: b.amount, alertThreshold: b.alertThreshold }); setEditBudget(b); setShowModal(true); };
  const f = (n) => `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const totalBudget = monthBudgets.reduce((a, b) => a + b.amount, 0);
  const totalSpent = monthBudgets.reduce((a, b) => a + b.spent, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Budgets</h1>
          <p className="page-subtitle">Set monthly spending limits</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Set Budget</button>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 24 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => { let m = month - 1, y = year; if (m < 0) { m = 11; y--; } setMonth(m); setYear(y); }}>←</button>
        <span style={{ fontWeight: 600, minWidth: 140, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
        <button className="btn btn-secondary btn-sm" onClick={() => { let m = month + 1, y = year; if (m > 11) { m = 0; y++; } setMonth(m); setYear(y); }}>→</button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card balance"><div className="stat-label">Total Budget</div><div className="stat-value balance">{f(totalBudget)}</div></div>
        <div className="stat-card expense"><div className="stat-label">Total Spent</div><div className="stat-value expense">{f(totalSpent)}</div></div>
        <div className="stat-card income"><div className="stat-label">Remaining</div><div className="stat-value income">{f(totalBudget - totalSpent)}</div></div>
        <div className="stat-card savings"><div className="stat-label">Overall Usage</div><div className="stat-value" style={{ color: 'var(--warning)' }}>{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</div></div>
      </div>

      {monthBudgets.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <p className="empty-text">No budgets for this month</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>Set First Budget</button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {monthBudgets.map(b => {
            const color = b.percentage > 90 ? 'var(--danger)' : b.percentage > b.alertThreshold ? 'var(--warning)' : 'var(--success)';
            return (
              <div key={b.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{b.category}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alert at {b.alertThreshold}%</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(b)}>✏️</button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(b.id)}>🗑</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Spent: <strong style={{ color }}>{f(b.spent)}</strong></span>
                  <span style={{ color: 'var(--text-secondary)' }}>Budget: <strong>{f(b.amount)}</strong></span>
                </div>
                <div className="progress-bar" style={{ height: 8 }}>
                  <div className="progress-fill" style={{ width: `${Math.min(b.percentage, 100)}%`, background: color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.8rem' }}>
                  <span style={{ color }}>{b.percentage}% used</span>
                  <span>{b.remaining >= 0 ? `${f(b.remaining)} left` : <span style={{ color: 'var(--danger)' }}>Over by {f(-b.remaining)}</span>}</span>
                </div>
                {b.percentage >= b.alertThreshold && (
                  <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--warning)' }}>
                    ⚠️ {b.percentage >= 100 ? 'Budget exceeded!' : 'Approaching limit'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editBudget ? 'Edit Budget' : 'Set Budget'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Budget (₹)</label>
                <input className="form-control" type="number" min="1" placeholder="5000" value={form.amount}
                  onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Alert Threshold: {form.alertThreshold}%</label>
                <input type="range" min="50" max="95" value={form.alertThreshold}
                  onChange={e => setForm(p => ({ ...p, alertThreshold: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
