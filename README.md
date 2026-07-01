# Atul — 3D Scroll Portfolio + Python Showcase

An immersive, scroll-driven **3D personal portfolio** built with React, Three.js,
GSAP and Lenis — with a live **Python showcase** that runs real code in the
browser via Pyodide, and an interactive, procedurally-built **SpaceX Starship
explorer**. Warm, editorial, light-forward design with deliberate dark accent
blocks and orange as the energy colour.

Deployable to **GitHub Pages** with the included GitHub Actions workflow.

---

## ✨ Features

- **Mascot guide character** — a custom SVG doodle (`<MascotCharacter pose=… />`)
  with 16 hand-built poses (`idle · wave · point-* · thinking · celebrate ·
  dance · run · sit-type · sit-chill · explain · mind-blown · thumbs-up ·
  facepalm · superhero-landing`). He breathes, blinks and looks around when
  idle, follows the cursor in the hero, reacts per-section (celebrates a clean
  code run, facepalms a traceback, is mind-blown by the Starship, jumps on
  Explode), plays a random pose on hover, and pops a speech-bubble quip on click.
- **Cinematic intro / preloader** — the mascot runs in and waves while
  "Namastee Sir 🙏" emerges from deep z-space; hidden looping audio +
  mute/unmute toggle; superhero-landing on enter.
- **Reactive hero** — a distorted icosahedron shader-blob that responds to
  pointer and scroll, with orbiting tech-stack logo pills (Python, React,
  Three.js, GitHub) and the cursor-following mascot.
- **About / Creator** — parallax + reveal-on-scroll; expandable project cards
  (DRISHTI with a classified “dual-use” stamp, TechnoXian, Confidential ×2), a
  standalone Ministry-of-Defence affiliation block, a logo tech-stack grid,
  count-up stats, and a cinematic “Building toward” block.
- **Python showcase** — every problem from `src/data/problems_advanced.json`
  rendered as a tilt/glow/magnetic card. Open one to get a **Monaco** editor
  (self-hosted, editable), an editable **stdin** box, a **Run ▶** button, and a
  terminal console that executes the code with **Pyodide** and streams the output
  with a typewriter effect. Tracebacks render in red-orange.
- **Deep Dive: Starship** — a full-screen R3F explorer built entirely from
  Three.js primitives (no GLTF). Orbit it, then **Explode** to fan every
  subsystem apart with GSAP; each part gets a floating label and a slide-in side
  panel with its software/systems story. Below it, a 16:9 slide-deck embed.
- **"Life everywhere"** — custom cursor + trailing follower, magnetic buttons,
  hover tilt on cards, a top scroll-progress bar, number counters that count up
  in view, subtle scroll-velocity page tilt, ambient particles, split-text
  reveals, smooth anchor nav, idle 3D animation.
- **Accessible & responsive** — keyboard nav, focus trap on the modal, aria
  labels, `prefers-reduced-motion` fallbacks, and lighter 3D on mobile.

## 🧱 Tech stack

Vite · React 18 · TypeScript (strict) · three · @react-three/fiber ·
@react-three/drei · GSAP + ScrollTrigger · Lenis · Framer Motion · Tailwind CSS ·
@monaco-editor/react (self-hosted Monaco) · Pyodide (from the official CDN).

## 🚀 Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server → http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build locally
```

> **Note:** the Python runner (Pyodide) is fetched from the official jsdelivr CDN
> the first time you press **Run ▶**, so running code needs an internet
> connection. Everything else works offline.

## 🗂 Project structure

```
src/
  scenes/        Three.js / R3F scenes (HeroBlob, ParticleField,
                 StarshipModel, StarshipExplorer, starshipParts)
  components/    UI (Nav, Hero, About, PythonShowcase, ProblemCard,
                 ProblemModal, CodePanel, StarshipSection, DeckEmbed,
                 StarshipSidePanel, Footer, Intro, CustomCursor,
                 MagneticButton, SplitText)
  lib/
    pyRunner.ts      Pyodide loader + runner
    monacoSetup.ts   Self-hosted Monaco (Python-only, offline)
    useSmoothScroll  Lenis + GSAP ScrollTrigger wiring
    useActiveSection / useIsMobile
  data/
    problems_advanced.json   The showcase content (never hardcoded)
  config.ts      All user-facing constants (name, tagline, intro text,
                 palette tokens, contact links, STARSHIP_DECK_URL)
```

## 🎨 Colour palette

| Token | Value |
| --- | --- |
| Background | `#FBF7F1` |
| Orange (accent) | `#FF6B1A` · hover `#E8580C` · gradient `#FF8A3D → #FF6B1A` |
| Dark blocks | `#0F0F10` · `#1C1C1F` · `#26262A` |
| Text | `#141414` on light · `#F5F2EC` on dark |
| Secondary / dividers | `#6E6E73` · `#E7E2DA` |

## 🌐 Deploying to GitHub Pages

The repo ships with `.github/workflows/deploy.yml`, which builds on every push to
`main` and deploys `dist/` to GitHub Pages.

The `base` in `vite.config.ts` is set for a **project page** (`/ip/`). Adjust it
to match your hosting (see the checklist below), then push to `main` and enable
Pages.

---

## ✅ What you need to do personally

1. **Set the correct `base` in `vite.config.ts`.**
   - Project page (`github.com/<user>/<repo>`): `base: "/<repo>/"`
     — currently `"/ip/"` for this repo.
   - User page (repo = `<user>.github.io`): `base: "/"`.
2. **Enable GitHub Pages:** repo **Settings → Pages → Source = GitHub Actions**.
3. **Add the intro audio:** drop your track at `public/audio/intro.mp3`.
4. **Set the slide deck:** put the embed URL in `STARSHIP_DECK_URL` in
   `src/config.ts` (empty string shows a "coming soon" placeholder — no code
   change needed).
5. **Replace placeholder contact links** in `src/config.ts` (`contact.*`).
