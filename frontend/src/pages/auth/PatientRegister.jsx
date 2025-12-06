import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'

const PatientRegister = () => {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    medical_history: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('patient/register', {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
        medical_history: form.medical_history || '',
      })
      navigate('/patient/login')
    } catch (err) {
      let errorMessage = 'Registration failed'
      if (err.response?.data) {
        const data = err.response.data
        // Handle Django REST Framework validation errors
        if (typeof data === 'object') {
          // Collect all error messages
          const errors = []
          if (data.detail) {
            errors.push(data.detail)
          } else if (data.non_field_errors) {
            errors.push(...data.non_field_errors)
          } else {
            // Field-specific errors
            Object.keys(data).forEach((key) => {
              if (Array.isArray(data[key])) {
                errors.push(...data[key])
              } else {
                errors.push(data[key])
              }
            })
          }
          if (errors.length > 0) {
            errorMessage = errors.join('. ')
          }
        } else if (typeof data === 'string') {
          errorMessage = data
        }
      } else if (err.message) {
        errorMessage = err.message
      } else if (!err.response) {
        errorMessage = 'Network error. Please check if the backend server is running.'
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2 className="page-title">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Age</label>
            <input
              className="form-input"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            className="form-input"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
          <small style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
            Password must be at least 8 characters long and not too common.
          </small>
        </div>
        <div className="form-group">
          <label className="form-label">Medical History</label>
          <textarea
            className="form-textarea"
            name="medical_history"
            value={form.medical_history}
            onChange={handleChange}
          />
        </div>
        {error && <div className="message message-error">{error}</div>}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
        Already have an account? <Link to="/patient/login" style={{ color: '#2563eb' }}>Login</Link>
      </p>
    </div>
  )
}

export default PatientRegister
