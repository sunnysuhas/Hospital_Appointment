import React, { useEffect, useState } from 'react'
import { Calendar, Clock, User, Stethoscope, Filter, Search, Info, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
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
      setError(err.response?.data?.detail || 'Failed to load appointments')
      setAppointments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleFilter = (e) => {
    e.preventDefault()
    loadAppointments()
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100'
      case 'CANCELLED': return 'bg-secondary-50 text-secondary-400 border-secondary-100'
      default: return 'bg-secondary-50 text-secondary-700 border-secondary-100'
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Appointment Audit</h1>
        <p className="text-secondary-500 mt-1">Global tracking system for all hospital consultations.</p>
      </div>

      {/* Filters Card */}
      <div className="card shadow-sm border-secondary-100">
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider flex items-center">
              <Filter size={12} className="mr-1" /> Status
            </label>
            <select className="input h-10 py-0" name="status" value={filters.status} onChange={handleChange}>
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider flex items-center">
              <Calendar size={12} className="mr-1" /> Date
            </label>
            <input
              className="input h-10"
              name="date"
              type="date"
              value={filters.date}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-secondary-500 uppercase tracking-wider flex items-center">
              <Stethoscope size={12} className="mr-1" /> Doctor ID
            </label>
            <input
              className="input h-10"
              name="doctor_id"
              placeholder="System ID"
              value={filters.doctor_id}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary h-10" disabled={loading}>
            {loading ? 'Searching...' : 'Apply Filters'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
          <Info size={20} className="mr-2" /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card h-24 animate-pulse bg-secondary-100/50"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-20 border-dashed border-2">
          <Search size={48} className="mx-auto text-secondary-200 mb-4" />
          <h3 className="text-xl font-bold text-secondary-900">No results found</h3>
          <p className="text-secondary-500 mt-2">Try adjusting your filters to find existing records.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="card p-0 overflow-hidden hover:border-primary-100 transition-colors group">
              <div className="flex items-center p-6 gap-6">
                <div className="flex-1 grid md:grid-cols-[2fr_1.5fr_1fr] gap-6 items-center">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 font-bold border border-primary-100">
                        #{a.id}
                      </div>
                      <div>
                        <div className="flex items-center text-sm font-bold text-secondary-900">
                           <User size={14} className="mr-2 text-secondary-400" /> Patient: {a.patient || 'Unknown'}
                        </div>
                        <div className="flex items-center text-xs text-secondary-500">
                           <Stethoscope size={14} className="mr-2 text-secondary-400" /> Doctor: {a.doctor?.name || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-semibold text-secondary-700">
                      <Calendar size={14} className="mr-2 text-primary-500" /> {a.slot?.date}
                    </div>
                    <div className="flex items-center text-xs text-secondary-500">
                      <Clock size={14} className="mr-2 text-primary-500" /> {a.slot?.start_time?.substring(0, 5)} - {a.slot?.end_time?.substring(0, 5)}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyles(a.status)}`}>
                      {a.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppointmentsOverview
