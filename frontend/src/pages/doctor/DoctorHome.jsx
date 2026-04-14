import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, Calendar, Users, ClipboardList, ShieldCheck, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const DoctorHome = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Welcome Banner */}
      <section className="relative bg-gradient-to-br from-secondary-900 to-primary-900 rounded-3xl p-10 lg:p-16 text-white overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-600/20 px-3 py-1 rounded-full text-emerald-400 text-sm font-bold mb-6 border border-emerald-500/30">
            <ShieldCheck size={14} />
            <span>Verified Practitioner Access</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            Advancing Clinical <br/> <span className="text-primary-400">Excellence.</span>
          </h1>
          <p className="text-secondary-400 text-lg mb-8">
            Manage your daily roster, review patient histories, and update your availability with our streamlined practitioner environment.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/doctor/slots" className="btn btn-primary px-8 h-12">
              Update Schedule
            </Link>
            <Link to="/doctor/appointments" className="btn bg-white/10 hover:bg-white/20 border border-white/10 px-8 h-12">
              Review Requests
            </Link>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 p-8 opacity-10">
          <Activity size={200} />
        </div>
      </section>

      {/* Professional Dashboard Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card group hover:border-primary-200 transition-all p-8 flex flex-col items-center text-center">
          <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center text-primary-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <ClipboardList size={36} />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">Slot Management</h3>
          <p className="text-secondary-500 mb-8 max-w-xs">
            Refine your clinical hours. Add, delete, or modify slots to sync perfectly with your real-world availability.
          </p>
          <Link to="/doctor/slots" className="btn btn-primary w-full max-w-[200px]">
            Manage Slots
          </Link>
        </div>

        <div className="card group hover:border-emerald-200 transition-all p-8 flex flex-col items-center text-center">
          <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform shadow-inner">
            <Users size={36} />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-4">Patient Queue</h3>
          <p className="text-secondary-500 mb-8 max-w-xs">
            Access detailed profiles of patients who have requested consultations. Review their history and approve requests.
          </p>
          <Link to="/doctor/appointments" className="btn bg-emerald-600 text-white hover:bg-emerald-700 w-full max-w-[200px]">
             View Requests
          </Link>
        </div>
      </div>

      {/* Guidelines Accordion / Info Box */}
      <div className="card border-l-8 border-l-amber-500 bg-amber-50/30">
        <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center">
          <Mail size={20} className="mr-2 text-amber-600" /> Practitioner Guidelines
        </h3>
        <div className="space-y-4 text-sm text-secondary-700">
          <p>• Please ensure all appointment requests are addressed within 24 hours.</p>
          <p>• Regular updates to your 'Specialization' can be requested via the Admin portal.</p>
          <p>• In case of emergencies, please use the clinical direct line for immediate system support.</p>
        </div>
        <Link to="/doctor/dashboard" className="inline-block mt-8 text-primary-600 font-bold hover:underline">
          Go to Clinical Dashboard →
        </Link>
      </div>
    </div>
  )
}

export default DoctorHome
