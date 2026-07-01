import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Hosting note:
// - Project page (github.com/<user>/<repo>): set base to "/<repo>/".
//   The repo is "IP", and GitHub Pages paths are CASE-SENSITIVE, so the
//   production base must match the repo name exactly: "/IP/".
// - User page (repo = <user>.github.io): set base to "/".
// Dev always serves from "/".
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/IP/' : '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
  },
  optimizeDeps: {
    // Pyodide is loaded from the CDN at runtime, never bundled.
    exclude: [],
  },
}))
