import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    const storedUserId = localStorage.getItem('user_id')
    const storedPatientId = localStorage.getItem('patient_id')
    const storedDoctorId = localStorage.getItem('doctor_id')
    if (storedRole && storedUserId) {
      setRole(storedRole)
      setUser({ id: storedUserId, patient_id: storedPatientId, doctor_id: storedDoctorId })
    }
  }, [])

  const login = (data) => {
    localStorage.setItem('access', data.access)
    localStorage.setItem('refresh', data.refresh)
    localStorage.setItem('role', data.role)
    if (data.user_id) localStorage.setItem('user_id', data.user_id)
    if (data.patient_id) localStorage.setItem('patient_id', data.patient_id)
    if (data.doctor_id) localStorage.setItem('doctor_id', data.doctor_id)
    setRole(data.role)
    setUser({ id: data.user_id, patient_id: data.patient_id, doctor_id: data.doctor_id })
  }

  const logout = () => {
    localStorage.clear()
    setRole(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
