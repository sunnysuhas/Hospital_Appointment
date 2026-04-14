import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Stethoscope, ChevronRight, Info } from 'lucide-react'
import api from '../../api/axios'

const DoctorList = () => {
  const [doctors, setDoctors] = useState([])
  const [specialization, setSpecialization] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDoctors = async (spec = specialization) => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (spec) params.specialization = spec
      const res = await api.get('doctors/', { params })
      setDoctors(res.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load doctors')
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDoctors()
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900 tracking-tight">Meet our Specialists</h1>
          <p className="text-secondary-500 mt-1">Book a consultation with our verified medical experts.</p>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
            <input
              type="text"
              className="input pl-10 h-12 py-3"
              placeholder="Search by specialization (e.g. Cardiology)"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 transition-colors">
              Search
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
          <Info size={20} className="mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card h-56 animate-pulse bg-secondary-100/50"></div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="card text-center py-16 bg-white border-dashed border-2">
          <div className="bg-secondary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary-300">
            <Stethoscope size={40} />
          </div>
          <h3 className="text-2xl font-bold text-secondary-900 mb-2">No Specialists Found</h3>
          <p className="text-secondary-500 max-w-sm mx-auto">We couldn't find any doctors matching your search. Try a different specialization or browse all.</p>
          <button 
            onClick={() => {setSpecialization(''); fetchDoctors('')}} 
            className="mt-6 text-primary-600 font-bold hover:text-primary-700 transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="group card hover:border-primary-100 hover:shadow-premium-hover transition-all duration-300 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                  <Stethoscope size={28} />
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-700 uppercase tracking-wider">
                  Verified
                </span>
              </div>

              <h2 className="text-xl font-bold text-secondary-900 mb-1 group-hover:text-primary-700 transition-colors">
                {doctor.name}
              </h2>
              <div className="inline-flex items-center text-sm font-medium text-secondary-500 mb-6 bg-secondary-50 px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></span>
                {doctor.specialization}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                <div className="text-xs text-secondary-400">
                  <span className="font-semibold text-secondary-600">Free</span> Consult
                </div>
                <Link 
                  to={`/patient/doctors/${doctor.id}`} 
                  className="flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
                >
                  View Profile <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorList
