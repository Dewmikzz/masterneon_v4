import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Heart, Store, Home, Calendar, Award, Zap, Package } from 'lucide-react'
import { Link } from 'react-router-dom'


const services = [
  {
    icon: Store,
    title: 'Neon Signs for Branding',
    description: 'Custom neon signage that makes your business unmissable and unforgettable.',
  },
  {
    icon: Home,
    title: 'Interior Lighting & Décor',
    description: 'Transform any space with vibrant LED and neon installations.',
  },
  {
    icon: Heart,
    title: 'Personalized Gifts',
    description: 'Romantic neon surprises for birthdays, weddings, and anniversaries.',
  },
  {
    icon: Calendar,
    title: 'Event Décor Lighting',
    description: 'Create unforgettable moments with custom event signage and lighting.',
  },
]

const offerings = [
  'Custom Neon & LED Signage',
  'Backlit Photo Frames',
  'Embossed Letter Signs',
  'Laser Cut Light Boards',
  'Acrylic Signage',
  'Glow Sign Boards',
  'Advertising Boards',
  'Personalized Neon Gifts',
]

const features = [
  { icon: Award, label: 'High Quality Designs' },
  { icon: Zap, label: 'Fast Production' },
  { icon: Package, label: 'Islandwide Delivery & Setup' },
  { icon: Sparkles, label: 'Sri Lanka\'s Trusted Creator' },
]

const handleWhatsAppClick = () => {
  const phoneNumber = "94769968638"; // e.g., "94771234567"
  const message = "test message"; // Optional: Add a pre-filled message
  
  const url = message 
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phoneNumber}`;
  
  window.open(url, '_blank');
};

const AboutPage = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(236,72,153,0.15),transparent_50%)]" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 inline-block rounded-full bg-purple-500/10 px-6 py-2 backdrop-blur-sm border border-purple-500/20"
          >
            <span className="text-sm font-medium tracking-wider text-purple-300">MASTER OF NEON</span>
          </motion.div>
          
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Light Up Your Brand,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Your Space, Your Moments
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300 md:text-xl">
            Sri Lanka's trusted creator of custom Neon & LED signage, interior lighting, and advertising boards for shops, homes, events, and unforgettable gifts.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/50">
              <Link to="/builder"><span className="relative z-10">Place Custom Order</span>
              </Link>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold backdrop-blur-sm transition-all hover:bg-white/10">
            <Link to="/contact"> View Portfolio
            </Link>
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">What We Create</h2>
            <p className="text-lg text-gray-400">From bold branding to intimate celebrations</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredService(index)}
                  onHoverEnd={() => setHoveredService(null)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10"
                >
                  <motion.div
                    animate={{
                      scale: hoveredService === index ? 1.1 : 1,
                      rotate: hoveredService === index ? 5 : 0,
                    }}
                    className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3"
                  >
                    <Icon className="h-6 w-6 text-purple-400" />
                  </motion.div>
                  <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                  <p className="text-sm text-gray-400">{service.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Offerings Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">We Specialize In</h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {offerings.map((offering, index) => (
              <motion.div
                key={offering}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 px-6 py-4 text-center backdrop-blur-sm"
              >
                <p className="font-medium text-white">{offering}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">Why Choose Master Of Neon</h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="mx-auto mb-4 inline-flex rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-4"
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <p className="text-lg font-semibold">{feature.label}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-purple-600/20 p-12 text-center backdrop-blur-sm"
        >
          <h2 className="mb-4 text-4xl font-bold">Ready to Glow?</h2>
          <p className="mb-8 text-xl text-gray-300">
            Whether you're a shop owner, interior designer, or looking for the perfect gift,
            <br />
            <span className="font-semibold text-purple-300">Master Of Neon delivers vibrant, high-quality designs.</span>
          </p>
          <p className="mb-8 text-2xl font-bold italic text-pink-300">
            "Your brand. Your story. Your glow."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
          <button 
  onClick={handleWhatsAppClick}
  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 text-lg font-semibold shadow-lg shadow-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/50"
>
  DM or WhatsApp Us
</button>
            <button className="rounded-full border border-white/20 bg-white/5 px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/10">
            <Link to="/showcase"> See Our Work
            </Link>
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default AboutPage