import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'

const DoctorList = () => {
  const [doctors, setDoctors] = useState([])
  const [specialization, setSpecialization] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (specialization) params.specialization = specialization
      const res = await api.get('doctors/', { params })
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
    fetchDoctors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilter = (e) => {
    e.preventDefault()
    fetchDoctors()
  }

  return (
    <div>
      <h2 className="page-title">Doctors</h2>
      <form onSubmit={handleFilter} className="filter-form">
        <div className="filter-group">
          <input
            className="filter-input"
            placeholder="Filter by specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Filter'}
        </button>
      </form>
      {error && <div className="message message-error">{error}</div>}
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
            <Link key={d.id} to={`/patient/doctors/${d.id}`} className="doctor-card">
              <div className="doctor-name">{d.name}</div>
              <div className="doctor-specialization">{d.specialization}</div>
              <div className="doctor-email">{d.email}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorList
