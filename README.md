# 💸 Spendwise — Expense Tracker

A modern, feature-rich expense tracking application built with **React**

🌐 **Live Demo:** [https://prahladembedx.github.io/Expense-Tracker](https://prahladembedx.github.io/Expense-Tracker)

---

## ✨ Features

- **💳 Transactions** — Add, edit, delete income & expenses with tags
- **🎯 Budget Manager** — Set monthly budgets per category with alert thresholds
- **📊 Analytics** — 12-month trends, daily spending, category breakdown
- **📈 Dashboard** — Overview with charts and recent transactions
- **🔍 Search & Filter** — Filter by type, category, search by title
- **🔔 Notifications** — Budget alert notifications
- **📱 PWA** — Installable on mobile and desktop
- **💾 LocalStorage** — No backend needed, data saved in browser
- **🌙 Dark Theme** — Beautiful dark UI

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI Framework |
| **React Router v6** | Navigation |
| **Chart.js** | Charts & Graphs |
| **react-chartjs-2** | React Chart wrapper |
| **react-hot-toast** | Notifications |
| **date-fns** | Date formatting |
| **LocalStorage API** | Data persistence |
| **CSS Variables** | Design system |

---

## 📁 Project Structure

```
frontend/
└── src/
    ├── components/
    │   └── Layout/        # Sidebar + Topbar
    ├── pages/
    │   ├── Dashboard.jsx  # Overview + Charts
    │   ├── Expenses.jsx   # Transaction CRUD
    │   ├── Budget.jsx     # Budget Management
    │   ├── Analytics.jsx  # Deep Analytics
    │   └── Settings.jsx   # Preferences
    ├── utils/
    │   └── storage.js     # LocalStorage utility
    └── App.jsx            # Routes
```

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/prahladembedx/Expense-Tracker.git

# Go to frontend
cd Expense-Tracker/frontend

# Install dependencies
npm install

# Start the app
npm start
```

App runs on `http://localhost:3000`

---

## 📸 Pages

### 📊 Dashboard
- Summary cards (Income, Expense, Balance, Savings Rate)
- 6-month trend bar chart
- Category donut chart
- Recent transactions list
- Budget status overview

### 💳 Transactions
- Full CRUD operations
- Search & filter by type/category
- Bulk delete
- Tags & payment method tracking
- Pagination

### 🎯 Budget
- Monthly budget per category
- Live progress bars
- Alert warnings at custom threshold
- Month navigation

### 📈 Analytics
- 12-month income vs expense line chart
- Daily spending bar chart
- Category breakdown with progress bars
- Top 5 expenses of the month

---

## 💡 How It Works

```
User adds expense
      ↓
Data saved in LocalStorage
      ↓
Charts & Dashboard update automatically
      ↓
Data persists even after browser refresh
```

---

## 📜 License

```
Copyright (c) 2026 prahladembedx. All Rights Reserved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This project is publicly visible for inspiration and
learning purposes only. Copying, redistribution, or
commercial use of this project without written permission
from the author is not allowed.

If you'd like to collaborate or have any questions,
feel free to reach out! 🙂

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GitHub  : https://github.com/prahladembedx
AUTHOR : prahladembedx

```

<div align="center">

⭐ Star this repo if you found it helpful!

</div>
