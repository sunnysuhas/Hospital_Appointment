# MedBook - Hospital Appointment Booking System

MedBook is a production-ready hospital appointment booking platform built for three roles: patients, doctors, and administrators. It preserves a simple appointment workflow while adding a modern healthcare SaaS interface, PostgreSQL support, deployment-ready configuration, and dashboard analytics.

## Features

- JWT authentication with role-based access for `PATIENT`, `DOCTOR`, and `ADMIN`
- Patient registration and login
- Patient profile viewing and editing
- Doctor discovery with specialization search
- Appointment booking, history, and cancellation
- Doctor slot management
- Doctor appointment approval and rejection
- Doctor dashboard statistics for total, pending, and approved appointments
- Admin doctor management
- Admin appointment audit with filters
- Admin analytics for patients, doctors, appointments, status summary, and doctor activity
- Framer Motion page transitions and dashboard micro-interactions
- Recharts dashboard visualizations
- Toast notifications for login, registration, booking, approval, rejection, and cancellation flows
- Loading skeletons, empty states, and graceful network error messaging
- PostgreSQL/Supabase-ready backend
- Render-ready backend deployment with WhiteNoise static file serving
- Vercel-ready frontend deployment with `VITE_API_BASE_URL`

## Tech Stack

**Frontend**

- React 18
- Vite
- TailwindCSS
- Axios
- React Router
- Framer Motion
- Recharts
- React Hot Toast
- Lucide React

**Backend**

- Django
- Django REST Framework
- SimpleJWT
- WhiteNoise
- dj-database-url
- Gunicorn

**Database**

- PostgreSQL
- Supabase PostgreSQL supported through `DATABASE_URL`

**Deployment**

- Backend: Render
- Frontend: Vercel
- Database: Supabase PostgreSQL

## Project Structure

```text
backend/
  booking/
  hospital_backend/
  requirements.txt
  Procfile
  start.sh
frontend/
  src/
  package.json
render.yaml
ENVIRONMENT.md
vercel.json
```

## Environment Variables

Backend variables:

```env
DJANGO_SECRET_KEY=replace-with-a-secure-secret
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/hospital_db
DATABASE_SSL_REQUIRE=False
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend variables:

```env
VITE_API_BASE_URL=http://localhost:8000/api/
```

See [ENVIRONMENT.md](ENVIRONMENT.md) for production examples and deployment notes.

## Local Setup

### 1. Backend

Create and activate a virtual environment:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example`, then set your PostgreSQL connection.

Apply migrations and run the API:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Create an admin user:

```bash
python manage.py createsuperuser
```

After creating the user, set its `role` to `ADMIN` in Django admin or the Django shell.

### 2. Frontend

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/
```

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API Overview

Base URL:

```text
http://localhost:8000/api/
```

Auth:

- `POST /api/patient/register`
- `POST /api/patient/login`
- `POST /api/doctor/login`
- `POST /api/admin/login`

Patient:

- `GET /api/patient/profile`
- `PATCH /api/patient/profile`
- `GET /api/doctors/`
- `GET /api/doctors/<id>/slots/`
- `POST /api/appointments/`
- `POST /api/appointments/<id>/cancel/`

Doctor:

- `GET /api/doctor/dashboard-stats`
- `GET /api/slots/`
- `POST /api/slots/`
- `DELETE /api/slots/<id>/`
- `GET /api/appointments/`
- `POST /api/appointments/<id>/approve/`
- `POST /api/appointments/<id>/reject/`

Admin:

- `GET /api/admin/analytics`
- `GET /api/admin/patients`
- `GET /api/admin/doctors/`
- `POST /api/admin/doctors/`
- `PATCH /api/admin/doctors/<id>/`
- `DELETE /api/admin/doctors/<id>/`
- `GET /api/appointments/`

## Supabase Setup

1. Create a Supabase project.
2. Go to **Project Settings > Database**.
3. Copy the PostgreSQL connection string.
4. Replace the password placeholder.
5. Ensure the URL includes SSL, for example `?sslmode=require`.
6. Set the final value as `DATABASE_URL`.
7. Set `DATABASE_SSL_REQUIRE=True` in production.

## Render Deployment

The backend is configured with [render.yaml](render.yaml).

1. Push the repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Set these environment variables:
   - `DJANGO_SECRET_KEY`
   - `DJANGO_DEBUG=False`
   - `DATABASE_URL`
   - `DATABASE_SSL_REQUIRE=True`
   - `DJANGO_ALLOWED_HOSTS`
   - `CORS_ALLOWED_ORIGINS`
   - `CSRF_TRUSTED_ORIGINS`
4. Deploy.

`backend/start.sh` runs static collection, migrations, and Gunicorn.

## Vercel Deployment

1. Import the repository in Vercel.
2. Use the Vite preset.
3. Set the frontend root directory to `frontend`.
4. Add:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api/
```

5. Deploy the frontend.
6. Add your Vercel domain to `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` in Render.

## Screenshots

Add screenshots here after deployment:

- Landing page
- Patient dashboard
- Patient profile
- Doctor dashboard
- Admin analytics dashboard
- Appointment booking flow

## Future Improvements

- Email notifications for appointment status updates
- Calendar export for approved appointments
- Doctor profile photos and department pages
- Admin CSV export for appointment reports
- Automated tests for API permissions and role workflows
- CI pipeline for backend checks and frontend builds
- Password reset and email verification
- Audit logging for admin actions

## Notes

This project no longer requires Docker or a MySQL container. It runs locally with Python, Node.js, and PostgreSQL, and deploys cleanly to Render, Supabase, and Vercel.
