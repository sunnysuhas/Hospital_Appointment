# 🏥 Hospital System: Quick Start Guide

Welcome to your premium Hospital Appointment Booking System! Follow these simple steps to get the application running and start managing patient bookings.

---

## 🚀 Part 1: How to Start the Application

The most reliable way to run the entire system (Database + Backend + Frontend) is using **Docker**.

### 1. Launch the System
Open your terminal in the project root directory and run:

```bash
docker-compose up --build
```
*Wait for the internal services to initialize. Once ready, you can access the apps below.*

### 2. Access Links
- **Frontend (UI):** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)
- **New Admin Login:**
  - **Email:** `sunnysuhas108@gmail.com`
  - **Password:** `suhas2005`

---

## 👤 Part 2: Working with the Patient Application

Here is how a patient "applies" and books an appointment in the new system.

### 1. Registration
1. Navigate to the **[Register Page](http://localhost:3000/patient/register)** from the home screen.
2. Fill in the professional registration form (Name, Email, Age, etc.).
3. Once registered, you will be redirected to the **Login** screen.

### 2. Finding a Specialist
1. Log in with your new patient credentials.
2. From your **Dashboard**, click on **"Find Doctors"** in the sidebar.
3. Browse the gallery of medical specialists. You can **filter by specialization** (e.g., Cardiology, Neurology) to find exactly who you need.

### 3. Booking an Appointment
1. Click **"View Details"** on your chosen doctor's card.
2. You will see an **interactive calendar grid** of available slots.
3. Select a time slot that fits your schedule and click **"Book Appointment"**.
4. You will receive an instant **toast notification** confirming your request.

### 4. Tracking Your Status
1. Go to **"My Appointments"** in the sidebar.
2. You can track whether your appointment is `PENDING`, `APPROVED`, or `REJECTED` by the clinical team.

---

> [!TIP]
> **Need help?**
> - For admin tasks (managing doctors), log in at `/admin/login`.
> - For doctor tasks (managing availability), log in at `/doctor/login`.
