import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div>
      <div className="landing-hero">
        <h1 className="landing-title">Hospital Appointment Booking System</h1>
        <p className="landing-subtitle">Book and manage appointments between patients and doctors.</p>
        <div className="landing-actions">
          <Link to="/patient/register" className="landing-link">
            Patient Register
          </Link>
          <Link to="/patient/login" className="landing-link">
            Patient Login
          </Link>
          <Link to="/doctor/login" className="landing-link">
            Doctor Login
          </Link>
          <Link to="/admin/login" className="landing-link">
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
