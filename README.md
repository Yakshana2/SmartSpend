# 💰 SmartSpend

A full-stack expense tracker web application built with FastAPI, PostgreSQL (Supabase), and React.

---

## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | Python 3.11 + FastAPI                   |
| Database   | PostgreSQL via Supabase (free tier)     |
| Auth       | JWT (python-jose + passlib/bcrypt)      |
| Migrations | Alembic                                 |
| Frontend   | React 18 + Vite + React Router          |
| Charts     | Recharts                                |
| Testing    | Pytest (API) + Playwright (E2E)         |
| CI/CD      | GitHub Actions                          |

---

## Project Structure

```
SmartSpend/
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # SQLAlchemy engine + session
│   ├── models.py         # ORM models (User, Expense, Category)
│   ├── schemas.py        # Pydantic schemas
│   ├── auth.py           # JWT helpers + current_user dependency
│   └── routers/
│       ├── auth.py       # /api/auth/* endpoints
│       ├── expenses.py   # /api/expenses/* endpoints
│       └── categories.py # /api/categories/* endpoints
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios API clients
│   │   ├── components/   # Layout, Modal, ExpenseForm
│   │   ├── hooks/        # useAuth hook
│   │   └── pages/        # Dashboard, Expenses, Categories, Login, Register
│   ├── playwright.config.js
│   └── package.json
├── tests/
│   ├── conftest.py       # Pytest fixtures (SQLite in-memory)
│   ├── test_auth.py
│   ├── test_expenses.py
│   ├── test_categories.py
│   └── e2e/
│       ├── auth.spec.js
│       └── expenses.spec.js
├── alembic/              # Database migrations
├── .github/workflows/
│   └── ci.yml            # CI pipeline
├── requirements.txt
└── .env.example
```

---

## Getting Started

### 1. Clone and configure environment

```bash
git clone <your-repo>
cd SmartSpend
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL and a SECRET_KEY
```

### 2. Backend setup

```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start the API server
uvicorn backend.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

---

## Running Tests

### API tests (Pytest)

```bash
# From project root (uses SQLite, no Supabase needed)
pytest tests/ -v --ignore=tests/e2e
```

### E2E tests (Playwright)

```bash
cd frontend
npx playwright install chromium   # first time only
npx playwright test
npx playwright test --ui          # interactive mode
```

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy the connection string
3. Paste it as `DATABASE_URL` in your `.env` file
4. Run `alembic upgrade head` to create the tables

---

## API Endpoints

| Method | Path                    | Description              | Auth |
|--------|-------------------------|--------------------------|------|
| POST   | /api/auth/register      | Register new user        | ❌   |
| POST   | /api/auth/login         | Login, get JWT token     | ❌   |
| GET    | /api/auth/me            | Get current user         | ✅   |
| GET    | /api/expenses/          | List expenses            | ✅   |
| POST   | /api/expenses/          | Create expense           | ✅   |
| GET    | /api/expenses/summary   | Spending summary         | ✅   |
| GET    | /api/expenses/{id}      | Get expense by ID        | ✅   |
| PUT    | /api/expenses/{id}      | Update expense           | ✅   |
| DELETE | /api/expenses/{id}      | Delete expense           | ✅   |
| GET    | /api/categories/        | List categories          | ✅   |
| POST   | /api/categories/        | Create category          | ✅   |
| DELETE | /api/categories/{id}    | Delete category          | ✅   |

---

## CI/CD

GitHub Actions runs on every push to `main` or `develop`:

1. **Backend Tests** — Pytest with SQLite (no DB required)
2. **Frontend Build** — Vite production build
3. **E2E Tests** — Playwright against both running servers
