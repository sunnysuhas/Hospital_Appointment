import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Calendar as CalendarIcon, CheckCircle2, ClipboardList, Clock, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../../api/axios'
import { MotionCard, SkeletonBlock, StatCard } from '../../components/ui'
import { getApiErrorMessage } from '../../utils/apiError'

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('doctor/dashboard-stats')
        setStats(res.data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch doctor stats.'))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statusData = stats?.status_summary?.map(item => ({
    status: item.status,
    count: item.count,
  })) || []

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Clinical Overview</h1>
          <p className="text-secondary-500">Welcome back, Doctor. Here is your practice summary for today.</p>
        </div>
        <Link to="/doctor/slots" className="btn btn-primary">
          <CalendarIcon size={18} className="mr-2" /> Manage Availability
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonBlock key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={ClipboardList} label="Total Appointments" value={stats?.total_appointments || 0} accent="primary" />
          <StatCard icon={Clock} label="Pending Appointments" value={stats?.pending_appointments || 0} accent="amber" delay={0.05} />
          <StatCard icon={CheckCircle2} label="Approved Visits" value={stats?.approved_appointments || 0} accent="emerald" delay={0.1} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8">
        <MotionCard className="min-h-[360px]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-secondary-900">Appointments Overview</h3>
              <p className="text-sm text-secondary-500">Status distribution across your consultations.</p>
            </div>
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
              {stats?.available_slots || 0} slots
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>

        <div className="space-y-6">
          <MotionCard className="bg-secondary-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Activity size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Manage Availability</h3>
              <p className="text-secondary-300 mb-8">Create and edit time slots so patients can book with confidence.</p>
              <Link to="/doctor/slots" className="inline-flex items-center text-primary-300 font-bold hover:text-primary-200">
                Go to Slots <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </MotionCard>

          <MotionCard>
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary-900 mb-2">Patient Requests</h3>
                <p className="text-secondary-500 mb-5 text-sm">Review, approve, or decline incoming appointment requests.</p>
                <Link to="/doctor/appointments" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700">
                  Review Appointments <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </MotionCard>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
