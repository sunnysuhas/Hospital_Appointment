import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Users, ClipboardList, Settings, Database, Server } from 'lucide-react'

const AdminHome = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Control Panel */}
      <section className="relative bg-secondary-900 rounded-3xl p-10 lg:p-16 text-white overflow-hidden shadow-2xl border-b-4 border-primary-600">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-primary-600/20 px-3 py-1 rounded-full text-primary-400 text-sm font-bold mb-6 border border-primary-500/30">
            <Server size={14} />
            <span>Root Administrator Access</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Hospital System <br/> <span className="text-primary-500 underline decoration-white/10 italic">Core Control</span>
          </h1>
          <p className="text-secondary-400 text-lg mb-8">
            Global oversight of hospital operations, staff onboarding, and system-wide appointment auditing. Maintain clinical data integrity from this hub.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/dashboard" className="btn btn-primary px-8 h-12 shadow-lg shadow-primary-600/30">
              System Dashboard
            </Link>
            <Link to="/admin/doctors" className="btn bg-white/10 hover:bg-white/20 border border-white/10 px-8 h-12">
              Staff Directory
            </Link>
          </div>
        </div>
        
        {/* Admin Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10 translate-x-1/2"></div>
        <div className="absolute bottom-0 right-10 opacity-5">
          <Database size={240} />
        </div>
      </section>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card group hover:shadow-premium transition-all duration-300 bg-white">
          <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">Staff Control</h3>
          <p className="text-secondary-500 text-sm mb-6">Onboard new specialists and manage existing medical profiles in the system.</p>
          <Link to="/admin/doctors" className="btn btn-primary w-full h-10 text-xs font-bold">Manage Doctors</Link>
        </div>

        <div className="card group hover:shadow-premium transition-all duration-300 bg-white">
          <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
            <ClipboardList size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">Audit Ledger</h3>
          <p className="text-secondary-500 text-sm mb-6">Access the global log of all bookings. Auditing for historical and future consultations.</p>
          <Link to="/admin/appointments" className="btn bg-emerald-600 text-white hover:bg-emerald-700 w-full h-10 text-xs font-bold">Full Audit</Link>
        </div>

        <div className="card group hover:shadow-premium transition-all duration-300 bg-white">
          <div className="bg-secondary-50 w-14 h-14 rounded-2xl flex items-center justify-center text-secondary-600 mb-6 group-hover:scale-110 transition-transform">
            <Settings size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">System Config</h3>
          <p className="text-secondary-500 text-sm mb-6">Manage hospital departments, site-wide notifications, and global security settings.</p>
          <div className="p-2 border border-secondary-100 rounded-lg text-center text-[10px] text-secondary-400 font-bold uppercase tracking-widest">Read Only Mode</div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-5 bg-secondary-50 rounded-2xl border border-secondary-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span className="text-sm font-bold text-secondary-700 tracking-tight">SYSTEM STATUS: OPTIMAL</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-secondary-400">
          <span>SERVER: AWS-SOUTH-1</span>
          <span>LATENCY: 12ms</span>
          <span className="text-primary-600">VERSION: 2.4.0-STABLE</span>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
