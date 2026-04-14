import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Calendar, Stethoscope, History, Shield, PhoneCall } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PatientHome = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Section */}
      <section className="relative bg-secondary-900 rounded-3xl p-10 lg:p-16 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-primary-600/20 px-3 py-1 rounded-full text-primary-400 text-sm font-bold mb-6 border border-primary-500/30">
            <Shield size={14} />
            <span>Secure Patient Access</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Comprehensive Care <br/> For Your <span className="text-primary-500 underline decoration-white/20">Well-being.</span>
          </h1>
          <p className="text-secondary-400 text-lg mb-8">
            Access world-class medical specialists, manage your health records, and schedule appointments with a single click.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/patient/doctors" className="btn btn-primary px-8 h-12 shadow-lg shadow-primary-600/30">
              Find a Specialist
            </Link>
            <Link to="/patient/appointments" className="btn bg-white/10 hover:bg-white/20 border border-white/10 px-8 h-12">
              View History
            </Link>
          </div>
        </div>
        
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-64 h-64 bg-secondary-800 rounded-full blur-2xl"></div>
      </section>

      {/* Quick Navigation Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card group hover:scale-[1.02] transition-all duration-300">
          <div className="bg-primary-50 w-14 h-14 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:rotate-12 transition-transform">
            <Stethoscope size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">Clinical Portal</h3>
          <p className="text-secondary-500 text-sm mb-6">Browse our database of 50+ verified specialists across 12 departments.</p>
          <Link to="/patient/doctors" className="text-primary-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Enter Portal <History size={16} />
          </Link>
        </div>

        <div className="card group hover:scale-[1.02] transition-all duration-300">
          <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:rotate-12 transition-transform">
            <Calendar size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">Bookings</h3>
          <p className="text-secondary-500 text-sm mb-6">Quickly review your scheduled visits and manage current requests.</p>
          <Link to="/patient/appointments" className="text-emerald-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Manage Slots <History size={16} />
          </Link>
        </div>

        <div className="card group hover:scale-[1.02] transition-all duration-300">
          <div className="bg-amber-50 w-14 h-14 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:rotate-12 transition-transform">
            <PhoneCall size={28} />
          </div>
          <h3 className="text-xl font-bold text-secondary-900 mb-2">Emergency</h3>
          <p className="text-secondary-500 text-sm mb-6">Need immediate assistance? Contact our 24/7 helpdesk directly.</p>
          <a href="tel:+123456789" className="text-amber-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Call Now <History size={16} />
          </a>
        </div>
      </div>

      {/* Hospital Guideline Box */}
      <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-600">
          <Heart size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Your Privacy is Our Priority</h3>
          <p className="text-blue-700/80 leading-relaxed text-sm max-w-2xl">
            We employ industry-leading encryption to keep your medical records and consultation history secure. Only authorized doctors participating in your care can view your data.
          </p>
        </div>
        <Link to="/patient/dashboard" className="btn bg-blue-600 text-white hover:bg-blue-700 px-10 h-11 shrink-0">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default PatientHome
