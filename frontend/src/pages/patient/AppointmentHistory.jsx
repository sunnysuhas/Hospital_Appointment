import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('appointments/')
        setAppointments(res.data || [])
      } catch (err) {
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to load appointments'
        setError(errorMsg)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [])

  return (
    <div>
      <h2 className="page-title">My Appointments</h2>
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
                  <div className="appointment-date">{a.slot?.date || 'N/A'}</div>
                  <div className="appointment-time">
                    {a.slot?.start_time || 'N/A'} - {a.slot?.end_time || 'N/A'}
                  </div>
                  <div className="appointment-doctor">Doctor: {a.doctor?.name || 'N/A'}</div>
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

export default AppointmentHistory
