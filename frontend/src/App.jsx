import React, { useState, useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  History, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Stethoscope,
  ShieldCheck,
  House,
  CheckCircle2,
  CheckCircle
} from 'lucide-react'
import api from './api/axios'
import LandingPage from './pages/LandingPage'
import PatientLogin from './pages/auth/PatientLogin'
import PatientRegister from './pages/auth/PatientRegister'
import DoctorLogin from './pages/auth/DoctorLogin'
import AdminLogin from './pages/auth/AdminLogin'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorList from './pages/patient/DoctorList'
import DoctorDetail from './pages/patient/DoctorDetail'
import AppointmentHistory from './pages/patient/AppointmentHistory'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import ManageSlots from './pages/doctor/ManageSlots'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageDoctors from './pages/admin/ManageDoctors'
import AppointmentsOverview from './pages/admin/AppointmentsOverview'
import PatientHome from './pages/patient/PatientHome'
import DoctorHome from './pages/doctor/DoctorHome'
import AdminHome from './pages/admin/AdminHome'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Layout = ({ children }) => {
  const { role, logout, user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [clearedIds, setClearedIds] = useState(new Set())
  const location = useLocation()

  useEffect(() => {
    if (!role) return

    const loadNotifications = async () => {
      try {
        const res = await api.get('appointments/')
        const apps = Array.isArray(res.data) ? res.data : []
        
        // Generate notifications based on recent updates
        const recentUpdates = apps.filter(a => {
          const updatedAt = new Date(a.updated_at)
          const now = new Date()
          return (now - updatedAt) < 24 * 60 * 60 * 1000 // Last 24 hours
        })

        const mapped = recentUpdates
          .filter(a => !clearedIds.has(`${a.id}-${a.status}`)) // Filter out acknowledged states
          .map(a => {
            if (role === 'PATIENT') {
              if (a.status === 'APPROVED') return { id: a.id, title: 'Appointment Confirmed', text: `Your visit with ${a.doctor.name} is ready.`, type: 'success', path: '/patient/appointments', status: a.status }
              if (a.status === 'COMPLETED') return { id: a.id, title: 'Consultation Complete', text: 'Thank you for visiting. Review your history.', type: 'info', path: '/patient/appointments', status: a.status }
            }
            if (role === 'DOCTOR') {
              if (a.status === 'PENDING') return { id: a.id, title: 'New Booking Request', text: `Patient ${a.patient} is waiting for approval.`, type: 'alert', path: '/doctor/appointments', status: a.status }
            }
            if (role === 'ADMIN') {
               return { id: a.id, title: 'System Update', text: `Appointment #${a.id} updated to ${a.status}.`, type: 'info', path: '/admin/appointments', status: a.status }
            }
            return null
          }).filter(Boolean)

        setNotifications(mapped)
      } catch (err) {
        console.error("Notif fetch failed")
      }
    }

    loadNotifications()
    const interval = setInterval(loadNotifications, 30000) // Poll every 30s
    return () => clearInterval(interval)
  }, [role, clearedIds])

  const clearNotifications = () => {
    const newCleared = new Set(clearedIds)
    notifications.forEach(n => newCleared.add(`${n.id}-${n.status}`))
    setClearedIds(newCleared)
    setNotifications([])
  }

  const isPublicPage = ['/', '/patient/login', '/patient/register', '/doctor/login', '/admin/login'].includes(location.pathname)

  const navItems = {
    PATIENT: [
      { name: 'Home', path: '/patient/home', icon: House },
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Find Doctors', path: '/patient/doctors', icon: Stethoscope },
      { name: 'My Appointments', path: '/patient/appointments', icon: History },
    ],
    DOCTOR: [
      { name: 'Home', path: '/doctor/home', icon: House },
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'Manage Slots', path: '/doctor/slots', icon: Calendar },
      { name: 'Appointments', path: '/doctor/appointments', icon: History },
    ],
    ADMIN: [
      { name: 'Home', path: '/admin/home', icon: House },
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Manage Doctors', path: '/admin/doctors', icon: Users },
      { name: 'All Appointments', path: '/admin/appointments', icon: History },
    ],
  }

  const homePath = (role && navItems[role]) ? navItems[role][0].path : '/'
  
  const currentNav = (role && navItems[role]) ? navItems[role].slice(1) : []

  if (isPublicPage) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="flex min-h-screen bg-secondary-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-secondary-900 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-secondary-800">
            <Calendar className="text-primary-500 mr-2" size={24} />
            <span className="text-xl font-bold tracking-tight">MedBook</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            <Link 
              to={homePath} 
              className={cn(
                "flex items-center px-2 py-2 rounded-lg group transition-all duration-200",
                location.pathname === homePath && !isPublicPage
                  ? "bg-primary-600/10 text-primary-400"
                  : "text-secondary-400 hover:text-white hover:bg-secondary-800"
              )}
            >
              <House className={cn(
                "mr-3 transition-colors",
                location.pathname === homePath && !isPublicPage ? "text-primary-400" : "text-secondary-400 group-hover:text-primary-400"
              )} size={20} />
              Home
            </Link>
            
            <div className="pt-4 pb-2 px-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
              Management
            </div>

            {currentNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSidebarOpen(false)
                }}
                className={cn(
                  "flex items-center px-2 py-2 rounded-lg group transition-all duration-200",
                  location.pathname === item.path 
                    ? "bg-primary-600 text-white" 
                    : "text-secondary-400 hover:text-white hover:bg-secondary-800"
                )}
              >
                <item.icon 
                  className={cn(
                    "mr-3 transition-colors",
                    location.pathname === item.path ? "text-white" : "text-secondary-400 group-hover:text-primary-400"
                  )} 
                  size={20} 
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-secondary-800">
            <button 
              onClick={logout}
              className="flex items-center w-full px-2 py-2 text-secondary-400 hover:text-white hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors group"
            >
              <LogOut className="mr-3 group-hover:animate-pulse" size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-secondary-200 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-10">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 rounded-md"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-4 ml-auto relative">
            <div className="relative group/notif">
              <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-full transition-colors relative">
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-secondary-100 rounded-2xl shadow-premium opacity-0 invisible group-hover/notif:opacity-100 group-hover/notif:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover/notif:scale-100 scale-95">
                <div className="px-5 py-4 border-b border-secondary-100 flex items-center justify-between bg-secondary-50/50">
                  <h4 className="font-bold text-secondary-900">Notifications</h4>
                  {notifications.length > 0 && (
                    <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{notifications.length} New</span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-5 py-10 text-center text-secondary-400 text-sm italic">
                      All caught up! No recent updates.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <Link 
                        key={`${n.id}-${n.type}`} 
                        to={n.path} 
                        className="block px-5 py-4 hover:bg-secondary-50 transition-colors border-b border-secondary-50 group"
                      >
                        <div className="flex gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                            n.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                            n.type === 'alert' ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                          )}>
                            {n.type === 'success' ? <CheckCircle2 size={18} /> : 
                             n.type === 'alert' ? <Calendar size={18} /> : <Bell size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-secondary-900">{n.title}</p>
                            <p className="text-xs text-secondary-500 mt-0.5">{n.text}</p>
                            <span className="text-[10px] text-primary-500 font-bold mt-2 inline-block">View Details →</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                  <div className="px-5 py-4 text-center">
                    <button 
                      onClick={clearNotifications}
                      className="text-xs font-bold text-secondary-400 hover:text-primary-600 transition-colors"
                    >
                      Clear all notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-secondary-200"></div>
            
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setIsSidebarOpen(prev => prev)}>
              {/* Note: The dropdown doesn't technically need an onClick handler if we implement CSS group-hover for the menu instead. Let's use group-hover for a sleek feel! */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">{role}</p>
                <p className="text-xs text-secondary-500">Authorized Access</p>
              </div>
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                {role?.charAt(0)}
              </div>

              {/* Hover Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-secondary-100 rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                <div className="px-4 py-3 border-b border-secondary-100 bg-secondary-50">
                  <p className="text-sm text-secondary-900 font-bold truncate">Signed in as</p>
                  <p className="text-xs text-secondary-500 truncate">{role}</p>
                </div>
                <div className="p-2">
                  <div className="px-2 py-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Account
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group/item"
                  >
                    <LogOut size={16} className="mr-2 group-hover/item:animate-pulse" />
                    Sign Out Safely
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Patient Routes */}
        <Route path="/patient" element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
          <Route path="home" element={<PatientHome />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="doctors" element={<DoctorList />} />
          <Route path="doctors/:id" element={<DoctorDetail />} />
          <Route path="appointments" element={<AppointmentHistory />} />
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<ProtectedRoute allowedRoles={['DOCTOR']} />}>
          <Route path="home" element={<DoctorHome />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="slots" element={<ManageSlots />} />
          <Route path="appointments" element={<DoctorAppointments />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="home" element={<AdminHome />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="appointments" element={<AppointmentsOverview />} />
        </Route>
      </Routes>
    </Layout>
  )
}

export default App
