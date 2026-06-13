import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, ShieldCheck, Stethoscope, User } from 'lucide-react'
import { CountUp } from '../components/ui'

const LandingPage = () => {
  const portals = [
    {
      title: 'For Patients',
      body: 'Find trusted specialists, book available slots, and manage your care timeline.',
      icon: User,
      color: 'primary',
      actions: [
        { label: 'Create Account', to: '/patient/register', primary: true },
        { label: 'Sign In', to: '/patient/login' },
      ],
    },
    {
      title: 'For Doctors',
      body: 'Manage availability, review bookings, and monitor your daily appointment flow.',
      icon: Stethoscope,
      color: 'emerald',
      actions: [{ label: 'Doctor Portal', to: '/doctor/login' }],
    },
    {
      title: 'Administration',
      body: 'Oversee doctors, patients, appointment volume, and operational status analytics.',
      icon: ShieldCheck,
      color: 'violet',
      actions: [{ label: 'Admin Portal', to: '/admin/login' }],
    },
  ]

  const stats = [
    { label: 'Specialists', value: 150, suffix: '+' },
    { label: 'Active Patients', value: 10, suffix: 'k+' },
    { label: 'Appointments', value: 50, suffix: 'k+' },
    { label: 'Care Rating', value: 98, suffix: '%' },
  ]

  return (
    <div className="min-h-screen bg-white text-secondary-900">
      <nav className="fixed top-0 w-full z-50 border-b border-white/20 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-lg text-white shadow-sm">
                <Calendar size={24} />
              </div>
              <span className="text-xl font-bold text-secondary-900">MedBook</span>
            </Link>
            <div className="hidden sm:flex items-center gap-3">
              <Link to="/patient/login" className="btn btn-ghost h-10">Sign In</Link>
              <Link to="/patient/register" className="btn btn-primary h-10">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-[92vh] overflow-hidden pt-28 pb-12">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1800&q=80"
          alt="Healthcare team in a modern hospital"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 rounded-full border border-primary-100 bg-white/70 px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Healthcare appointment operations, simplified</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-8 text-5xl lg:text-7xl font-extrabold leading-[1.02] text-secondary-950"
            >
              MedBook
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-6 max-w-2xl text-xl leading-8 text-secondary-600"
            >
              A production-ready hospital appointment platform for patients, doctors, and administrators with role-based workflows and real-time operational clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/patient/register" className="btn btn-primary h-12 px-7 shadow-lg shadow-primary-600/20">
                Book Care <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/doctor/login" className="btn bg-white/80 text-secondary-800 border border-white shadow-sm backdrop-blur hover:bg-white h-12 px-7">
                Doctor Access
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-xl backdrop-blur-xl"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/70 p-5 text-center">
                <div className="text-3xl font-extrabold text-secondary-950">
                  <CountUp value={stat.value} />{stat.suffix}
                </div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-secondary-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-secondary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portals.map((portal, index) => (
              <motion.div
                key={portal.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card bg-white/85 backdrop-blur border-white"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  portal.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                  portal.color === 'violet' ? 'bg-violet-100 text-violet-600' :
                  'bg-primary-100 text-primary-600'
                }`}>
                  <portal.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{portal.title}</h3>
                <p className="text-secondary-600 mb-6 text-sm leading-6">{portal.body}</p>
                <div className="space-y-3">
                  {portal.actions.map((action) => (
                    <Link
                      key={action.to}
                      to={action.to}
                      className={`btn w-full ${action.primary ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
