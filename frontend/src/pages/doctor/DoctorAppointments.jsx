import React, { useEffect, useState } from 'react'
import { Calendar, Clock, User, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAppointments = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('appointments/')
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

  const updateStatus = async (id, action) => {
    const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} appointment...`)
    try {
      await api.post(`appointments/${id}/${action}/`)
      toast.success(`Appointment ${action === 'approve' ? 'approved' : 'rejected'}.`, { id: toastId })
      await loadAppointments()
    } catch (err) {
      toast.error(`Failed to ${action} appointment.`, { id: toastId })
    }
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
        <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Consultation Requests</h1>
        <p className="text-secondary-500 mt-1">Review and manage patient appointment bookings.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
          <Info size={20} className="mr-2" /> {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card h-28 animate-pulse bg-secondary-100/50"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-20 border-dashed border-2">
          <Calendar size={48} className="mx-auto text-secondary-200 mb-4" />
          <h3 className="text-xl font-bold text-secondary-900">No Appointments</h3>
          <p className="text-secondary-500 mt-2">You don't have any consultation requests at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="card p-0 overflow-hidden hover:border-primary-100 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className={`w-full md:w-2 h-2 md:h-auto self-stretch ${
                  a.status === 'APPROVED' ? 'bg-emerald-500' : 
                  a.status === 'PENDING' ? 'bg-amber-500' : 
                  a.status === 'REJECTED' ? 'bg-red-500' : 'bg-secondary-300'
                }`} />
                
                <div className="p-6 flex-1 grid md:grid-cols-[1fr_200px_200px] gap-6 items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-50 p-3 rounded-xl text-primary-600 group-hover:scale-110 transition-transform">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500 font-medium">Patient</p>
                      <p className="text-lg font-bold text-secondary-900">{a.patient || 'Unknown Patient'}</p>
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

                  <div className="flex flex-col md:items-end gap-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(a.status)}`}>
                      {a.status}
                    </div>
                    
                    {a.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateStatus(a.id, 'approve')}
                          className="btn bg-emerald-600 text-white hover:bg-emerald-700 text-xs py-1.5 px-3 h-8"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(a.id, 'reject')}
                          className="btn bg-white text-red-600 border border-red-200 hover:bg-red-50 text-xs py-1.5 px-3 h-8"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

export default DoctorAppointments
