import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const AppointmentsOverview = () => {
  const [appointments, setAppointments] = useState([])
  const [filters, setFilters] = useState({ doctor_id: '', status: '', date: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (filters.doctor_id) params.doctor_id = filters.doctor_id
      if (filters.status) params.status = filters.status
      if (filters.date) params.date = filters.date
      const res = await api.get('appointments/', { params })
      setAppointments(res.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load appointments'
      setError(errorMsg)
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = (e) => {
    e.preventDefault()
    loadAppointments()
  }

  return (
    <div>
      <h2 className="page-title">Appointments Overview</h2>
      <form onSubmit={handleFilter} className="filter-form">
        <div className="filter-group">
          <label className="form-label">Doctor ID</label>
          <input
            className="filter-input"
            name="doctor_id"
            placeholder="Doctor ID"
            value={filters.doctor_id}
            onChange={handleChange}
          />
        </div>
        <div className="filter-group">
          <label className="form-label">Status</label>
          <select className="filter-input" name="status" value={filters.status} onChange={handleChange}>
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="form-label">Date</label>
          <input
            className="filter-input"
            name="date"
            type="date"
            value={filters.date}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Apply Filters'}
        </button>
      </form>
      {error && <div className="message message-error">{error}</div>}
      {loading ? (
        <div className="loading">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-text">No appointments found</div>
        </div>
      ) : (
        <div>
          {appointments.map((a) => (
            <div key={a.id} className="appointment-card">
              <div className="appointment-header">
                <div className="appointment-info">
                  <div className="appointment-date">
                    Appointment #{a.id || 'N/A'} - {a.slot?.date || 'N/A'}
                  </div>
                  <div className="appointment-time">
                    {a.slot?.start_time || 'N/A'} - {a.slot?.end_time || 'N/A'}
                  </div>
                  <div className="appointment-doctor">Doctor: {a.doctor?.name || 'N/A'}</div>
                  <div className="appointment-patient">Patient: {a.patient || 'N/A'}</div>
                </div>
                <span className={`status-badge status-${(a.status || '').toLowerCase()}`}>
                  {a.status || 'UNKNOWN'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppointmentsOverview
