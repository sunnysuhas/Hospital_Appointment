import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Search } from 'lucide-react'

export const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

export const PageTransition = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
)

export const MotionCard = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4, scale: 1.01 }}
    transition={{ duration: 0.32, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`card ${className}`}
  >
    {children}
  </motion.div>
)

export const CountUp = ({ value = 0, duration = 700, className = '' }) => {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const numericValue = Number(value) || 0
    const start = performance.now()
    let frame

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(Math.round(numericValue * progress))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <span className={className}>{display}</span>
}

export const StatCard = ({ icon: Icon = Activity, label, value, accent = 'primary', helper, delay = 0 }) => {
  const accents = {
    primary: 'border-l-primary-500 bg-primary-50 text-primary-600',
    emerald: 'border-l-emerald-500 bg-emerald-50 text-emerald-600',
    amber: 'border-l-amber-500 bg-amber-50 text-amber-600',
    rose: 'border-l-rose-500 bg-rose-50 text-rose-600',
    violet: 'border-l-violet-500 bg-violet-50 text-violet-600',
    slate: 'border-l-secondary-500 bg-secondary-50 text-secondary-600',
  }

  const accentClasses = accents[accent] || accents.primary

  return (
    <MotionCard delay={delay} className={`border-l-4 ${accentClasses.split(' ')[0]}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${accentClasses.split(' ').slice(1).join(' ')}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-secondary-500">{label}</p>
          <p className="text-3xl font-extrabold text-secondary-900">
            <CountUp value={value} />
          </p>
          {helper && <p className="text-xs text-secondary-400 mt-1">{helper}</p>}
        </div>
      </div>
    </MotionCard>
  )
}

export const SkeletonBlock = ({ className = 'h-24' }) => (
  <div className={`card overflow-hidden ${className}`}>
    <div className="h-full w-full animate-pulse rounded-xl bg-gradient-to-r from-secondary-100 via-white to-secondary-100" />
  </div>
)

export const EmptyState = ({
  icon: Icon = Search,
  title = 'No data found',
  message = 'There is nothing to show here yet.',
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="card text-center py-16 border-dashed border-2 bg-white"
  >
    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-500">
      <Icon size={38} />
    </div>
    <h3 className="text-xl font-bold text-secondary-900">{title}</h3>
    <p className="mx-auto mt-2 max-w-md text-sm text-secondary-500">{message}</p>
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
)
