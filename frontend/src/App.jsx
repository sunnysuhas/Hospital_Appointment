import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PatientLogin from './pages/auth/PatientLogin'
import PatientRegister from './pages/auth/PatientRegister'
import DoctorLogin from './pages/auth/DoctorLogin'
import AdminLogin from './pages/auth/AdminLogin'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorList from './pages/patient/DoctorList'
import DoctorDetail from './pages/patient/DoctorDetail'
import AppointmentHistory from './pages/patient/AppointmentHistory'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import ManageSlots from './pages/doctor/ManageSlots'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import AppointmentsOverview from './pages/admin/AppointmentsOverview'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'

const Layout = ({ children }) => {
  const { role, logout } = useAuth()
  return (
    <div className="app-root">
      <nav className="app-nav">
        <div className="app-nav-left">
          <span className="app-logo">Hospital Booking</span>
          <Link to="/" className="nav-link nav-link-primary">
            Home
          </Link>
        </div>
        {role === 'PATIENT' && (
          <>
            <Link to="/patient/dashboard" className="nav-link">
              Patient Dashboard
            </Link>
            <Link to="/patient/doctors" className="nav-link">
              Doctors
            </Link>
            <Link to="/patient/appointments" className="nav-link">
              My Appointments
            </Link>
          </>
        )}
        {role === 'DOCTOR' && (
          <>
            <Link to="/doctor/dashboard" className="nav-link">
              Doctor Dashboard
            </Link>
            <Link to="/doctor/slots" className="nav-link">
              My Slots
            </Link>
            <Link to="/doctor/appointments" className="nav-link">
              Appointments
            </Link>
          </>
        )}
        {role === 'ADMIN' && (
          <>
            <Link to="/admin/dashboard" className="nav-link">
              Admin Dashboard
            </Link>
            <Link to="/admin/doctors" className="nav-link">
              Manage Doctors
            </Link>
            <Link to="/admin/appointments" className="nav-link">
              Appointments
            </Link>
          </>
        )}
        {role ? (
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        ) : (
          <div className="app-nav-right">
            <Link to="/patient/login" className="nav-link">
              Patient Login
            </Link>
            <Link to="/doctor/login" className="nav-link">
              Doctor Login
            </Link>
            <Link to="/admin/login" className="btn btn-primary">
              Admin Login
            </Link>
          </div>
        )}
      </nav>
      <main className="app-main">{children}</main>
    </div>
  )
}

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <DoctorList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors/:id"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <DoctorDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/slots"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <ManageSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ManageDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AppointmentsOverview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
