import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Stethoscope, Mail, Phone, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const DoctorDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState(null)

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
        setError(err.response?.data?.detail || 'Failed to load details')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const bookAppointment = async (slotId) => {
    setBookingId(slotId)
    const toastId = toast.loading('Processing your booking...')
    try {
      await api.post('appointments/', { slot_id: slotId })
      toast.success('Appointment booked successfully!', { id: toastId })
      
      // Refresh slots
      const slotRes = await api.get(`doctors/${id}/slots/`)
      setSlots(slotRes.data || [])
    } catch (err) {
      const errorMsg = err.response?.data?.slot_id?.[0] || err.response?.data?.detail || 'Failed to book appointment'
      toast.error(errorMsg, { id: toastId })
    } finally {
      setBookingId(null)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )

  if (error || !doctor) return (
    <div className="card text-center py-12">
      <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
      <h2 className="text-xl font-bold text-secondary-900">{error || 'Doctor not found'}</h2>
      <button onClick={() => navigate('/patient/doctors')} className="mt-4 text-primary-600 font-bold flex items-center justify-center mx-auto">
        <ArrowLeft size={16} className="mr-2" /> Back to list
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <button 
        onClick={() => navigate('/patient/doctors')} 
        className="flex items-center text-secondary-500 hover:text-primary-600 transition-colors font-medium"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Specialists
      </button>

      {/* Profile Header */}
      <div className="card grid md:grid-cols-[200px_1fr] gap-8 items-center bg-gradient-to-br from-white to-primary-50/30">
        <div className="w-40 h-40 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 mx-auto md:mx-0 shadow-inner">
          <Stethoscope size={64} />
        </div>
        <div className="text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">{doctor.name}</h1>
            <p className="text-primary-600 font-semibold text-lg">{doctor.specialization}</p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="flex items-center text-sm text-secondary-600 bg-white px-3 py-1.5 rounded-full border border-secondary-100 shadow-sm">
              <Mail size={14} className="mr-2 text-primary-500" /> {doctor.email}
            </div>
            {doctor.phone && (
              <div className="flex items-center text-sm text-secondary-600 bg-white px-3 py-1.5 rounded-full border border-secondary-100 shadow-sm">
                <Phone size={14} className="mr-2 text-primary-500" /> {doctor.phone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slots Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-secondary-900 flex items-center">
            <Calendar className="mr-3 text-primary-600" size={24} /> Available Slots
          </h3>
          <span className="text-sm text-secondary-500 bg-secondary-100 px-3 py-1 rounded-full font-medium">
            {slots.length} Slots Found
          </span>
        </div>

        {slots.length === 0 ? (
          <div className="card text-center py-16 border-dashed bg-secondary-50/50">
            <Clock size={40} className="mx-auto text-secondary-300 mb-4" />
            <p className="text-secondary-500 font-medium italic">No available slots for this doctor right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {slots.map((s) => (
              <div key={s.id} className="group card hover:border-primary-200 transition-all duration-300 p-5 bg-white flex flex-col justify-between">
                <div className="mb-4">
                  <div className="text-sm font-bold text-secondary-900 mb-1">{s.date}</div>
                  <div className="text-xs text-secondary-500 flex items-center uppercase tracking-wider">
                    <Clock size={12} className="mr-1" /> {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                  </div>
                </div>

                <button 
                  disabled={bookingId === s.id}
                  onClick={() => bookAppointment(s.id)}
                  className="btn btn-primary w-full text-sm group-hover:shadow-md transition-shadow"
                >
                  {bookingId === s.id ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            ))}
          </div>
        )
      }
      </div>

      {/* Safety Note */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3 text-amber-800 text-sm">
        <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
        <p>By booking an appointment, you agree to our <strong>Hospital Guidelines</strong>. Please arrive 15 minutes prior to your scheduled time.</p>
      </div>
    </div>
  )
}

export default DoctorDetail
