import React, { useEffect, useState } from 'react'
import { Calendar, Clock, Stethoscope, CheckCircle2, XCircle, AlertCircle, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAppointments = async () => {
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
    fetchAppointments()
  }, [])

  const handleCancel = async (id) => {
    const toastId = toast.loading('Cancelling appointment...')
    try {
      await api.post(`appointments/${id}/cancel/`)
      toast.success('Appointment cancelled.', { id: toastId })
      fetchAppointments()
    } catch (err) {
      toast.error('Failed to cancel appointment.', { id: toastId })
    }
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'REJECTED': return 'bg-red-50 text-red-700 border-red-100'
      case 'CANCELLED': return 'bg-secondary-50 text-secondary-500 border-secondary-100'
      default: return 'bg-secondary-50 text-secondary-700 border-secondary-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 size={14} className="mr-1" />
      case 'PENDING': return <Clock size={14} className="mr-1" />
      case 'REJECTED': return <XCircle size={14} className="mr-1" />
      case 'CANCELLED': return <AlertCircle size={14} className="mr-1" />
      default: return null
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Your Appointments</h1>
          <p className="text-secondary-500 mt-1">Track and manage your medical consultations.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="card h-24 animate-pulse bg-secondary-100/50"></div>
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="card text-center py-20 bg-white border-dashed border-2">
          <Calendar size={48} className="mx-auto text-secondary-200 mb-4" />
          <h3 className="text-xl font-bold text-secondary-900">No Appointments Found</h3>
          <p className="text-secondary-500 mt-2">You haven't booked any consultations yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="card p-0 overflow-hidden hover:border-primary-100 transition-colors group">
              <div className="flex flex-col md:flex-row md:items-center">
                {/* Status Color Strip */}
                <div className={`w-full md:w-2 h-2 md:h-auto self-stretch ${
                  a.status === 'APPROVED' ? 'bg-emerald-500' : 
                  a.status === 'COMPLETED' ? 'bg-emerald-500' :
                  a.status === 'PENDING' ? 'bg-amber-500' : 
                  a.status === 'REJECTED' ? 'bg-red-500' : 'bg-secondary-300'
                }`} />
                
                <div className="p-6 flex-1 grid md:grid-cols-[1fr_200px_150px] gap-6 items-center">
                  <div className="flex items-center space-x-4">
                    <div className="bg-secondary-50 p-3 rounded-lg text-secondary-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-500 font-medium">Doctor</p>
                      <p className="text-lg font-bold text-secondary-900">{a.doctor?.name || 'Unknown'}</p>
                      <p className="text-xs text-secondary-400 capitalize">{a.doctor?.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center text-sm font-semibold text-secondary-700">
                      <Calendar size={14} className="mr-2 text-primary-500" /> {a.slot?.date}
                    </div>
                    <div className="flex items-center text-xs text-secondary-500">
                      <Clock size={14} className="mr-2 text-primary-500" /> {a.slot?.start_time.substring(0, 5)} - {a.slot?.end_time.substring(0, 5)}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end space-y-3">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(a.status)}`}>
                      {getStatusIcon(a.status)} {a.status}
                    </div>
                    
                    {a.status === 'PENDING' && (
                      <button 
                        onClick={() => handleCancel(a.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center transition-colors"
                      >
                        <Trash2 size={12} className="mr-1" /> Cancel Booking
                      </button>
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

export default AppointmentHistory
