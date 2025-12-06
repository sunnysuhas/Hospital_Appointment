# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core commands

### Run full stack with Docker (recommended)

From the repo root:

- Start all services (MySQL, Django backend, React frontend):
  - `docker-compose up --build`
- Run in background:
  - `docker-compose up -d --build`
- View logs:
  - `docker-compose logs -f django-backend`
  - `docker-compose logs -f react-frontend`

The compose file will:
- Build `backend/` into the `django-backend` service (port 8000).
- Build `frontend/` into the `react-frontend` service (port 3000).
- Start a MySQL 8 database as `db` (port 3306) and run `makemigrations booking` + `migrate` automatically.

### Backend-only (Django + DRF)

From `backend/` with a Python env that has `requirements.txt` installed and MySQL reachable:

- Apply migrations:
  - `python manage.py makemigrations booking`
  - `python manage.py migrate`
- Run development server:
  - `python manage.py runserver 0.0.0.0:8000`
- Create an admin user (then set `role=ADMIN` via Django admin or shell):
  - `python manage.py createsuperuser`

### Frontend-only (React + Vite)

From `frontend/`:

- Install dependencies:
  - `npm install`
- Run dev server:
  - `npm run dev -- --host 0.0.0.0 --port 3000`

The frontend expects the backend at `VITE_API_BASE_URL` (default `http://localhost:8000/api/`).

## High-level architecture

### Overview

This is a monolithic hospital appointment booking system with:
- **Backend**: Django project `hospital_backend` and app `booking` exposing a REST API under `/api/`.
- **Frontend**: React SPA in `frontend/` (Vite) consuming the `/api/` endpoints.
- **Database**: MySQL (service `db` in `docker-compose.yml`).
- **Auth**: JWT using `djangorestframework-simplejwt`, with roles `PATIENT`, `DOCTOR`, and `ADMIN` stored in a custom `User` model.

### Backend structure (`backend/`)

- `hospital_backend/` – Django project wiring:
  - `settings.py` – MySQL DB config via env vars, DRF + SimpleJWT, CORS, and `AUTH_USER_MODEL = 'booking.User'`.
  - `urls.py` – Routes `/api/` to `booking.urls` and exposes Django admin at `/admin/`.
- `booking/` – Single app for all domain logic:
  - `models.py` – Custom `User` with `role`, plus `Patient`, `Doctor`, `Slot`, and `Appointment`.
  - `serializers.py` – Registration/login serializers and model serializers (Doctor, Slot, Appointment).
  - `permissions.py` – `IsPatient`, `IsDoctor`, `IsAdmin` role-based permissions.
  - `views.py` – Implements all required endpoints:
    - Auth: `/api/patient/register`, `/api/patient/login`, `/api/doctor/login`, `/api/admin/login`.
    - Doctors: `/api/doctors/`, `/api/doctors/<id>/`, `/api/doctors/<id>/slots/`.
    - Slots (doctor-managed): `/api/slots/`, `/api/slots/<id>/`.
    - Appointments: `/api/appointments/`, `/api/appointments/<id>/approve/`, `/api/appointments/<id>/reject/`.
  - `urls.py` – DRF router + explicit auth/admin routes.
  - `admin.py` – Registers `User`, `Patient`, `Doctor`, `Slot`, `Appointment` for Django admin.

Cross-cutting behavior:
- **Role-based access control** is enforced via `permissions.py` and checks inside view methods (e.g., only the owning doctor or an admin can approve/reject an appointment).
- **Appointment scoping** is handled in `AppointmentViewSet.get_queryset`:
  - Patients see their own appointments.
  - Doctors see appointments for their own slots.
  - Admins see all appointments and can filter via `doctor_id`, `status`, `date`.

### Frontend structure (`frontend/`)

- Vite + React app with routing and a simple layout:
  - `src/App.jsx` – Declares all routes and top navigation based on role.
  - `src/context/AuthContext.jsx` – Stores JWT tokens and role in `localStorage` and React context.
  - `src/api/axios.js` – Axios instance pointing at `VITE_API_BASE_URL` and attaching `Authorization: Bearer <access>`.
  - `src/routes/ProtectedRoute.jsx` – Simple role-based route guard.
- Pages:
  - Auth: patient register/login, doctor login, admin login.
  - Patient: dashboard, doctor list with specialization filter, doctor detail + slot booking, appointment history.
  - Doctor: dashboard, manage slots (CRUD via `/api/slots/`), appointment review with approve/reject.
  - Admin: dashboard, manage doctors (CRUD via `/api/admin/doctors/`), appointment overview with filters.

## Tool- and agent-specific notes

- Key project documentation:
  - `README.md` – End-to-end setup, commands, API summary, and AWS EC2 deployment guide.
  - `postman_collection.json` – Can be used for exploring and testing the API.
- No CLAUDE, Cursor, or Copilot rules are currently present; if they are added later, summarize any important behavioral constraints here so Warp agents can honor them.
