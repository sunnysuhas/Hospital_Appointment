import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Stethoscope, Calendar, Activity, ShieldCheck, ArrowRight, Settings, X } from 'lucide-react'
import api from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0
  })
  const [showLogs, setShowLogs] = useState(false)

    const systemLogs = [
      { time: '08:42', event: 'Database Health Check: All systems operational', status: 'success' },
      { time: '08:41', event: 'Security Security Patch: Firewall rules updated', status: 'info' },
      { time: '08:35', event: 'Maintenance: Patient record indexing completed', status: 'success' },
      { time: '08:20', event: 'Update: New specialist profile synchronized', status: 'info' },
      { time: '08:15', event: 'Backup: Nightly cloud sync successful', status: 'success' },
      { time: '07:55', event: 'Performance: Global API response time < 15ms', status: 'success' },
    ]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docRes, appRes] = await Promise.all([
          api.get('admin/doctors/'),
          api.get('appointments/')
        ])
        const docs = Array.isArray(docRes.data) ? docRes.data : []
        const apps = Array.isArray(appRes.data) ? appRes.data : []
        setStats({
          doctors: docs.length,
          appointments: apps.length,
          patients: new Set(apps.map(a => a?.patient)).size
        })
      } catch (err) {
        console.error("Failed to fetch admin stats")
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header logic ... */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">System Administration</h1>
          <p className="text-secondary-500">Global overview and management of hospital operations.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowLogs(true)} className="btn btn-secondary shadow-sm">
            <Settings size={18} className="mr-2 text-secondary-500" /> System Logs
          </button>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-secondary-900/60 backdrop-blur-sm" onClick={() => setShowLogs(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-secondary-100 animate-scale-up flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-secondary-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900 flex items-center">
                  <Activity size={24} className="mr-3 text-primary-600" /> Hospital Core Ledger
                </h3>
                <p className="text-sm text-secondary-500 mt-1">Real-time infrastructure and security audit events.</p>
              </div>
              <button 
                onClick={() => setShowLogs(false)}
                className="p-3 hover:bg-secondary-100 rounded-2xl transition-colors text-secondary-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-8 bg-secondary-950 text-emerald-400 font-mono text-sm space-y-4 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-2 text-secondary-500 mb-6 border-b border-white/5 pb-4">
                <ShieldCheck size={16} />
                <span className="tracking-widest uppercase">Encryption Status: AES-256 ACTIVE</span>
              </div>
              {systemLogs.map((log, i) => (
                <div key={i} className="flex gap-6 group hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <span className="text-secondary-600 shrink-0 font-bold tracking-tighter">[{log.time}]</span>
                  <span className={`flex-1 ${log.status === 'success' ? 'text-emerald-400' : 'text-primary-400'}`}>
                    <span className="text-secondary-700 mr-2">LOG_EVENT:</span>
                    {log.event}
                  </span>
                  <span className="text-[10px] text-secondary-800 uppercase self-center opacity-0 group-hover:opacity-100 transition-opacity">verified</span>
                </div>
              ))}
              <div className="pt-8 text-primary-500 flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-ping" />
                <span className="animate-pulse">SYSTEM_LISTENING_DAEMON: OK</span>
              </div>
            </div>
            <div className="p-8 bg-secondary-50 border-t border-secondary-100 flex justify-between items-center">
              <span className="text-xs text-secondary-400">Total Audit Buffer: 1.2MB</span>
              <button onClick={() => setShowLogs(false)} className="btn btn-primary px-10 h-12 rounded-xl text-md font-bold">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <Stethoscope size={24} />
            </div>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Total Doctors</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.doctors}</p>
        </div>

        <div className="card border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Total Appointments</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.appointments}</p>
        </div>

        <div className="card border-l-4 border-l-emerald-500 bg-gradient-to-br from-white to-emerald-50/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Users size={24} />
            </div>
          </div>
          <p className="text-secondary-500 text-sm font-medium mb-1">Active Patients</p>
          <p className="text-3xl font-extrabold text-secondary-900">{stats.patients}</p>
        </div>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card group hover:shadow-premium-hover transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-50 p-4 rounded-2xl text-primary-600 border border-primary-100">
              <ShieldCheck size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Doctor Management</h3>
              <p className="text-secondary-500 mb-6 leading-relaxed">Add new specialists, manage credentials, and monitor doctor activity across the hospital.</p>
              <Link to="/admin/doctors" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
                Manage Doctors <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="card group hover:shadow-premium-hover transition-all duration-300">
          <div className="flex items-start space-x-4">
            <div className="bg-secondary-900 p-4 rounded-2xl text-white">
              <Activity size={32} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-secondary-900 mb-2">Appointment Audit</h3>
              <p className="text-secondary-500 mb-6 leading-relaxed">Track all consultations in real-time. Review pending requests and historical data for reporting.</p>
              <Link to="/admin/appointments" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
                View All Appointments <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
