import React, { useEffect, useState } from 'react'
import { Calendar, Clock, Plus, Trash2, Info, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const ManageSlots = () => {
  const [slots, setSlots] = useState([])
  const [form, setForm] = useState({ date: '', start_time: '', end_time: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSlots = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('slots/')
      setSlots(res.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load slots')
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
    const toastId = toast.loading('Creating slot...')
    try {
      await api.post('slots/', form)
      setForm({ date: '', start_time: '', end_time: '' })
      toast.success('Slot added successfully', { id: toastId })
      await loadSlots()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join('. ') || 'Failed to add slot'
      toast.error(errorMsg, { id: toastId })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot? This may affect existing appointments.')) return
    const toastId = toast.loading('Deleting slot...')
    try {
      await api.delete(`slots/${id}/`)
      toast.success('Slot removed', { id: toastId })
      await loadSlots()
    } catch (err) {
      toast.error('Failed to delete slot.', { id: toastId })
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Availability Manager</h1>
          <p className="text-secondary-500">Define your working hours and let patients book consultations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-10">
        {/* Add Form */}
        <div className="space-y-6">
          <div className="card shadow-premium border-primary-100 bg-gradient-to-br from-white to-primary-50/20">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <Plus size={20} className="mr-2 text-primary-600" /> Define New Availability
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-secondary-700">Consultation Date</label>
                <input
                  className="input h-11"
                  name="date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-secondary-700">Start Time</label>
                  <input
                    className="input h-11"
                    name="start_time"
                    type="time"
                    value={form.start_time}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-secondary-700">End Time</label>
                  <input
                    className="input h-11"
                    name="end_time"
                    type="time"
                    value={form.end_time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full h-11 mt-4 shadow-md hover:shadow-lg transition-all">
                Publish to Schedule
              </button>
            </form>
          </div>

          <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start space-x-3 text-blue-900 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-full -translate-y-1/2 translate-x-1/2 -z-10 group-hover:scale-110 transition-transform"></div>
            <Info size={20} className="shrink-0 mt-0.5 text-blue-500" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-1">Professional Protocol:</p>
              <ul className="list-disc list-inside space-y-1 opacity-80">
                <li>Approved slots are locked for patient safety.</li>
                <li>Deleting a slot will notify pending patients.</li>
                <li>Ensure time ranges do not overlap.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Slots List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-secondary-900">Your Active Slots</h3>
            <span className="text-xs font-bold text-secondary-500 bg-secondary-100 px-3 py-1 rounded-full">
              {slots.length} Total
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="card h-32 animate-pulse bg-secondary-100/50"></div>
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="card text-center py-20 border-dashed border-2">
              <Calendar size={48} className="mx-auto text-secondary-200 mb-4" />
              <p className="text-secondary-500 font-medium">No slots created for your schedule yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {slots.map((s) => (
                <div key={s.id} className="group card hover:border-red-100 transition-all duration-300 relative overflow-hidden">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                      <Clock size={18} />
                    </div>
                    <button 
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="text-lg font-bold text-secondary-900 mb-1">{s.date}</div>
                  <div className="text-sm text-secondary-500 font-medium">
                    {s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${s.is_booked ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {s.is_booked ? 'Booked' : 'Available'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageSlots
