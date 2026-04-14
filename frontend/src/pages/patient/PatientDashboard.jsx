import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Clock, CheckCircle, ArrowRight, Stethoscope, History } from 'lucide-react'
import api from '../../api/axios'

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('appointments/')
        const appointments = Array.isArray(res.data) ? res.data : []
        setStats({
          pending: appointments.filter(a => a?.status === 'PENDING').length,
          approved: appointments.filter(a => a?.status === 'APPROVED').length,
          total: appointments.length
        })
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-primary-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-primary-100 max-w-md">
            Manage your health journey with ease. Search for specialists or check your upcoming appointments below.
          </p>
          <div className="mt-6 flex space-x-4">
            <Link to="/patient/doctors" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Find a Doctor
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-primary-500 flex items-center space-x-4">
          <div className="bg-primary-50 p-3 rounded-lg text-primary-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Total Bookings</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.total || '0'}</p>
          </div>
        </div>

        <div className="card border-l-4 border-l-amber-500 flex items-center space-x-4">
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Pending</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.pending || '0'}</p>
          </div>
        </div>

        <div className="card border-l-4 border-l-emerald-500 flex items-center space-x-4">
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-500">Approved</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.approved || '0'}</p>
          </div>
        </div>
      </div>

      {stats.total === 0 && (
        <div className="card text-center py-10 border-dashed bg-secondary-50/20">
          <p className="text-secondary-400 italic">No appointment data found in your profile yet.</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card group hover:shadow-premium-hover transition-all duration-300 flex items-start space-x-6">
          <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
            <Stethoscope size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Book New Appointment</h3>
            <p className="text-secondary-600 text-sm mb-4">Browse our list of verified specialists and choose a slot that works for you.</p>
            <Link to="/patient/doctors" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
              Browse Doctors <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="card group hover:shadow-premium-hover transition-all duration-300 flex items-start space-x-6">
          <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
            <History size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Appointment History</h3>
            <p className="text-secondary-600 text-sm mb-4">View your past visits, check status updates, and manage upcoming bookings.</p>
            <Link to="/patient/appointments" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
              View History <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
