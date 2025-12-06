import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/axios'

const DoctorDetail = () => {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [docRes, slotRes] = await Promise.all([
          api.get(`doctors/${id}/`),
          api.get(`doctors/${id}/slots/`),
        ])
        setDoctor(docRes.data)
        setSlots(slotRes.data || [])
      } catch (err) {
        const errorMsg = err.response?.data?.detail || err.message || 'Failed to load doctor details'
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchData()
    }
  }, [id])

  const bookAppointment = async (slotId) => {
    setMessage('')
    try {
      await api.post('appointments/', { slot_id: slotId })
      setMessage('Appointment requested successfully.')
      // Refresh slots after booking
      const slotRes = await api.get(`doctors/${id}/slots/`)
      setSlots(slotRes.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.slot_id?.[0] || err.message || 'Failed to book appointment'
      setMessage(errorMsg)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="message message-error">{error}</div>
  if (!doctor) return <div className="empty-state">Doctor not found</div>

  return (
    <div>
      <div className="page-card">
        <h2 className="page-title">{doctor.name || 'Unknown'}</h2>
        <p className="page-subtitle">
          <strong>Specialization:</strong> {doctor.specialization || 'N/A'}
        </p>
        <p className="page-subtitle">
          <strong>Email:</strong> {doctor.email || 'N/A'}
        </p>
      </div>

      <h3 className="section-title">Available Slots</h3>
      {message && (
        <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      {slots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No available slots</div>
        </div>
      ) : (
        <div className="slots-grid">
          {slots.map((s) => (
            <div key={s.id} className="slot-card">
              <div className="slot-date">{s.date}</div>
              <div className="slot-time">
                {s.start_time} - {s.end_time}
              </div>
              <button className="btn btn-primary btn-small" onClick={() => bookAppointment(s.id)}>
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorDetail
