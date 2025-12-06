import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadDoctors = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('admin/doctors/')
      setDoctors(res.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load doctors'
      setError(errorMsg)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await api.post('admin/doctors/', form)
      setForm({ name: '', email: '', password: '', specialization: '', phone: '' })
      setMessage('Doctor created successfully')
      await loadDoctors()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join('. ') || err.message || 'Failed to create doctor'
      setError(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) return
    setMessage('')
    setError('')
    try {
      await api.delete(`admin/doctors/${id}/`)
      setMessage('Doctor deleted successfully')
      await loadDoctors()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to delete doctor'
      setError(errorMsg)
    }
  }

  return (
    <div>
      <h2 className="page-title">Manage Doctors</h2>
      {error && <div className="message message-error">{error}</div>}
      {message && (
        <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      <div className="page-card">
        <h3 className="section-title">Add New Doctor</h3>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                name="name"
                placeholder="Name"
                value={form.name}
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
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                className="form-input"
                name="specialization"
                placeholder="Specialization"
                value={form.specialization}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              className="form-input"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Doctor
          </button>
        </form>
      </div>

      <h3 className="section-title">All Doctors</h3>
      {loading ? (
        <div className="loading">Loading doctors...</div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👨‍⚕️</div>
          <div className="empty-state-text">No doctors found</div>
        </div>
      ) : (
        <div className="doctor-grid">
          {doctors.map((d) => (
            <div key={d.id} className="doctor-card">
              <div className="doctor-name">{d.name}</div>
              <div className="doctor-specialization">{d.specialization}</div>
              <div className="doctor-email">{d.email}</div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(d.id)}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ManageDoctors
