import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExpenses, getBudgets } from '../utils/storage';
import { format } from 'date-fns';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLORS = ['#6366f1','#2dd4bf','#f87171','#fbbf24','#60a5fa','#a78bfa','#34d399','#fb923c','#f472b6','#94a3b8'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    setExpenses(getExpenses());
    setBudgets(getBudgets());
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalIncome = monthExpenses.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = monthExpenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  // Category data for donut
  const categoryMap = {};
  monthExpenses.filter(e => e.type === 'expense').forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const donutData = {
    labels: Object.keys(categoryMap),
    datasets: [{ data: Object.values(categoryMap), backgroundColor: COLORS, borderWidth: 0 }]
  };

  // Last 6 months trend
  const trendLabels = [];
  const trendIncome = [];
  const trendExpense = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    trendLabels.push(MONTHS[d.getMonth()]);
    const monthData = expenses.filter(e => {
      const ed = new Date(e.date);
      return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
    });
    trendIncome.push(monthData.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0));
    trendExpense.push(monthData.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0));
  }

  const barData = {
    labels: trendLabels,
    datasets: [
      { label: 'Income', data: trendIncome, backgroundColor: 'rgba(45,212,191,0.7)', borderRadius: 6 },
      { label: 'Expenses', data: trendExpense, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 6 },
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#8888aa', font: { size: 11 } } } },
    scales: {
      x: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a38' } },
      y: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a38' } }
    }
  };

  // Budgets with spending
  const monthBudgets = budgets.filter(b => b.month === currentMonth && b.year === currentYear).map(b => {
    const spent = monthExpenses.filter(e => e.type === 'expense' && e.category === b.category).reduce((a, c) => a + c.amount, 0);
    return { ...b, spent, percentage: Math.round((spent / b.amount) * 100) };
  });

  const f = (n) => `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">{format(now, 'MMMM yyyy')} overview</p>
        </div>
        <Link to="/expenses" className="btn btn-primary">+ Add Transaction</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card income">
          <span className="stat-icon">💰</span>
          <div className="stat-label">Total Income</div>
          <div className="stat-value income">{f(totalIncome)}</div>
        </div>
        <div className="stat-card expense">
          <span className="stat-icon">💸</span>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value expense">{f(totalExpense)}</div>
        </div>
        <div className="stat-card balance">
          <span className="stat-icon">⚖️</span>
          <div className="stat-label">Net Balance</div>
          <div className="stat-value balance">{f(balance)}</div>
        </div>
        <div className="stat-card savings">
          <span className="stat-icon">📈</span>
          <div className="stat-label">Savings Rate</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{savingsRate}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>6-Month Trend</h3>
          {expenses.length > 0
            ? <Bar data={barData} options={chartOptions} />
            : <div className="empty-state"><div className="empty-icon">📊</div><p className="empty-text">Add transactions to see trend</p></div>
          }
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>Spending by Category</h3>
          {Object.keys(categoryMap).length > 0
            ? <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#8888aa', font: { size: 10 }, padding: 10 } } } }} />
            : <div className="empty-state"><div className="empty-icon">🍩</div><p className="empty-text">No expenses this month</p></div>
          }
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem' }}>Recent Transactions</h3>
            <Link to="/expenses" style={{ color: 'var(--accent-light)', fontSize: '0.8rem', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentExpenses.length === 0
            ? <div className="empty-state" style={{ padding: '30px 20px' }}><div className="empty-icon">🧾</div><p className="empty-text">No transactions yet</p></div>
            : recentExpenses.map(exp => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{exp.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.category} · {format(new Date(exp.date), 'MMM d')}</div>
                </div>
                <span style={{ color: exp.type === 'income' ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
                  {exp.type === 'income' ? '+' : '-'}{f(exp.amount)}
                </span>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem' }}>Budget Status</h3>
            <Link to="/budget" style={{ color: 'var(--accent-light)', fontSize: '0.8rem', textDecoration: 'none' }}>Manage →</Link>
          </div>
          {monthBudgets.length === 0
            ? <div className="empty-state" style={{ padding: '30px 20px' }}><div className="empty-icon">🎯</div><p className="empty-text">No budgets set</p></div>
            : monthBudgets.slice(0, 5).map(b => (
              <div key={b.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span>{b.category}</span>
                  <span style={{ color: b.percentage > 90 ? 'var(--danger)' : 'var(--text-secondary)' }}>{b.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.min(b.percentage, 100)}%`,
                    background: b.percentage > 90 ? 'var(--danger)' : b.percentage > 70 ? 'var(--warning)' : 'var(--success)'
                  }} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
