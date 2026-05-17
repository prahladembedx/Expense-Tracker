import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings, getExpenses, getBudgets } from '../utils/storage';
import toast from 'react-hot-toast';

export default function Settings() {
  const [settings, setSettings] = useState({ name: '', currency: '₹' });

  useEffect(() => { setSettings(getSettings()); }, []);

  const handleSave = (e) => {
    e.preventDefault();
    saveSettings(settings);
    toast.success('Settings saved!');
  };

  const handleClearData = () => {
    if (!window.confirm('Delete ALL data? This cannot be undone!')) return;
    localStorage.clear();
    toast.success('All data cleared');
  };

  const expenseCount = getExpenses().length;
  const budgetCount = getBudgets().length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your preferences</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900 }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: 20 }}>⚙️ Preferences</h3>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Your Name</label>
              <input className="form-control" placeholder="Your name" value={settings.name}
                onChange={e => setSettings(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label>Currency Symbol</label>
              <select className="form-control" value={settings.currency} onChange={e => setSettings(p => ({ ...p, currency: e.target.value }))}>
                <option value="₹">₹ Indian Rupee</option>
                <option value="$">$ US Dollar</option>
                <option value="€">€ Euro</option>
                <option value="£">£ British Pound</option>
                <option value="¥">¥ Japanese Yen</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Save Settings
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', marginBottom: 20 }}>📊 Data Overview</h3>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Transactions</span>
              <strong>{expenseCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Budgets</span>
              <strong>{budgetCount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Storage</span>
              <strong>LocalStorage</strong>
            </div>
          </div>

          <div style={{ padding: 16, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10 }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: 8, color: 'var(--danger)' }}>⚠️ Danger Zone</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 12 }}>This will permanently delete all your transactions and budgets.</p>
            <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleClearData}>
              🗑 Clear All Data
            </button>
          </div>

          <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: 10, color: 'var(--text-secondary)' }}>ABOUT</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <div>App: <strong style={{ color: 'var(--text-primary)' }}>Spendwise</strong></div>
              <div>Version: <strong style={{ color: 'var(--text-primary)' }}>1.0.0</strong></div>
              <div>Stack: <strong style={{ color: 'var(--text-primary)' }}>React + LocalStorage</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
