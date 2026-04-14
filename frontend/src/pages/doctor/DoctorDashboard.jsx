import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Clock, CheckCircle2, ArrowRight, Activity } from 'lucide-react'
import { LayoutDashboard, Calendar as CalendarIcon, ClipboardList } from 'lucide-react'
import api from '../../api/axios'

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    slots: 0,
    pending: 0,
    approved: 0
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slotRes, appRes] = await Promise.all([
          api.get('slots/'),
          api.get('appointments/')
        ])
        const appointments = appRes.data
        setStats({
          slots: slotRes.data.length,
          pending: appointments.filter(a => a.status === 'PENDING').length,
          approved: appointments.filter(a => a.status === 'APPROVED').length,
        })
      } catch (err) {
        console.error("Failed to fetch doctor stats")
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Clinical Overview</h1>
          <p className="text-secondary-500">Welcome back, Doctor. Here is your practice summary for today.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/doctor/slots" className="btn btn-primary">
            < CalendarIcon size={18} className="mr-2" /> Manage Availability
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-t-4 border-t-primary-500 hover:shadow-premium-hover transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary-50 p-3 rounded-xl text-primary-600">
              <ClipboardList size={24} />
            </div>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Total Time Slots</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.slots}</p>
        </div>

        <div className="card border-t-4 border-t-amber-500 hover:shadow-premium-hover transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Review Needed</span>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Pending Appointments</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.pending}</p>
        </div>

        <div className="card border-t-4 border-t-emerald-500 hover:shadow-premium-hover transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Confirmed</span>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Approved Visits</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.approved}</p>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card group bg-secondary-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Activity size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Manage Availability</h3>
            <p className="text-secondary-400 mb-8 max-w-sm">Create and edit your time slots so patients can find and book appointments with you.</p>
            <Link to="/doctor/slots" className="inline-flex items-center text-primary-400 font-bold hover:text-primary-300 transition-colors">
              Go to Slots <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="card group border shadow-none hover:border-primary-200 hover:shadow-premium transition-all">
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">Patient Requests</h3>
          <p className="text-secondary-500 mb-8 max-w-sm">Review, approve, or decline incoming appointment requests from your dashboard.</p>
          <Link to="/doctor/appointments" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
            Review Appointments <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
