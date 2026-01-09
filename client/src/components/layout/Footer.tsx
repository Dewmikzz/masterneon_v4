const Footer = () => {
  const year = new Date().getFullYear()

  const primaryLinks = [
    { label: 'Home', href: '/' },
    { label: 'Builder', href: '/builder' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const highlights = [
    '24h design proofs',
    '7-day average build',
    'Worldwide shipping',
    'Custom sizing & colors',
  ]

  const socials = [
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61561433176230', tag: 'Master Of Neon' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@master_neon2025', tag: 'Master Neon' },
    { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=%2B94769968638', tag: 'WhastApp' },
  ]

  return (
    <footer className="relative mt-16 border-t border-white/10 bg-[#05060a]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,77,240,0.10),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,194,255,0.12),transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        {/* Top CTA */}
        <div className="mb-10 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-neon md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Ready to glow</p>
            <h3 className="mt-2 text-2xl font-semibold text-white drop-shadow-neon">Start a custom neon brief</h3>
            <p className="mt-2 text-sm text-white/70">
              Share your idea, upload a logo, and preview your sign in seconds. We send proofs within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <a
              href="/builder"
              className="rounded-full border border-pink-400/70 bg-pink-500/15 px-4 py-2 text-sm font-medium text-pink-100 shadow-neon transition hover:-translate-y-0.5 hover:bg-pink-500/25"
            >
              Open Builder
            </a>
            <a
              href="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:-translate-y-0.5 hover:border-white/40"
            >
              Talk to a Designer
            </a>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr]">
          {/* Brand + highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-pink-400/60 bg-gradient-to-br from-pink-500/40 to-cyan-500/40 shadow-neon">
            <img
              src="/pdf/master-neon-logo.png"
              alt="Master Neon logo"
              className="h-full w-full object-contain p-0 transform scale-110"
<<<<<<< HEAD
              loading="eager"
              fetchPriority="high"
              decoding="sync"
=======
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            />
          </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Master</p>
                <p className="text-xl font-semibold text-white drop-shadow-neon">NEON</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Modern neon for brands, interiors, events, and art. Engineered for vivid glow, easy install, and long life.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Links + contact */}
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Navigate</p>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                {primaryLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className="transition hover:text-pink-300 hover:drop-shadow-neon"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 text-sm text-white/80">
              <p className="text-sm uppercase tracking-[0.3em] text-white/50">Connect</p>
              <div className="space-y-1">
                <p>masterneon2025@gmail.com</p>
                <p>+94 (76) 996-8638</p>
                <p>Ratiyala. • Worldwide shipping</p>
              </div>
              <div className="pt-2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Social</p>
                <div className="mt-2 space-y-1">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      className="flex items-center gap-2 text-white/75 transition hover:text-pink-300"
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-400 to-cyan-400 shadow-neon" />
                      <span>{social.label}</span>
                      <span className="text-white/50">• {social.tag}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50">
          <p>© {year} Master Neon. Crafted with luminous intent.</p>
          <p>Low-volt, energy efficient, RoHS compliant.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

