import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const PatientLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('patient/login', { email, password })
      login(res.data)
      navigate('/patient/dashboard')
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || err.message || 'Invalid credentials'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2 className="page-title">Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </div>
        {error && <div className="message message-error">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280' }}>
        Don't have an account? <Link to="/patient/register" style={{ color: '#2563eb' }}>Register</Link>
      </p>
    </div>
  )
}

export default PatientLogin
