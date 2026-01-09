import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '../common/NeonButton'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Builder', to: '/builder' },
  { label: 'Showcase', to: '/showcase' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (to: string, e: React.MouseEvent) => {
    // Check if we're already on this page
    if (location.pathname === to) {
      e.preventDefault()
      // Refresh and scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' })
      window.location.reload()
    } else {
      // Normal navigation
      navigate(to)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-pink-400/60 bg-gradient-to-br from-pink-500/40 to-cyan-500/40 shadow-neon">
            <img
              src="/pdf/master-neon-logo.png"
              alt="Master Neon logo"
              className="h-full w-full object-contain p-0 transform scale-110"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">Master</p>
            <p className="text-xl font-semibold text-white drop-shadow-neon">NEON</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <button
                key={link.to}
                type="button"
                onClick={(e) => handleNavClick(link.to, e)}
                className={clsx(
                  'text-sm uppercase tracking-[0.3em] transition hover:text-pink-400',
                  isActive ? 'text-pink-300' : 'text-white/70',
                )}
              >
                {link.label}
              </button>
            )
          })}
          <NeonButton onClick={() => (window.location.href = '/builder')}>
            Create Your Neon
          </NeonButton>
        </nav>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span className="text-white/80">{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden"
          >
            <div className="space-y-2 border-t border-white/10 bg-black/70 px-6 py-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to
                return (
                  <button
                    key={link.to}
                    type="button"
                    onClick={(e) => {
                      handleNavClick(link.to, e)
                      setOpen(false)
                    }}
                    className={clsx(
                      'block w-full rounded-lg px-4 py-2 text-left text-sm uppercase tracking-widest',
                      isActive ? 'bg-pink-500/20 text-pink-300' : 'text-white/80',
                    )}
                  >
                    {link.label}
                  </button>
                )
              })}
              <NeonButton className="w-full" onClick={() => (window.location.href = '/builder')}>
                Create Your Neon
              </NeonButton>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default NavBar
