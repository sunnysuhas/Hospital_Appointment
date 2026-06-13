import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Calendar, Settings, ShieldCheck, Stethoscope, Users, X } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../../api/axios'
import { MotionCard, SkeletonBlock, StatCard } from '../../components/ui'
import { getApiErrorMessage } from '../../utils/apiError'

const STATUS_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#64748b', '#0ea5e9']

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLogs, setShowLogs] = useState(false)

  const systemLogs = [
    { time: '08:42', event: 'Database health check completed', status: 'success' },
    { time: '08:35', event: 'Patient record indexing completed', status: 'success' },
    { time: '08:20', event: 'Specialist directory synchronized', status: 'info' },
    { time: '08:15', event: 'Nightly cloud backup successful', status: 'success' },
  ]

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('admin/analytics')
        setAnalytics(res.data)
      } catch (err) {
        setError(getApiErrorMessage(err, 'Failed to fetch admin analytics.'))
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statusData = analytics?.appointment_status_summary?.filter(item => item.count > 0) || []
  const doctorData = analytics?.doctor_statistics || []

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">System Administration</h1>
          <p className="text-secondary-500">Global overview and management of hospital operations.</p>
        </div>
        <button onClick={() => setShowLogs(true)} className="btn btn-secondary shadow-sm">
          <Settings size={18} className="mr-2 text-secondary-500" /> System Logs
        </button>
      </div>

      {showLogs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" onClick={() => setShowLogs(false)} />
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-secondary-100 animate-scale-up flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-secondary-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900 flex items-center">
                  <Activity size={24} className="mr-3 text-primary-600" /> Hospital Core Ledger
                </h3>
                <p className="text-sm text-secondary-500 mt-1">Infrastructure and security audit events.</p>
              </div>
              <button onClick={() => setShowLogs(false)} className="p-3 hover:bg-secondary-100 rounded-xl transition-colors text-secondary-500">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 p-6 bg-secondary-950 text-emerald-400 font-mono text-sm space-y-3 overflow-y-auto">
              <div className="flex items-center gap-2 text-secondary-500 mb-4 border-b border-white/5 pb-4">
                <ShieldCheck size={16} />
                <span className="tracking-widest uppercase">Encryption Status: Active</span>
              </div>
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-4 rounded-lg p-2 hover:bg-white/5">
                  <span className="text-secondary-600 shrink-0 font-bold">[{log.time}]</span>
                  <span className={log.status === 'success' ? 'text-emerald-400' : 'text-primary-400'}>
                    {log.event}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          <StatCard icon={Users} label="Total Patients" value={analytics?.total_patients || 0} accent="emerald" />
          <StatCard icon={Stethoscope} label="Total Doctors" value={analytics?.total_doctors || 0} accent="primary" delay={0.05} />
          <StatCard icon={Calendar} label="Total Appointments" value={analytics?.total_appointments || 0} accent="violet" delay={0.1} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MotionCard className="min-h-[360px]">
          <h3 className="text-xl font-bold text-secondary-900">Appointment Status Summary</h3>
          <p className="text-sm text-secondary-500 mb-6">Live operational mix across all bookings.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="status" innerRadius={62} outerRadius={96} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>

        <MotionCard className="min-h-[360px]">
          <h3 className="text-xl font-bold text-secondary-900">Doctor Statistics</h3>
          <p className="text-sm text-secondary-500 mb-6">Top doctors by appointment volume.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="doctor" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </MotionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MotionCard>
          <div className="flex items-start space-x-4">
            <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 border border-primary-100">
              <ShieldCheck size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Doctor Management</h3>
              <p className="text-secondary-500 mb-6 leading-relaxed">Add specialists, manage credentials, and monitor doctor activity.</p>
              <Link to="/admin/doctors" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700">
                Manage Doctors <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </MotionCard>

        <MotionCard>
          <div className="flex items-start space-x-4">
            <div className="bg-secondary-900 p-4 rounded-2xl text-white">
              <Activity size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Appointment Audit</h3>
              <p className="text-secondary-500 mb-6 leading-relaxed">Track consultations in real time and review historical booking data.</p>
              <Link to="/admin/appointments" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700">
                View All Appointments <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </MotionCard>
      </div>
    </div>
  )
}

export default AdminDashboard
