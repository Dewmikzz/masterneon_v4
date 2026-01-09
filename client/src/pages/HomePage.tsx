import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Spline from '@splinetool/react-spline'
import { Sparkles, Palette, Package } from 'lucide-react'
import NeonButton from '../components/common/NeonButton'
import { defaultTemplates } from '../data/builderOptions'

const benefits = [
  { 
    title: 'Hand Bended Glass', 
    detail: 'Premium LED neon that mimics the warmth of glass.',
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-500',
    glowColor: 'shadow-pink-500/50'
  },
  { 
    title: 'Designer Concierge', 
    detail: 'Every order is refined by a designer before production.',
    icon: Palette,
    gradient: 'from-purple-500 to-indigo-500',
    glowColor: 'shadow-purple-500/50'
  },
  { 
    title: 'Islandwide Shipping', 
<<<<<<< HEAD
    detail: 'We offer reliable and efficient islandwide shipping for all your orders.',
=======
    detail: 'Delivered ready-to-hang with 2-year hardware warranty.',
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
    icon: Package,
    gradient: 'from-cyan-500 to-blue-500',
    glowColor: 'shadow-cyan-500/50'
  },
]

const HomePage = () => (
  <div className="space-y-16">
    <section className="grid gap-10 lg:grid-cols-2">
      <div>
        <motion.p
          className="text-sm uppercase tracking-[0.4em] text-white/60"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Custom Neon Studio
        </motion.p>
        <motion.h1
          className="neon-heading mt-4 text-5xl font-semibold leading-tight md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Light up every story with Master Neon
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Designers, event producers, and retail teams trust us for bold neon moments. Build yours in
          minutes with a live preview, concierge support, and gallery-worthy craftsmanship.
        </motion.p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <NeonButton onClick={() => (window.location.href = '/builder')}>Create Your Neon</NeonButton>
          <Link to="/about" className="text-sm uppercase tracking-[0.4em] text-white/60 hover:text-white">
            Learn more →
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
<<<<<<< HEAD
          {['3,400+ installs', '7-day average build', 'Islandwide dilivery'].map((stat) => (
=======
          {['3,400+ installs', '7-day average build', '2-year warranty'].map((stat) => (
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            <p key={stat} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
              {stat}
            </p>
          ))}
        </div>
      </div>
      <motion.div
        className="glass-panel relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-3xl" />
        <div className="relative aspect-[4/3] rounded-2xl border border-white/10 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.5em] text-white/50">Master Neon</p>
          <p className="mt-6 text-5xl font-neon text-pink-300 drop-shadow-neon">Neon Magic</p>
          <p className="mt-8 text-sm text-white/60">
            
          </p>
          <div className="relative aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden shadow-2xl [&_#logo]:hidden">
  <Spline scene="https://prod.spline.design/eo3ql3KAc3tEEiHd/scene.splinecode" />
</div>
          
        </div>
        
      </motion.div>
    </section>

    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">Recent installs</p>
        <Link to="/showcase" className="text-sm text-white/60 hover:text-white">
          See more →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {defaultTemplates.slice(0, 3).map((item, idx) => (
          <motion.div
            key={item.value}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 shadow-neon/40"
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          >
            <div className="relative h-60 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.label}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
<<<<<<< HEAD
                loading="eager"
                fetchPriority="high"
                decoding="sync"
=======
                loading="lazy"
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">Install #{idx + 1}</p>
                  <p className="text-lg font-semibold text-white drop-shadow-neon">{item.label}</p>
                </div>
                <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70">
                  Ready-made
                </span>
              </div>
            </div>
            
          </motion.div>
        ))}
      </div>
    </section>

    <section className="grid gap-6 md:grid-cols-3">
      {benefits.map((benefit, i) => {
        const Icon = benefit.icon
        return (
          <motion.div
            key={benefit.title}
            className="group glass-panel relative overflow-hidden border border-white/10 p-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Animated gradient background */}
            <motion.div 
              className={`absolute -inset-20 bg-gradient-to-r ${benefit.gradient} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-30`}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Icon container with glow effect */}
            <motion.div 
              className={`relative mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br ${benefit.gradient} shadow-xl ${benefit.glowColor}`}
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="h-8 w-8 text-white drop-shadow-lg" strokeWidth={1.5} />
              
              {/* Pulse effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0`}
                animate={{
                  opacity: [0, 0.4, 0],
                  scale: [1, 1.2, 1.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            </motion.div>
            
            <p className="relative text-xl font-semibold text-white">{benefit.title}</p>
            <p className="relative mt-3 text-sm leading-relaxed text-white/70">{benefit.detail}</p>
            
            {/* Hover accent line */}
            <motion.div 
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${benefit.gradient}`}
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )
      })}
    </section>

    <section className="glass-panel border border-white/10 p-8 text-center">
      <p className="text-xl font-semibold">Need a designer to polish your idea?</p>
      <p className="mt-3 text-white/70">
        Drop your artwork, mood board, or Pinterest inspiration. We'll refine it into production-ready neon.
      </p>
      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <NeonButton onClick={() => (window.location.href = '/builder')}>Launch Builder</NeonButton>
        <Link to="/contact" className="text-sm uppercase tracking-[0.4em] text-white/50 hover:text-white">
          Talk to a human →
        </Link>
      </div>
    </section>
  </div>
)

export default HomePage