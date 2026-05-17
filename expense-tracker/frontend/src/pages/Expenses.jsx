import React, { useState, useEffect } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense, deleteExpenses } from '../utils/storage';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CATEGORIES = [
  'Food & Dining','Transportation','Shopping','Entertainment',
  'Healthcare','Utilities','Housing','Education','Travel',
  'Personal Care','Investments','Salary','Freelance','Other'
];
const PAYMENT_METHODS = ['Cash','Credit Card','Debit Card','Bank Transfer','UPI','Other'];

const emptyForm = {
  title: '', amount: '', type: 'expense', category: 'Food & Dining',
  date: format(new Date(), 'yyyy-MM-dd'), description: '',
  paymentMethod: 'Cash', tags: ''
};

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  useEffect(() => { setExpenses(getExpenses()); }, []);

  const refresh = () => setExpenses(getExpenses());

  const filtered = expenses.filter(e => {
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && e.type !== filterType) return false;
    if (filterCategory && e.category !== filterCategory) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const openAdd = () => { setForm(emptyForm); setEditExpense(null); setShowModal(true); };
  const openEdit = (exp) => {
    setForm({
      title: exp.title, amount: exp.amount, type: exp.type,
      category: exp.category, date: format(new Date(exp.date), 'yyyy-MM-dd'),
      description: exp.description || '', paymentMethod: exp.paymentMethod || 'Cash',
      tags: exp.tags?.join(', ') || ''
    });
    setEditExpense(exp);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    if (editExpense) {
      updateExpense(editExpense.id, payload);
      toast.success('Transaction updated');
    } else {
      addExpense(payload);
      toast.success('Transaction added');
    }
    setShowModal(false);
    refresh();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    deleteExpense(id);
    toast.success('Deleted');
    refresh();
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Delete ${selected.length} transactions?`)) return;
    deleteExpenses(selected);
    toast.success(`${selected.length} deleted`);
    setSelected([]);
    refresh();
  };

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleAll = () => setSelected(selected.length === paginated.length ? [] : paginated.map(e => e.id));
  const f = (n) => `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{filtered.length} total records</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {selected.length > 0 && <button className="btn btn-danger" onClick={handleBulkDelete}>🗑 Delete ({selected.length})</button>}
          <button className="btn btn-primary" onClick={openAdd}>+ Add Transaction</button>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="form-control search-input" placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <select className="form-control" style={{ width: 150 }} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select className="form-control" style={{ width: 180 }} value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" onChange={toggleAll} checked={selected.length === paginated.length && paginated.length > 0} /></th>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Method</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="8">
                  <div className="empty-state">
                    <div className="empty-icon">🧾</div>
                    <p className="empty-text">No transactions found</p>
                    <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>Add First Transaction</button>
                  </div>
                </td></tr>
              ) : paginated.map(exp => (
                <tr key={exp.id}>
                  <td><input type="checkbox" checked={selected.includes(exp.id)} onChange={() => toggleSelect(exp.id)} /></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{exp.title}</div>
                    {exp.tags?.length > 0 && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{exp.tags.map(t => `#${t}`).join(' ')}</div>}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{exp.category}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{format(new Date(exp.date), 'MMM d, yyyy')}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{exp.paymentMethod}</td>
                  <td><span className={`badge badge-${exp.type}`}>{exp.type}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {exp.type === 'income' ? '+' : '-'}{f(exp.amount)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(exp)}>✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(exp.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination" style={{ padding: '16px 0' }}>
            <button className="pagination-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className="pagination-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>→</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editExpense ? 'Edit Transaction' : 'Add Transaction'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Title</label>
                  <input className="form-control" placeholder="e.g. Grocery shopping" value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input className="form-control" type="number" step="0.01" min="0.01" placeholder="0.00" value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select className="form-control" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input className="form-control" type="date" value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select className="form-control" value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}>
                    {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input className="form-control" placeholder="groceries, monthly" value={form.tags}
                    onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea className="form-control" rows={2} placeholder="Optional notes..." value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editExpense ? 'Update' : 'Add Transaction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
