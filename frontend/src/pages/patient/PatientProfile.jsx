import React, { useEffect, useState } from 'react'
import { Save, UserCircle, Mail, Phone, HeartPulse, Activity, Users, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { getApiErrorMessage } from '../../utils/apiError'
import { EmptyState, SkeletonBlock } from '../../components/ui'

const PatientProfile = () => {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('patient/profile')
        setProfile(res.data)
        setForm(res.data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to load your profile.'))
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const toastId = toast.loading('Saving profile changes...')
    try {
      const payload = { ...form, age: Number(form.age) }
      const res = await api.patch('patient/profile', payload)
      setProfile(res.data)
      setForm(res.data)
      toast.success('Profile updated successfully.', { id: toastId })
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update profile.'), { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-96" />
      </div>
    )
  }

  if (error || !form) {
    return <EmptyState icon={Info} title="Profile unavailable" message={error || 'We could not find a patient profile for this account.'} />
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Patient Profile</h1>
          <p className="text-secondary-500 mt-1">Keep your personal and medical information current.</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-wider text-secondary-400">Profile ID</p>
          <p className="text-sm font-semibold text-primary-700">#{profile?.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <div className="card bg-gradient-to-br from-primary-600 to-emerald-600 text-white overflow-hidden relative">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner">
              <UserCircle size={44} />
            </div>
            <h2 className="text-2xl font-bold text-white">{profile?.full_name}</h2>
            <p className="mt-1 text-sm text-white/80">{profile?.email}</p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Activity size={16} />
                <span>{profile?.age} years old</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>{profile?.gender}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} />
                <span>{profile?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="space-y-1">
              <span className="text-sm font-semibold text-secondary-700">Full Name</span>
              <input className="input h-11" name="full_name" value={form.full_name || ''} onChange={handleChange} required />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-secondary-700">Email</span>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input className="input h-11 pl-10" name="email" type="email" value={form.email || ''} onChange={handleChange} required />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-secondary-700">Age</span>
              <input className="input h-11" name="age" type="number" min="1" value={form.age || ''} onChange={handleChange} required />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-secondary-700">Gender</span>
              <select className="input h-11 bg-white" name="gender" value={form.gender || ''} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-semibold text-secondary-700">Phone</span>
              <input className="input h-11" name="phone" value={form.phone || ''} onChange={handleChange} required />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-sm font-semibold text-secondary-700">Medical History</span>
              <div className="relative">
                <HeartPulse className="absolute left-3 top-4 text-secondary-400" size={18} />
                <textarea
                  className="input min-h-[140px] resize-y pl-10 pt-3"
                  name="medical_history"
                  value={form.medical_history || ''}
                  onChange={handleChange}
                  placeholder="Allergies, ongoing medication, prior conditions..."
                />
              </div>
            </label>
          </div>

          <div className="flex justify-end border-t border-secondary-100 pt-6">
            <button type="submit" disabled={saving} className="btn btn-primary h-11 px-6">
              <Save size={18} className="mr-2" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PatientProfile
