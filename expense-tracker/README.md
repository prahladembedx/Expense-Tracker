# 💸 Spendwise — Advanced Expense Tracker

A full-stack expense tracker built with **React + Node.js/Express + MongoDB**.

---

## 🚀 Features

- **Authentication** — Register/Login with JWT, update profile & password
- **Transactions** — Add, edit, delete, bulk-delete income & expenses
- **Smart Filters** — Filter by type, category, date range, search by title
- **Budget Manager** — Set monthly budgets per category with alert thresholds
- **Analytics Dashboard** — Donut charts, bar charts, line charts, daily spending
- **Trend Analysis** — 12-month income vs expense trend line
- **Top Expenses** — See your biggest spending items per month
- **Pagination** — Efficient pagination for large transaction lists
- **Security** — Helmet, CORS, rate limiting, bcrypt, JWT

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Expense.js         # Expense/Income schema
│   │   └── Budget.js          # Budget schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth
│   │   ├── expenses.js        # /api/expenses
│   │   ├── budgets.js         # /api/budgets
│   │   ├── categories.js      # /api/categories
│   │   └── analytics.js       # /api/analytics
│   ├── server.js              # Express app entry
│   ├── .env.example           # Environment variables template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout/        # Sidebar + Topbar layout
    │   ├── context/
    │   │   └── AuthContext.jsx # Global auth state
    │   ├── pages/
    │   │   ├── Dashboard.jsx  # Overview + charts
    │   │   ├── Expenses.jsx   # Full CRUD transactions
    │   │   ├── Budget.jsx     # Budget management
    │   │   ├── Analytics.jsx  # Deep analytics
    │   │   ├── Settings.jsx   # Profile & password
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── utils/
    │   │   └── api.js         # Axios instance with auth interceptors
    │   ├── App.jsx            # Routes
    │   ├── index.js
    │   └── index.css          # Global design system
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

Start the backend:
```bash
npm run dev        # with nodemon (auto-reload)
# or
npm start          # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

The `"proxy": "http://localhost:5000"` in `package.json` forwards API calls.

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/updateprofile` | Update profile |
| PUT | `/api/auth/updatepassword` | Change password |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | List with filters & pagination |
| POST | `/api/expenses` | Create transaction |
| PUT | `/api/expenses/:id` | Update transaction |
| DELETE | `/api/expenses/:id` | Delete transaction |
| DELETE | `/api/expenses/bulk/delete` | Bulk delete |

**Query params:** `page`, `limit`, `type`, `category`, `search`, `startDate`, `endDate`, `tags`, `sortBy`, `sortOrder`

### Budgets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets?month=&year=` | Get budgets with spending |
| POST | `/api/budgets` | Set budget (upserts) |
| PUT | `/api/budgets/:id` | Update budget |
| DELETE | `/api/budgets/:id` | Delete budget |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Monthly totals |
| GET | `/api/analytics/by-category` | Spending by category |
| GET | `/api/analytics/trend` | Multi-month trend |
| GET | `/api/analytics/daily` | Daily spending |
| GET | `/api/analytics/top-expenses` | Top expenses |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Chart.js, react-chartjs-2 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Security | Helmet, express-rate-limit, CORS |
| Notifications | react-hot-toast |
| Date utils | date-fns |

---

## 🚢 Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in dashboard
2. `npm start` as start command

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL=https://your-backend.com/api`
2. Update `api.js` baseURL to use env var

---

## 📜 License

MIT
