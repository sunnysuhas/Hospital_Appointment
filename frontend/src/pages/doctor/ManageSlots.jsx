import React, { useEffect, useState } from 'react'
import api from '../../api/axios'

const ManageSlots = () => {
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ date: '', start_time: '', end_time: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadSlots = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('slots/')
      setSlots(res.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load slots'
      setError(errorMsg)
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSlots()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await api.post('slots/', form)
      setForm({ date: '', start_time: '', end_time: '' })
      setMessage('Slot added successfully')
      await loadSlots()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join('. ') || err.message || 'Failed to add slot'
      setError(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return
    setMessage('')
    setError('')
    try {
      await api.delete(`slots/${id}/`)
      setMessage('Slot deleted successfully')
      await loadSlots()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to delete slot'
      setError(errorMsg)
    }
  }

  return (
    <div>
      <h2 className="page-title">Manage Slots</h2>
      {error && <div className="message message-error">{error}</div>}
      {message && (
        <div className={`message ${message.includes('successfully') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      <div className="page-card">
        <h3 className="section-title">Add New Slot</h3>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                className="form-input"
                name="start_time"
                type="time"
                value={form.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                className="form-input"
                name="end_time"
                type="time"
                value={form.end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Slot
          </button>
        </form>
      </div>

      <h3 className="section-title">My Slots</h3>
      {loading ? (
        <div className="loading">Loading slots...</div>
      ) : slots.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <div className="empty-state-text">No slots created yet</div>
        </div>
      ) : (
        <div className="slots-grid">
          {slots.map((s) => (
            <div key={s.id} className="slot-card">
              <div className="slot-date">{s.date}</div>
              <div className="slot-time">
                {s.start_time} - {s.end_time}
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => handleDelete(s.id)}
                style={{ width: '100%' }}
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

export default ManageSlots
