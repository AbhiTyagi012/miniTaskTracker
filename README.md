# Mini Task Tracker

A simple, clean task tracker built with React + FastAPI + MongoDB.

## Live Demo

- **Frontend**: https://mini-task-tracker-alpha.vercel.app
- **Backend API**: https://minitasktracker.onrender.com

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| HTTP client | Axios |
| Backend | FastAPI (Python 3.11+) |
| Database | MongoDB (Motor async driver) |
| Frontend hosting | Vercel |
| Backend hosting | Render |
| DB hosting | MongoDB Atlas |

---

## Project Structure

```
miniTaskTracker/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, lifespan
│   │   ├── config.py        # Environment settings
│   │   ├── database.py      # Motor async MongoDB client
│   │   ├── models/
│   │   │   └── task.py      # Pydantic schemas + serializer
│   │   └── routes/
│   │       └── tasks.py     # CRUD endpoints
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── tasks.js     # All API calls (axios)
    │   ├── components/
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskList.jsx
    │   │   ├── CreateTaskModal.jsx
    │   │   ├── FilterBar.jsx
    │   │   └── SearchBar.jsx
    │   ├── hooks/
    │   │   └── useTasks.js  # State + data fetching
    │   ├── pages/
    │   │   └── Home.jsx
    │   └── App.jsx
    ├── vercel.json
    └── .env.example
```

---

## How to Run Locally

### Prerequisites

- Node.js 18+
- Python 3.11+
- A MongoDB Atlas cluster (free tier works) or local MongoDB instance

### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set MONGODB_URL to your Atlas connection string

# Start the server
uvicorn app.main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 2. Frontend

```bash
cd frontend

npm install

# Set API base URL (already set for local dev)
cp .env.example .env

npm run dev
# App available at http://localhost:5173
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/tasks` | List tasks (`?status=open\|completed`, `?search=term`) |
| `POST` | `/tasks` | Create task |
| `PATCH` | `/tasks/{id}` | Update task (status, title, etc.) |
| `DELETE` | `/tasks/{id}` | Delete task |
| `GET` | `/health` | Health check |

---

## Deployment

### Backend → Render

1. Create a new **Web Service** on Render
2. Connect the GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables: `MONGODB_URL`, `DB_NAME`

### Frontend → Vercel

1. Import the repo on Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=<your-render-backend-url>`
4. Deploy

---

## Known Limitations

- No authentication — all tasks are shared/public
- No pagination (loads up to 1000 tasks)
- Search is server-side regex on MongoDB (case-insensitive, not full-text indexed)
- No task editing after creation (mark-complete and delete only)

---

## What I Would Improve With More Time

- Add text index on MongoDB `title` field for proper full-text search
- Task editing (click to edit title/description inline)
- Pagination or infinite scroll for large task lists
- User authentication with sessions
- Optimistic UI updates for snappier feel
- Unit tests for the FastAPI routes (pytest + httpx)
- Component tests for the React UI (Vitest + React Testing Library)
- Responsive polish for very small screens

---

## Approximate Time Spent

| Phase | Time |
|-------|------|
| Planning & architecture | ~20 min |
| Backend (FastAPI + MongoDB) | ~40 min |
| Frontend (React + Tailwind) | ~60 min |
| Docs & deployment config | ~20 min |
| **Total** | **~2.5 hours** |
