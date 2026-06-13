# WARP.md

This file provides guidance to WARP when working with this repository.

## Core Commands

### Backend

From `backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend expects PostgreSQL. Use `DATABASE_URL` for Supabase or local PostgreSQL.

### Frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL=http://localhost:8000/api/` for local development.

## Architecture

- `backend/` contains the Django project `hospital_backend` and the DRF app `booking`.
- `frontend/` contains the React/Vite SPA.
- Authentication uses JWT through SimpleJWT.
- Role-based access is enforced for `PATIENT`, `DOCTOR`, and `ADMIN`.
- PostgreSQL is configured through `DATABASE_URL` using `dj-database-url`.
- Static files are served in production with WhiteNoise.

## Important Endpoints

- `POST /api/patient/register`
- `POST /api/patient/login`
- `GET/PATCH /api/patient/profile`
- `POST /api/doctor/login`
- `GET /api/doctor/dashboard-stats`
- `POST /api/admin/login`
- `GET /api/admin/analytics`
- `GET /api/doctors/`
- `GET /api/doctors/<id>/slots/`
- `GET/POST /api/appointments/`
- `POST /api/appointments/<id>/approve/`
- `POST /api/appointments/<id>/reject/`
- `POST /api/appointments/<id>/cancel/`

## Deployment

- Backend: Render, configured by `render.yaml`.
- Database: Supabase PostgreSQL or any managed PostgreSQL database.
- Frontend: Vercel, configured with `VITE_API_BASE_URL`.

See `README.md` and `ENVIRONMENT.md` for setup details.
