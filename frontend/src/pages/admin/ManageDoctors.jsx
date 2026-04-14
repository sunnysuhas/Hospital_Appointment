import React, { useEffect, useState } from 'react'
import { UserPlus, Stethoscope, Mail, Phone, Trash2, ShieldCheck, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDoctors = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('admin/doctors/')
      setDoctors(res.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load doctors')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const toastId = toast.loading('Registering new doctor...')
    try {
      await api.post('admin/doctors/', form)
      setForm({ name: '', email: '', password: '', specialization: '', phone: '' })
      toast.success('Doctor registered successfully', { id: toastId })
      await loadDoctors()
    } catch (err) {
      const errorMsg = err.response?.data?.detail || Object.values(err.response?.data || {}).flat().join('. ') || 'Failed to create doctor'
      toast.error(errorMsg, { id: toastId })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL: Are you sure you want to delete this doctor? This will remove all their data and associated slots.')) return
    const toastId = toast.loading('Deleting doctor profile...')
    try {
      await api.delete(`admin/doctors/${id}/`)
      toast.success('Doctor profile removed.', { id: toastId })
      await loadDoctors()
    } catch (err) {
      toast.error('Failed to delete doctor.', { id: toastId })
    }
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Doctor Management</h1>
          <p className="text-secondary-500">Add and manage medical professionals in the system.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-10 items-start">
        {/* Registration Form */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="card shadow-premium border-primary-100 bg-white">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center">
              <UserPlus size={20} className="mr-2 text-primary-600" /> Account Provisioning
            </h3>
            <div className="mb-6 p-3 bg-primary-50 rounded-lg text-primary-700 text-xs">
              <p className="font-bold mb-1">🔐 Access Registration:</p>
              The credentials you enter here will allow the doctor to access their secure clinical dashboard immediately.
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-secondary-700">Display Name</label>
                <input
                  className="input h-11"
                  name="name"
                  placeholder="Dr. John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-secondary-700">Account Email (Login ID)</label>
                <input
                  className="input h-11"
                  name="email"
                  type="email"
                  placeholder="doctor@medbook.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-secondary-700">Secure Password</label>
                <input
                  className="input h-11"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Assign a secure password"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-secondary-700">Specialization</label>
                  <input
                    className="input h-11"
                    name="specialization"
                    placeholder="e.g. Cardiology"
                    value={form.specialization}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-secondary-700">Work Phone</label>
                  <input
                    className="input h-11"
                    name="phone"
                    placeholder="+1 234 567"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-full h-11 mt-4 shadow-md transition-all">
                Create Doctor Account
              </button>
            </form>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start space-x-3 text-emerald-800 text-xs">
            <ShieldCheck size={18} className="shrink-0 mt-0.5" />
            <p>System authorized. New accounts will automatically receive 'DOCTOR' level permissions across all clinical modules.</p>
          </div>
        </div>

        {/* Doctor Directory */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-secondary-900">Doctor Directory</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-secondary-500 bg-secondary-100 px-3 py-1 rounded-full">{doctors.length} Records</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="card h-40 animate-pulse bg-secondary-100/50"></div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="card text-center py-20 border-dashed border-2">
              <Stethoscope size={48} className="mx-auto text-secondary-200 mb-4" />
              <p className="text-secondary-500 font-medium">No medical professionals registered in the system yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((d) => (
                <div key={d.id} className="group card hover:border-primary-100 transition-all duration-300 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors">
                        {d.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary-900">{d.name}</h4>
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{d.specialization}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 text-secondary-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mt-4 pt-4 border-t border-secondary-50">
                    <div className="flex items-center text-xs text-secondary-500">
                      <Mail size={12} className="mr-2 text-secondary-400" /> {d.email}
                    </div>
                    {d.phone && (
                      <div className="flex items-center text-xs text-secondary-500">
                        <Phone size={12} className="mr-2 text-secondary-400" /> {d.phone}
                      </div>
                    )}
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

export default ManageDoctors
