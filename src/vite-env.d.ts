/// <reference types="vite/client" />

// Pyodide is attached to window by the CDN script loaded at runtime.
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>
  runPython: (code: string) => unknown
  setStdin: (opts: { stdin: () => string | null }) => void
  setStdout: (opts: { batched?: (s: string) => void; raw?: (n: number) => void }) => void
  setStderr: (opts: { batched?: (s: string) => void; raw?: (n: number) => void }) => void
  globals: { get: (name: string) => unknown; set: (name: string, value: unknown) => void }
  loadPackagesFromImports: (code: string) => Promise<void>
}

interface Window {
  loadPyodide?: (config?: { indexURL?: string }) => Promise<PyodideInterface>
}
