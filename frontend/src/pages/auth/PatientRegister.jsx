import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { UserPlus, AlertCircle, Phone, Fingerprint, Mail, Users, HeartPulse, Activity, Lock } from 'lucide-react'

const PatientRegister = () => {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    medical_history: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('patient/register', {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        age: Number(form.age),
        gender: form.gender,
        phone: form.phone,
        medical_history: form.medical_history || '',
      })
      navigate('/patient/login')
    } catch (err) {
      let errorMessage = 'Registration failed'
      if (err.response?.data) {
        const data = err.response.data
        if (typeof data === 'object') {
          const errors = []
          if (data.detail) errors.push(data.detail)
          else if (data.non_field_errors) errors.push(...data.non_field_errors)
          else {
            Object.keys(data).forEach((key) => {
              if (Array.isArray(data[key])) errors.push(...data[key])
              else errors.push(data[key])
            })
          }
          if (errors.length > 0) errorMessage = errors.join('. ')
        } else if (typeof data === 'string') {
          errorMessage = data
        }
      } else if (err.message) {
        errorMessage = err.message
      } else if (!err.response) {
        errorMessage = 'Network error. Please check if the backend server is running.'
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 animate-fade-in my-8">
      <div className="w-full max-w-lg card p-8 sm:p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-16 bg-primary-100/30 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 p-16 bg-secondary-100/50 rounded-tr-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4 shadow-sm border-4 border-white">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 tracking-tight">Create Account</h2>
          <p className="text-secondary-500 mt-2 text-sm">Join MedBook to schedule premium care.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary-700 block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Fingerprint className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                className="input pl-10"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700 block">Age</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  className="input pl-10"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="30"
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-secondary-700 block">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-secondary-400" />
                </div>
                <select
                  className="input pl-10 appearance-none bg-white"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary-700 block">Phone Details</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                className="input pl-10"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary-700 block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                className="input pl-10"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="patient@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary-700 block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                className="input pl-10"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>
            <p className="text-xs text-secondary-500 mt-1">Must be at least 8 characters long.</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-secondary-700 block">Medical History (Optional)</label>
            <div className="relative">
              <div className="absolute top-2 left-0 pl-3 flex items-start pointer-events-none">
                <HeartPulse className="h-5 w-5 text-secondary-400 mt-1" />
              </div>
              <textarea
                className="input pl-10 pt-2 min-h-[100px] resize-y"
                name="medical_history"
                value={form.medical_history}
                onChange={handleChange}
                placeholder="Briefly describe any pre-existing conditions..."
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm animate-pulse-gentle">
              <AlertCircle size={18} className="mr-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full h-11 text-base mt-2" 
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Complete Registration
                <UserPlus size={18} className="ml-2" />
              </span>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-secondary-500 text-sm">
          Already have an account? <Link to="/patient/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default PatientRegister
