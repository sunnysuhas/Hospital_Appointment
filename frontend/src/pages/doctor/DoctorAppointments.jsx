import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadAppointments = async () => {
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

  useEffect(() => {
    loadAppointments()
  }, [])

  const updateStatus = async (id, action) => {
    setMessage('')
    try {
      await api.post(`appointments/${id}/${action}/`)
      setMessage(`Appointment ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      await loadAppointments()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || `Failed to ${action} appointment`
      setMessage(errorMsg)
    }
  }

  return (
    <div>
      <h2 className="page-title">Appointments</h2>
      {error && <div className="message message-error">{error}</div>}
      {message && (
        <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
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
                  <div className="appointment-patient">Patient: {a.patient || 'N/A'}</div>
                </div>
                <span className={`status-badge status-${(a.status || '').toLowerCase()}`}>
                  {a.status || 'UNKNOWN'}
                </span>
              </div>
              {a.status === 'PENDING' && (
                <div className="list-item-actions" style={{ marginTop: '0.75rem' }}>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => updateStatus(a.id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => updateStatus(a.id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorAppointments
