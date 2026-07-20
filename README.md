# Full-Stack Task Management Application

A **production-ready** Full-Stack Task Management Web Application built with **Flask** (backend) and **React.js + Vite** (frontend). Features JWT authentication, full CRUD for tasks, rich filtering/sorting/pagination, and a beautiful responsive UI with dark mode.

---

## 🚀 Tech Stack

| Layer      | Technology |
|------------|-----------|
| Backend    | Python 3.12, Flask, Flask-RESTful, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS |
| Database   | SQLite (with SQLAlchemy ORM + Flask-Migrate) |
| Validation | Marshmallow |
| Frontend   | React.js (Vite), React Router DOM, Axios, Tailwind CSS v4 |
| UI         | React Toastify, React Icons |
| Testing    | Pytest, pytest-flask |

---

## 📁 Project Structure

```
task-manager/
│
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models (User, Task)
│   │   ├── schemas/         # Marshmallow schemas
│   │   ├── services/        # Business logic layer
│   │   ├── routes/          # Flask blueprints (auth, tasks)
│   │   ├── utils/           # response helpers, validators
│   │   ├── config.py        # Dev/Test/Prod configs
│   │   ├── extensions.py    # Flask extension singletons
│   │   └── __init__.py      # App factory
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   └── test_tasks.py
│   ├── run.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      # Sidebar, Navbar, Layout
│   │   │   ├── common/      # Spinner, ConfirmDialog, StatCard
│   │   │   └── tasks/       # TaskTable, TaskFilters, TaskForm
│   │   ├── pages/           # Login, Register, Dashboard, TaskList, etc.
│   │   ├── services/        # api.js, authService.js, taskService.js
│   │   ├── context/         # AuthContext, ThemeContext
│   │   ├── hooks/           # useTasks.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm 9+

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Configure environment variables
# Edit .env (already created with defaults)

# 6. Run Flask migrations (optional — tables auto-created)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# 7. Start the development server
python run.py
# OR
flask run
```

Flask runs at: **http://localhost:5000**

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

React runs at: **http://localhost:5173**

> All `/api` requests are proxied to `http://localhost:5000` via Vite proxy config.

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_APP` | Flask entry point | `run.py` |
| `FLASK_ENV` | Environment | `development` |
| `SECRET_KEY` | Flask secret key | Change before production! |
| `JWT_SECRET_KEY` | JWT signing key | Change before production! |
| `DATABASE_URL` | SQLite DB path | `sqlite:///task_manager.db` |

---

## 🔗 API Reference

### Base URL
```
http://localhost:5000/api
```

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

---

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | ❌ | Register a new user |
| `POST` | `/auth/login` | ❌ | Login and get JWT token |
| `GET`  | `/auth/profile` | ✅ | Get authenticated user profile |

#### POST /auth/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### POST /auth/login
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

---

### Task Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`    | `/tasks` | ✅ | List tasks (with filters) |
| `GET`    | `/tasks/stats` | ✅ | Dashboard statistics |
| `GET`    | `/tasks/:id` | ✅ | Get single task |
| `POST`   | `/tasks` | ✅ | Create task |
| `PUT`    | `/tasks/:id` | ✅ | Update task |
| `DELETE` | `/tasks/:id` | ✅ | Delete task |

#### Query Parameters (GET /tasks)

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by `Pending`, `In Progress`, `Completed` |
| `priority` | string | Filter by `Low`, `Medium`, `High` |
| `category` | string | Filter by category name (partial match) |
| `search` | string | Search in title and description |
| `sort_by` | string | `created_at` or `due_date` |
| `order` | string | `asc` or `desc` |
| `page` | int | Page number (default: 1) |
| `limit` | int | Items per page (default: 10, max: 100) |

#### Examples
```
GET /api/tasks?status=Completed
GET /api/tasks?priority=High&page=1&limit=5
GET /api/tasks?search=meeting&sort_by=due_date&order=asc
GET /api/tasks?category=Work
```

#### POST /tasks
```json
{
  "title": "Prepare quarterly report",
  "description": "Gather data and compile Q3 report",
  "status": "In Progress",
  "priority": "High",
  "category": "Work",
  "due_date": "2026-09-30"
}
```

---

## 🧪 Running Tests

```bash
cd backend

# Activate virtualenv first
venv\Scripts\activate   # Windows

# Run all tests with verbose output
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v
pytest tests/test_tasks.py -v

# Run with coverage
pip install pytest-cov
pytest tests/ -v --cov=app
```

---

## ✨ Features

### Backend
- ✅ App factory pattern with Flask blueprints
- ✅ JWT authentication (24h token expiry)
- ✅ Password hashing with Werkzeug
- ✅ Marshmallow schema validation
- ✅ Service layer (business logic decoupled from routes)
- ✅ Ownership enforcement (users can only access their own tasks)
- ✅ Full CRUD with filtering, sorting, pagination
- ✅ Dashboard statistics endpoint
- ✅ Standardized JSON responses
- ✅ Comprehensive Pytest test suite

### Frontend
- ✅ React Router v6 with protected/public routes
- ✅ JWT token persistence + session restore
- ✅ Dark mode (system preference + manual toggle + localStorage)
- ✅ Axios interceptors for token injection + 401 redirect
- ✅ Custom `useTasks` hook for state management
- ✅ Search, filter, sort, pagination
- ✅ Confirm dialog before delete
- ✅ Toast notifications for all actions
- ✅ Responsive design (mobile-first)
- ✅ Indigo/violet glassmorphism dark theme
- ✅ Micro-animations and hover effects

---

## 📮 Postman Collection

Import this collection snippet to test APIs quickly:

```json
{
  "info": { "name": "Task Management API" },
  "variable": [
    { "key": "base_url", "value": "http://localhost:5000/api" },
    { "key": "token", "value": "" }
  ],
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}",
          "options": { "raw": { "language": "json" } }
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}",
          "options": { "raw": { "language": "json" } }
        }
      }
    },
    {
      "name": "Get Tasks",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/tasks",
        "header": [{ "key": "Authorization", "value": "Bearer {{token}}" }]
      }
    }
  ]
}
```

---

## 🔒 Security Notes

- ⚠️ Change `SECRET_KEY` and `JWT_SECRET_KEY` in `.env` before deploying to production
- JWT tokens are stored in `localStorage` (suitable for SPAs; use HttpOnly cookies for higher security)
- All task endpoints validate ownership — users can only access/modify their own tasks
- Passwords are never stored or returned in plain text

---

## 📄 License

MIT License — feel free to use this for your portfolio or as a learning reference.
