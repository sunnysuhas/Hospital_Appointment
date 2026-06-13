import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle, Clock, History, Stethoscope } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import api from '../../api/axios'
import { EmptyState, MotionCard, SkeletonBlock, StatCard } from '../../components/ui'
import { getApiErrorMessage } from '../../utils/apiError'

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
  CANCELLED: '#64748b',
  COMPLETED: '#0ea5e9',
}

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('appointments/')
        setAppointments(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch dashboard stats.'))
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const stats = useMemo(() => ({
    pending: appointments.filter(a => a?.status === 'PENDING').length,
    approved: appointments.filter(a => a?.status === 'APPROVED').length,
    total: appointments.length,
  }), [appointments])

  const statusData = useMemo(() => (
    Object.entries(appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1
      return acc
    }, {})).map(([name, value]) => ({ name, value }))
  ), [appointments])

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-cyan-600 to-emerald-600 p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-primary-50 max-w-md">
            Manage your health journey, search for specialists, and track appointment status from one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/patient/doctors" className="btn bg-white text-primary-700 hover:bg-primary-50">
              Find a Doctor
            </Link>
            <Link to="/patient/profile" className="btn bg-white/15 text-white border border-white/20 hover:bg-white/25">
              View Profile
            </Link>
          </div>
        </div>
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
          <StatCard icon={Calendar} label="Total Bookings" value={stats.total} accent="primary" delay={0.02} />
          <StatCard icon={Clock} label="Pending" value={stats.pending} accent="amber" delay={0.06} />
          <StatCard icon={CheckCircle} label="Approved" value={stats.approved} accent="emerald" delay={0.1} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MotionCard className="flex items-start space-x-6">
            <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
              <Stethoscope size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Book New Appointment</h3>
              <p className="text-secondary-600 text-sm mb-4">Browse verified specialists and choose a slot that works for you.</p>
              <Link to="/patient/doctors" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                Browse Doctors <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </MotionCard>

          <MotionCard className="flex items-start space-x-6" delay={0.05}>
            <div className="bg-violet-50 p-4 rounded-xl text-violet-600">
              <History size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Appointment History</h3>
              <p className="text-secondary-600 text-sm mb-4">View past visits, status updates, and upcoming bookings.</p>
              <Link to="/patient/appointments" className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700">
                View History <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </MotionCard>
        </div>

        <MotionCard>
          <div className="mb-5">
            <h3 className="text-lg font-bold text-secondary-900">Status Distribution</h3>
            <p className="text-sm text-secondary-500">Your appointment mix by current status.</p>
          </div>
          {statusData.length === 0 ? (
            <EmptyState icon={Calendar} title="No appointment data" message="Book a consultation to see trends here." />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </MotionCard>
      </div>
    </div>
  )
}

export default PatientDashboard
