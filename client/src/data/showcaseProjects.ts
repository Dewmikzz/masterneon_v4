export interface ShowcaseProject {
  id: string
  name: string
  location: string
  category: 'hospitality' | 'retail' | 'event' | 'office'
  description: string
  palette: string[]
  size: string
  photo: string
  metric: string
}

export const showcaseProjects: ShowcaseProject[] = [
  {
    id: 'velvet-room',
    name: 'Velvet Room Supper Club',
    location: 'Los Angeles, CA',
    category: 'hospitality',
    description: 'Signature script marquee with dual-tone dimming for nightly programming.',
    palette: ['#ff4df0', '#fef8e7'],
    size: '48 in • acrylic backboard',
    metric: 'Installed in 5 days',
    photo: 'https://images.unsplash.com/photo-1508255139162-e1f7b7288ab7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sunset-social',
    name: 'Sunset Social Rooftop',
    location: 'Miami, FL',
    category: 'event',
    description: 'Bold uppercase statement piece for rooftop cabana photo moments.',
    palette: ['#fff95b', '#00c2ff'],
    size: '60 in • outdoor-rated',
    metric: '2M social reach',
    photo: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'arcade-bar',
    name: 'CTRL Alt Arcade Bar',
    location: 'Austin, TX',
    category: 'retail',
    description: 'Retro grid-inspired neon with custom color sequencing synced to music.',
    palette: ['#ff2d55', '#39ff14'],
    size: '36 in • remote dimmer',
    metric: '12 locations',
    photo: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'studio-bloom',
    name: 'Studio Bloom Wellness',
    location: 'Chicago, IL',
    category: 'office',
    description: 'Calming script layered over frosted acrylic to soften studio lighting.',
    palette: ['#fef8e7', '#ff4df0'],
    size: '40 in • warm white',
    metric: 'Zero maintenance',
    photo: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80',
  },
]

