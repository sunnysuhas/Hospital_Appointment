# Hospital Appointment Booking System

Monolithic Hospital Appointment Booking System built with:
- Backend: Django + Django REST Framework + JWT (SimpleJWT)
- Frontend: React (Vite)
- Database: MySQL
- Containerization: Docker + docker-compose

## Folder structure

- `backend/` – Django project (`hospital_backend`) and app (`booking`)
- `frontend/` – React SPA (Vite) for patient, doctor, and admin UIs
- `docker-compose.yml` – Orchestrates MySQL, backend, and frontend
- `postman_collection.json` – Ready-to-import Postman collection

## Backend (Django + DRF)

### Models

Defined in `backend/booking/models.py`:
- `User` – Custom user extending `AbstractUser` with `role` (PATIENT, DOCTOR, ADMIN).
- `Patient` – One-to-one with `User`, fields: `full_name`, `age`, `gender`, `phone`, `medical_history`.
- `Doctor` – One-to-one with `User`, fields: `name`, `specialization`, `phone`.
- `Slot` – Fields: `doctor`, `date`, `start_time`, `end_time`.
- `Appointment` – Fields: `patient`, `doctor`, `slot`, `status` (PENDING/APPROVED/REJECTED), `created_at`.

### Key API endpoints

Base URL: `http://localhost:8000/api/`

Auth:
- `POST /api/patient/register`
- `POST /api/patient/login`
- `POST /api/doctor/login`
- `POST /api/admin/login`

Doctors & slots:
- `GET /api/doctors/` – List doctors (optional `?specialization=` filter).
- `GET /api/doctors/<id>/` – Doctor detail.
- `GET /api/doctors/<id>/slots/` – Doctor slots.
- `GET /api/slots/` – Doctor: list own slots.
- `POST /api/slots/` – Doctor: create slot.
- `PUT/PATCH/DELETE /api/slots/<id>/` – Doctor: edit/delete slot.

Appointments:
- `GET /api/appointments/` –
  - Patient: own appointments.
  - Doctor: appointments assigned to doctor.
  - Admin: all appointments, supports `?doctor_id=`, `?status=`, `?date=` filters.
- `POST /api/appointments/` – Patient: create appointment (body: `{ "slot_id": <id> }`).
- `POST /api/appointments/<id>/approve/` – Doctor/Admin.
- `POST /api/appointments/<id>/reject/` – Doctor/Admin.

Admin-only:
- `GET /api/admin/patients` – List patients.
- `GET /api/admin/doctors/` – List doctors (admin view).
- `POST /api/admin/doctors/` – Create doctor + linked user.
- `PUT/PATCH /api/admin/doctors/<id>/` – Update doctor.
- `DELETE /api/admin/doctors/<id>/` – Delete doctor + user.

### Auth and permissions

- JWT handled by `djangorestframework-simplejwt`.
- Login endpoints return: `access`, `refresh`, `role`, and relevant IDs (`user_id`, `patient_id` or `doctor_id`).
- Role-based permissions are implemented in `backend/booking/permissions.py` and used by viewsets.

### MySQL configuration

In `backend/hospital_backend/settings.py`:

- Engine: `django.db.backends.mysql`.
- Config via environment variables:
  - `MYSQL_DATABASE`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_HOST`
  - `MYSQL_PORT`

### Local backend commands (without Docker)

From `backend/` (with a Python env that has deps from `requirements.txt` installed and MySQL reachable):

```bash
python manage.py makemigrations booking
python manage.py migrate
python manage.py createsuperuser  # then set role=ADMIN via Django admin or shell
python manage.py runserver 0.0.0.0:8000
```

## Frontend (React + Vite)

Located in `frontend/`.

## Demo users (example registrations)

These are example accounts you can use locally. They are **not** created automatically; run the script below once to create them in your database.

- Admin: `rmanu93988@gmail.com` / `manu@123`
- Doctor: `doctor1@example.com` / `DoctorPass123!`
- Patient: `patient1@example.com` / `PatientPass123!`

### Creating the demo users

1. Make sure the stack is running:

```bash
cd <project-root>
docker compose up -d
```

2. Open a Django shell inside the backend container and run the following:

```bash
docker compose exec django-backend python manage.py shell
```

Then paste this Python code:

```python
from booking.models import User, Patient, Doctor

# 1) Admin user
admin, _ = User.objects.update_or_create(
    email="rmanu93988@gmail.com",
    defaults={
        "username": "rmanu93988@gmail.com",
        "role": User.Roles.ADMIN,
    },
)
admin.set_password("manu@123")
admin.save()

# 2) Doctor user + profile
doctor_user, _ = User.objects.update_or_create(
    email="doctor1@example.com",
    defaults={
        "username": "doctor1@example.com",
        "role": User.Roles.DOCTOR,
    },
)
doctor_user.set_password("DoctorPass123!")
doctor_user.save()

doctor_profile, _ = Doctor.objects.update_or_create(
    user=doctor_user,
    defaults={
        "name": "Dr. John Doe",
        "specialization": "Cardiology",
        "phone": "+1-555-000-1111",
    },
)

# 3) Patient user + profile
patient_user, _ = User.objects.update_or_create(
    email="patient1@example.com",
    defaults={
        "username": "patient1@example.com",
        "role": User.Roles.PATIENT,
    },
)
patient_user.set_password("PatientPass123!")
patient_user.save()

patient_profile, _ = Patient.objects.update_or_create(
    user=patient_user,
    defaults={
        "full_name": "Jane Smith",
        "age": 30,
        "gender": "F",
        "phone": "+1-555-222-3333",
        "medical_history": "N/A",
    },
)

print("Demo users created/updated:")
print("  Admin:", admin.email)
print("  Doctor:", doctor_user.email)
print("  Patient:", patient_user.email)
```

3. Exit the shell. You can now log in with the above credentials on the corresponding login pages in the frontend.

Key concepts:
- Routing via `react-router-dom` in `src/App.jsx`.
- Auth context in `src/context/AuthContext.jsx` – stores JWT tokens and role in `localStorage`.
- Axios client in `src/api/axios.js` – uses `VITE_API_BASE_URL` (defaults to `http://localhost:8000/api/`).

Pages:
- Public: `LandingPage`, `PatientLogin`, `PatientRegister`, `DoctorLogin`, `AdminLogin`.
- Patient: `PatientDashboard`, `DoctorList`, `DoctorDetail`, `AppointmentHistory`.
- Doctor: `DoctorDashboard`, `ManageSlots`, `DoctorAppointments`.
- Admin: `AdminDashboard`, `ManageDoctors`, `AppointmentsOverview`.

Protected routes are implemented via `src/routes/ProtectedRoute.jsx` and role checks.

### Local frontend commands (without Docker)

From `frontend/`:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Then open `http://localhost:3000`.

## Running with Docker and docker-compose

### Prerequisites

- Docker
- docker-compose (v2 or higher)

### Single command

From the repository root:

```bash
docker-compose up --build
```

This will:
- Start MySQL on port `3306`.
- Build and run the Django backend on `http://localhost:8000`.
- Build and run the React frontend on `http://localhost:3000`.
- Automatically run `makemigrations` and `migrate` for the `booking` app.

### Initial admin setup

After the containers are up:

1. Create an admin user inside the backend container:

   ```bash
   docker compose exec django-backend python manage.py createsuperuser
   ```

2. In Django admin (`http://localhost:8000/admin/`), edit that user and set `role = ADMIN`.

3. You can also create additional admin/doctor accounts via the admin UI or using the `/api/admin/doctors/` endpoints for doctors.

## AWS EC2 deployment guide

This project is designed to run on a single EC2 instance using Docker and docker-compose.

### 1. Launch EC2 instance

- Use Ubuntu LTS (e.g., 22.04).
- Instance size: t3.small or larger (for MySQL + app containers).
- Configure security group:
  - Allow SSH (22) from your IP.
  - Allow HTTP (80) from 0.0.0.0/0.
  - Optionally allow 3000/8000 for debugging (or use an Nginx proxy to expose only 80/443).

### 2. Install Docker and docker-compose

SSH into the instance and run:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and back in so your user can run `docker` without `sudo`.

### 3. Deploy the app

```bash
git clone <your-repo-url>.git hospital-app
cd hospital-app

# (optional) edit docker-compose.yml to adjust DB passwords, secrets, ALLOWED_HOSTS

docker compose up -d --build
```

- Backend will be on port 8000, frontend on 3000 by default.
- For public access over port 80/443, either:
  - Adjust security groups and map ports 80/443 in an Nginx reverse proxy container, or
  - Use an ALB (Application Load Balancer) pointing to the instance.

### 4. Environment hardening

For production:
- Set `DJANGO_DEBUG=0` and a strong `DJANGO_SECRET_KEY` in `docker-compose.yml` or EC2 environment.
- Restrict `DJANGO_ALLOWED_HOSTS` to your domain name and/or EC2 public IP.
- Use stronger MySQL credentials and consider external RDS if needed.

## Postman collection

Import `postman_collection.json` into Postman and set the `base_url` variable to `http://localhost:8000/api` (or your deployed backend URL). Use the login requests to obtain `access_token` and set it in the collection variable for authorized calls.
<<<<<<< HEAD
#   H o s p i t a l _ A p p o i n t m e n t 
 
 
=======
>>>>>>> a167918 (Updated code with new changes)
