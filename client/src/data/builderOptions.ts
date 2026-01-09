import type { NeonSize } from '../types/neon'

export const neonColorOptions = [
  { label: 'Warm White', value: '#fef8e7' },
  { label: 'White', value: '#e2e2e2' }, // Slightly off-white for visibility against white backgrounds
  { label: 'Golden Yellow', value: '#ffc107' },
  { label: 'Orange', value: '#ffa500' },
  { label: 'Light Red', value: '#ff5c5c' },
  { label: 'Red', value: '#ff0000' },
  { label: 'Pink', value: '#ff69b4' },
  { label: 'Purple', value: '#800080' },
  { label: 'Deep Blue', value: '#0000ff' },
  { label: 'Ice Blue', value: '#a5f2f3' },
  { label: 'Green', value: '#00ff00' },
]

// Font interface with category and new flag
export interface NeonFont {
  label: string
  value: string
  category: 'script' | 'modern' | 'outline'
  isNew?: boolean
}

export const neonFonts: NeonFont[] = [
  // Selected fonts only
  // Script/Handwritten
  { label: 'Alexa', value: '"Alexa", sans-serif', category: 'script' },
  { label: 'Amanda', value: '"Amanda", sans-serif', category: 'script' },
  { label: 'Amsterdam', value: '"Amsterdam", sans-serif', category: 'script' },
  { label: 'Barcelona', value: '"Barcelona", sans-serif', category: 'script' },
  { label: 'Bayview', value: '"Bayview", sans-serif', category: 'script' },
  { label: 'Florence', value: '"Florence", sans-serif', category: 'script' },
  { label: 'LazySunday', value: '"LazySunday", sans-serif', category: 'script' },
  { label: 'NewCursive', value: '"NewCursive", cursive', category: 'script' },
  { label: 'Odessa', value: '"Odessa", sans-serif', category: 'script' },
  { label: 'Venetian', value: '"Venetian", sans-serif', category: 'script' },
  { label: 'Vintage', value: '"Vintage", sans-serif', category: 'script' },
  { label: 'LoveNote', value: '"LoveNote", sans-serif', category: 'script' },

  // Modern/Sans-serif
  { label: 'LOSANGELES', value: '"LOSANGELES", sans-serif', category: 'modern' },
  { label: 'SIMPLICITY', value: '"SIMPLICITY", sans-serif', category: 'modern' },
  { label: 'DuneRise', value: '"DuneRise", sans-serif', category: 'modern' },

  // Outline/Neon
  { label: 'Bellview', value: '"Bellview", sans-serif', category: 'outline' },
  { label: 'LOVENEON', value: '"LOVENEON", sans-serif', category: 'outline' },
  { label: 'NEONGLOW', value: '"NEONGLOW", sans-serif', category: 'outline' },
  { label: 'Submarine', value: '"Submarine", sans-serif', category: 'outline' },
]

// Get default font (Barcelona)
export const getDefaultFont = (): string => {
  const barcelona = neonFonts.find(f => f.label === 'Barcelona')
  return barcelona?.value || neonFonts[0].value
}

export const sizeOptions: { label: string; value: NeonSize; description: string; maxLetters: number; price: number }[] = [
  { label: 'Small', value: 'small', description: '18 inch - 6 letters only', maxLetters: 6, price: 7500 },
  { label: 'Medium', value: 'medium', description: '24 inch - 8 letters only', maxLetters: 8, price: 9500 },
  { label: 'Large', value: 'large', description: '30 inch - 10 letters only', maxLetters: 10, price: 11500 },
]

export const sizeMultipliers: Record<NeonSize, number> = {
  small: 1,
  medium: 1.5,
  large: 2,
}

export const sizePrices: Record<NeonSize, number> = {
  small: 7500,
  medium: 9500,
  large: 11500,
}

export const sizeMaxLetters: Record<NeonSize, number> = {
  small: 6,
  medium: 8,
  large: 10,
}

export const defaultTemplates = [
  {
    label: 'Happy Birthday',
    value: 'happy-birthday',
    text: 'Happy Birthday',
    imageUrl: '/neon-designs/happy-birthday.png',
  },
  {
    label: 'Happy Anniversary',
    value: 'happy-anniversary',
    text: 'Happy Anniversary',
    imageUrl: '/neon-designs/happy-anniversary.png',
  },
  {
    label: 'Back Light Logo',
    value: 'back-light-logo',
    text: 'Back Light Logo',
    imageUrl: '/neon-designs/back-light-logo.png',
  },
  {
    label: 'Neon Name Logo',
    value: 'neon-mame-logo',
    text: 'Neon Name Logo',
    imageUrl: '/neon-designs/neon-name-logo.png',
  },
  {
    label: 'Neon Logo',
    value: 'neon-logo',
    text: 'Neon Logo',
    imageUrl: '/neon-designs/neon-logo.png',
  },
  {
    label: 'Neon Cat',
    value: 'neon-cat-01',
    text: 'Neon Cat',
    imageUrl: '/neon-designs/neon-cat-01.png',
  },
  {
    label: 'Neon Cat',
    value: 'neon-cat-02',
    text: 'Neon Cat',
    imageUrl: '/neon-designs/neon-cat-02.png',
  },
  {
    label: 'Neon Cat on Moon',
    value: 'cat-moon',
    text: 'Neon Cat on Moon',
    imageUrl: '/neon-designs/neon-cat-03.png',
  },
  {
    label: 'Happy Birthday Classic',
    value: 'hb-classic',
    text: 'Happy Birthday',
    imageUrl: '/neon-designs/hb-classic.jpg',
  },
  {
    label: 'Happy Birthday Cursive',
    value: 'hb-cursive',
    text: 'Happy Birthday',
    imageUrl: '/neon-designs/hb-cursive.jpg',
  },
  {
    label: 'Happy Birthday Modern',
    value: 'hb-modern',
    text: 'Happy Birthday',
    imageUrl: '/neon-designs/hb-modern.jpg',
  },
  {
    label: 'Happy Anniversary Heart',
    value: 'ha-heart',
    text: 'Happy Anniversary',
    imageUrl: '/neon-designs/ha-heart.png',
  },
]

export const emojiOptions = [
  '👑', '❤️', '💛', '💚', '💙', '💜', '🧡', '🖤', '🤍', '💖',
  '💗', '💓', '💕', '💞', '💟', '💝', '✨', '🌟', '💫', '⭐',
  '🔵', '🔥', '💎', '🎉', '🎊', '🎈', '🎁', '☀️', '🌙', '💯'
]
