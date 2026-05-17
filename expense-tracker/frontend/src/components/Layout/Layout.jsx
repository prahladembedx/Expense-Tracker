import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './Layout.css';

const navItems = [
  { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { path: '/expenses', icon: '💳', label: 'Transactions' },
  { path: '/budget', icon: '🎯', label: 'Budgets' },
  { path: '/analytics', icon: '📊', label: 'Analytics' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">💸</div>
          <span className="logo-text">Spendwise</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spendwise v1.0</span>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <div className="topbar-right">
            <span className="greeting">💸 Spendwise</span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
