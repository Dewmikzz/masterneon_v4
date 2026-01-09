import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { defaultTemplates } from '../data/builderOptions'
import NeonButton from '../components/common/NeonButton'

type ShowcaseTag = 'Logos' | 'Events' | 'Names' | 'Icons' | 'Abstract'

interface ShowcaseItem {
  label: string
  value: string
  imageUrl: string
  description: string
  tags: ShowcaseTag[]
}

const tagMap: Record<string, ShowcaseTag[]> = {
  'happy-birthday': ['Events', 'Names'],
  'happy-anniversary': ['Events', 'Names'],
  'back-light-logo': ['Logos'],
  'neon-mame-logo': ['Names', 'Logos'],
  'neon-logo': ['Logos'],
  'neon-cat-01': ['Icons'],
  'neon-cat-02': ['Icons'],
  'cat-moon': ['Abstract', 'Icons'],
<<<<<<< HEAD
  'hb-classic': ['Events', 'Names'],
  'hb-cursive': ['Events', 'Names'],
  'hb-modern': ['Events'],
  'ha-heart': ['Events'],
=======
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
}

const showcaseItems: ShowcaseItem[] = defaultTemplates.map((item) => ({
  label: item.label,
  value: item.value,
  imageUrl: item.imageUrl,
  description: item.text,
  tags: tagMap[item.value] ?? ['Icons'],
}))

const availableTags: (ShowcaseTag | 'All')[] = ['All', 'Logos', 'Events', 'Names', 'Icons', 'Abstract']

export default function ShowcasePage() {
  const [activeTag, setActiveTag] = useState<ShowcaseTag | 'All'>('All')
  const [selected, setSelected] = useState<ShowcaseItem>(showcaseItems[0])
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    return showcaseItems.filter((item) => {
      const matchesTag = activeTag === 'All' || item.tags.includes(activeTag)
      const matchesSearch = item.label.toLowerCase().includes(search.toLowerCase())
      return matchesTag && matchesSearch
    })
  }, [activeTag, search])

  return (
    <div className="space-y-10">
<<<<<<< HEAD
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0d13] via-[#0f0b17] to-[#0a1020] p-6 shadow-neon md:p-8">
=======
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b0d13] via-[#0f0b17] to-[#0a1020] p-8 shadow-neon">
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,77,240,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(0,194,255,0.12),transparent_40%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Showcase</p>
<<<<<<< HEAD
            <h1 className="text-3xl font-semibold text-white drop-shadow-neon md:text-4xl">Our favorite ready-to-glow designs</h1>
=======
            <h1 className="text-4xl font-semibold text-white drop-shadow-neon">Our favorite ready-to-glow designs</h1>
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            <p className="text-white/70">
              Explore modern presets for events, logos, and art. Pick a design, add your name, and download a PDF or send
              it to our designers in one click.
            </p>
            <div className="flex flex-wrap gap-3">
              <NeonButton
                variant="secondary"
                onClick={() => document.getElementById('showcase-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse gallery
              </NeonButton>
<<<<<<< HEAD
              <NeonButton
                onClick={() => (window.location.href = `/builder?preset=${selected.value}`)}
              >
                Customize Design
              </NeonButton>
=======
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                24h proofs
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                Ready-made templates
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                Color & size flexible
              </span>
            </div>
          </div>
          <motion.div
            layout
            className="relative rounded-2xl border border-white/10 bg-white/5 p-4 shadow-neon"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-black/60">
<<<<<<< HEAD
              <img
                src={selected.imageUrl}
                alt={selected.label}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
=======
              <img src={selected.imageUrl} alt={selected.label} className="h-full w-full object-cover" loading="lazy" />
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            </div>
            <div className="mt-4 text-sm text-white/80">
              <p className="font-semibold text-white">{selected.label}</p>
              <p className="text-white/60">{selected.description}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-6" id="showcase-grid">
        <div className="flex flex-wrap items-center gap-3">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag === 'All' ? 'All' : tag)}
<<<<<<< HEAD
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${activeTag === tag
                ? 'border-pink-400/70 bg-pink-500/20 text-white shadow-neon'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-pink-400/40'
                }`}
=======
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition ${
                activeTag === tag
                  ? 'border-pink-400/70 bg-pink-500/20 text-white shadow-neon'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-pink-400/40'
              }`}
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
            >
              {tag}
            </button>
          ))}
<<<<<<< HEAD
          <div className="mt-2 flex w-full items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 md:mt-0 md:ml-auto md:w-auto">
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none md:w-auto"
=======
          <div className="ml-auto flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2">
            <input
              className="bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
              placeholder="Search designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <motion.div
              key={item.value}
              layout
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-neon/20 transition hover:border-pink-400/40 hover:shadow-neon"
            >
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 bg-black/50 px-2 py-1 backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(item)}
<<<<<<< HEAD
                className="mt-4 w-full rounded-xl border px-4 py-3 text-left text-sm transition border-white/10 bg-black/40 text-white/80 hover:border-pink-400/40"
=======
                className={`mt-4 w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected.value === item.value
                    ? 'border-pink-400/70 bg-pink-500/15 text-white'
                    : 'border-white/10 bg-black/40 text-white/80 hover:border-pink-400/40'
                }`}
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-white/60">{item.description}</p>
                  </div>
<<<<<<< HEAD
                  {/* 'Selected' badge removed per request */}
=======
                  {selected.value === item.value && (
                    <span className="text-[10px] uppercase tracking-[0.3em] text-pink-300">Selected</span>
                  )}
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
            No designs matched your search. Try another keyword or tag.
          </div>
        )}
      </section>
    </div>
  )
}

