import React, { useState, useEffect } from 'react';
import { getExpenses } from '../utils/storage';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

const COLORS = ['#6366f1','#2dd4bf','#f87171','#fbbf24','#60a5fa','#a78bfa','#34d399','#fb923c','#f472b6','#94a3b8'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const chartOpts = {
  responsive: true,
  plugins: { legend: { labels: { color: '#8888aa', font: { size: 11 } } } },
  scales: {
    x: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a38' } },
    y: { ticks: { color: '#8888aa' }, grid: { color: '#2a2a38' } }
  }
};

export default function Analytics() {
  const [expenses, setExpenses] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => { setExpenses(getExpenses()); }, []);

  const monthData = expenses.filter(e => new Date(e.date).getMonth() === month && new Date(e.date).getFullYear() === year);
  const totalIncome = monthData.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = monthData.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  // Category breakdown
  const categoryMap = {};
  monthData.filter(e => e.type === 'expense').forEach(e => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  // Donut
  const donutData = {
    labels: sortedCategories.map(c => c[0]),
    datasets: [{ data: sortedCategories.map(c => c[1]), backgroundColor: COLORS, borderWidth: 0 }]
  };

  // 12-month trend
  const trendLabels = [], trendIncome = [], trendExpense = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(year, month - i, 1);
    trendLabels.push(`${MONTHS[d.getMonth()]} ${d.getFullYear()}`);
    const md = expenses.filter(e => new Date(e.date).getMonth() === d.getMonth() && new Date(e.date).getFullYear() === d.getFullYear());
    trendIncome.push(md.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0));
    trendExpense.push(md.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0));
  }

  const lineData = {
    labels: trendLabels,
    datasets: [
      { label: 'Income', data: trendIncome, borderColor: '#2dd4bf', backgroundColor: 'rgba(45,212,191,0.1)', fill: true, tension: 0.4 },
      { label: 'Expenses', data: trendExpense, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 },
    ]
  };

  // Daily spending
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
    return monthData.filter(e => e.type === 'expense' && new Date(e.date).getDate() === i + 1).reduce((a, b) => a + b.amount, 0);
  });

  const barData = {
    labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    datasets: [{ label: 'Daily Spending', data: dailyData, backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4 }]
  };

  // Top 5 expenses
  const top5 = [...monthData].filter(e => e.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5);

  const f = (n) => `₹${(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your finances</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { let m = month - 1, y = year; if (m < 0) { m = 11; y--; } setMonth(m); setYear(y); }}>←</button>
          <span style={{ fontWeight: 600, minWidth: 110, textAlign: 'center' }}>{MONTHS[month]} {year}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => { let m = month + 1, y = year; if (m > 11) { m = 0; y++; } setMonth(m); setYear(y); }}>→</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card income"><div className="stat-label">Income</div><div className="stat-value income">{f(totalIncome)}</div></div>
        <div className="stat-card expense"><div className="stat-label">Expenses</div><div className="stat-value expense">{f(totalExpense)}</div></div>
        <div className="stat-card balance"><div className="stat-label">Balance</div><div className="stat-value balance">{f(balance)}</div></div>
        <div className="stat-card savings"><div className="stat-label">Savings Rate</div><div className="stat-value" style={{ color: 'var(--warning)' }}>{savingsRate}%</div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>12-Month Income vs Expenses</h3>
        <Line data={lineData} options={chartOpts} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>Daily Spending — {MONTHS[month]}</h3>
          {dailyData.some(d => d > 0)
            ? <Bar data={barData} options={chartOpts} />
            : <div className="empty-state"><div className="empty-icon">📅</div><p className="empty-text">No spending data</p></div>
          }
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 20, fontSize: '1rem' }}>By Category</h3>
          {sortedCategories.length > 0
            ? <Doughnut data={donutData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#8888aa', font: { size: 10 }, padding: 8 } } } }} />
            : <div className="empty-state"><div className="empty-icon">🍩</div><p className="empty-text">No data</p></div>
          }
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Spending by Category</h3>
          {sortedCategories.length === 0
            ? <div className="empty-state" style={{ padding: 20 }}><p className="empty-text">No data</p></div>
            : sortedCategories.map(([cat, amt], i) => {
              const pct = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
              return (
                <div key={cat} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 5 }}>
                    <span>{cat}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{f(amt)} ({pct}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })
          }
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Top 5 Expenses</h3>
          {top5.length === 0
            ? <div className="empty-state" style={{ padding: 20 }}><p className="empty-text">No expenses</p></div>
            : top5.map((e, i) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 24, height: 24, background: 'var(--bg-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{e.category}</div>
                </div>
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{f(e.amount)}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}
