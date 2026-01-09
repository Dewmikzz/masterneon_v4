<<<<<<< HEAD
import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NavBar from '../navigation/NavBar'
import Footer from './Footer'

const SiteLayout = () => {
  const location = useLocation()
  const prevPath = useRef(location.pathname)
  const [isRouteChanging, setIsRouteChanging] = useState(false)

  useEffect(() => {
    if (location.pathname !== prevPath.current) {
      // Trigger a short transition indicator
      setIsRouteChanging(true)
      prevPath.current = location.pathname
      const t = setTimeout(() => setIsRouteChanging(false), 600)
      return () => clearTimeout(t)
    }
    return
  }, [location.pathname])

  const pageVariants = {
    initial: { opacity: 0, y: 8, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
    exit: { opacity: 0, y: -6, scale: 0.995, transition: { duration: 0.35, ease: 'easeIn' } },
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#05060a_55%)] text-white">
      <NavBar />

      {/* Top progress / transition bar */}
      <div className="relative">
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isRouteChanging ? 1 : 0 }}
          transition={{ duration: isRouteChanging ? 0.55 : 0.35, ease: 'easeInOut' }}
          style={{ transformOrigin: '0% 50%' }}
          className="pointer-events-none absolute left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-pink-500 via-cyan-400 to-pink-500"
        />
      </div>

      <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
=======
import { Outlet } from 'react-router-dom'
import NavBar from '../navigation/NavBar'
import Footer from './Footer'

const SiteLayout = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1f2937_0%,#05060a_55%)] text-white">
    <NavBar />
    <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-12">
      <Outlet />
    </main>
    <Footer />
  </div>
)
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a

export default SiteLayout

