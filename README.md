# AdGenius AI

AdGenius AI is a modern AI-powered ad creation platform featuring a React (Vite + TypeScript + Tailwind CSS) frontend and a Python (FastAPI + SQLAlchemy + Alembic) backend.

## Project Structure

```
My AdGenius AI/
├── frontend/             # React + Vite + TS + Tailwind CSS
│   ├── src/
│   │   ├── api/          # Backend API services
│   │   ├── components/   # UI components
│   │   ├── context/      # React contexts (Auth)
│   │   ├── pages/        # Route pages
│   │   ├── routes/       # React Router setup
│   │   └── types/        # TypeScript interfaces
│   └── package.json
│
├── backend/              # FastAPI + SQLAlchemy + Pydantic
│   ├── app/
│   │   ├── auth/         # JWT auth & security
│   │   ├── database/     # DB session & base
│   │   ├── models/       # SQLAlchemy models
│   │   ├── providers/    # AI Integration providers interface
│   │   ├── repositories/ # Data access repository layer
│   │   ├── routes/       # API endpoints
│   │   ├── schemas/      # Pydantic validation schemas
│   │   ├── services/     # Business logic layer
│   │   ├── utils/        # Utilities & logging
│   │   └── main.py       # FastAPI application entrypoint
│   └── alembic/          # DB migrations
│
├── .env.example
├── .gitignore
└── README.md
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend health check URL: `http://127.0.0.1:8000/api/v1/health`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend UI URL: `http://localhost:5173`

## Features & Pages
- **Login**: `/login`
- **Signup**: `/signup`
- **Dashboard**: `/dashboard`
- **Creative Studio**: `/creative-studio`
- **Product To Image**: `/product-to-image`
- **Product To Video**: `/product-to-video`
- **AI Avatar**: `/ai-avatar`
- **My Ads**: `/my-ads`
- **Pricing**: `/pricing`
- **Profile**: `/profile`
- **Settings**: `/settings`
