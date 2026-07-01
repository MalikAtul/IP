/**
 * All user-facing constants live here.
 * Edit this file to personalise the site — no component changes needed.
 */

export const config = {
  // --- Identity -----------------------------------------------------------
  name: 'Atul',
  tagline: 'Class XI · Builder of things',
  heroName: 'Atul',
  heroTagline: 'Class XI · Builder of things',

  // --- Intro / preloader --------------------------------------------------
  introText: 'Namastee Sir 🙏',
  introDurationMs: 3500,

  // --- Deep Dive: slide deck ----------------------------------------------
  // Paste the embed URL for the Starship slide deck here. Leave empty ("")
  // to show the "Slide deck coming soon." placeholder — zero code change.
  STARSHIP_DECK_URL: '',

  // --- Contact links (placeholders — replace with your own) ---------------
  contact: {
    email: 'mailto:you@example.com',
    github: 'https://github.com/malikatul',
    linkedin: 'https://www.linkedin.com/',
    x: 'https://x.com/',
    instagram: 'https://instagram.com/',
  },

  // --- Navigation sections ------------------------------------------------
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'deep-dive', label: 'Deep Dive' },
    { id: 'contact', label: 'Contact' },
  ],

  // --- Palette tokens (mirror of tailwind.config.js, for JS/3D use) -------
  palette: {
    base: '#FBF7F1',
    orange: '#FF6B1A',
    orangeHover: '#E8580C',
    orangeLight: '#FF8A3D',
    black: '#0F0F10',
    charcoal: '#1C1C1F',
    raised: '#26262A',
    steel: '#B0B8C1',
    textDark: '#141414',
    textLight: '#F5F2EC',
    muted: '#6E6E73',
    divider: '#E7E2DA',
  },
} as const

export type AppConfig = typeof config
