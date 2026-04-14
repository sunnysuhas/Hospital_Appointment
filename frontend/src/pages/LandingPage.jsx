import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, ShieldCheck, Stethoscope, ArrowRight } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-secondary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg text-white">
                <Calendar size={24} />
              </div>
              <span className="text-xl font-bold text-secondary-900">MedBook</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-100 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary-600"></span>
            <span>Healthcare Simplified</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-secondary-900 tracking-tight mb-8 animate-fade-in">
            Seamless Healthcare <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Appointments
            </span>
          </h1>
          
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Book appointments with top specialists, manage your health history, and connect with doctors—all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Patient Card */}
            <div className="group card hover:border-primary-200 transition-all duration-300">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">For Patients</h3>
              <p className="text-secondary-600 mb-6 text-sm">Find the right doctor and book your consultation in seconds.</p>
              <div className="space-y-3">
                <Link to="/patient/register" className="btn btn-primary w-full">
                  Create Account
                </Link>
                <Link to="/patient/login" className="btn btn-secondary w-full">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Doctor Card */}
            <div className="group card hover:border-primary-200 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">For Doctors</h3>
              <p className="text-secondary-600 mb-6 text-sm">Manage your schedule, patients, and clinical appointments efficiently.</p>
              <Link to="/doctor/login" className="btn btn-secondary w-full border-emerald-100 hover:bg-emerald-50 text-emerald-700">
                Doctor Portal
              </Link>
            </div>

            {/* Admin Card */}
            <div className="group card hover:border-primary-200 transition-all duration-300">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Administration</h3>
              <p className="text-secondary-600 mb-6 text-sm">Monitor hospital operations, manage staff, and analyze data.</p>
              <Link to="/admin/login" className="btn btn-secondary w-full border-violet-100 hover:bg-violet-50 text-violet-700">
                Admin Settings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Specialists', value: '150+' },
              { label: 'Active Patients', value: '10k+' },
              { label: 'Appointments', value: '50k+' },
              { label: 'Rating', value: '4.9/5' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-secondary-400 text-sm tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
