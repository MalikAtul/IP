/**
 * Pyodide loader + runner.
 *
 * Pyodide is lazy-loaded from the official CDN the first time the user runs
 * code. A single shared interpreter is reused for every subsequent run.
 */

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

export interface RunResult {
  stdout: string
  stderr: string
  ok: boolean
}

let pyodidePromise: Promise<PyodideInterface> | null = null

/** Inject the pyodide.js CDN script exactly once. */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-pyodide]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.dataset.pyodide = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Pyodide from the CDN.'))
    document.head.appendChild(script)
  })
}

/**
 * Load (or return the cached) Pyodide interpreter.
 * @param onStatus optional progress-message callback for the loading UI.
 */
export function getPyodide(onStatus?: (msg: string) => void): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise

  pyodidePromise = (async () => {
    onStatus?.('Fetching Pyodide runtime…')
    await loadScript(`${PYODIDE_CDN}pyodide.js`)

    if (!window.loadPyodide) {
      throw new Error('Pyodide global not found after loading the CDN script.')
    }

    onStatus?.('Booting the Python interpreter…')
    const pyodide = await window.loadPyodide({ indexURL: PYODIDE_CDN })
    onStatus?.('Ready.')
    return pyodide
  })()

  // Reset the promise on failure so a later click can retry.
  pyodidePromise.catch(() => {
    pyodidePromise = null
  })

  return pyodidePromise
}

/** True once Pyodide has been requested at least once (used to hint the UI). */
export function isPyodideRequested(): boolean {
  return pyodidePromise !== null
}

/**
 * Run Python `code` with `stdinText` piped to stdin.
 * Captures stdout and stderr and returns them as strings.
 */
export async function runPython(
  code: string,
  stdinText: string,
  onStatus?: (msg: string) => void,
): Promise<RunResult> {
  const pyodide = await getPyodide(onStatus)

  let stdout = ''
  let stderr = ''

  // Feed the provided stdin, one line at a time, so input() reads sequentially.
  const lines = stdinText.length > 0 ? stdinText.split('\n') : []
  // split('a\n') -> ['a', ''] — drop the trailing empty caused by a final newline
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()
  let lineIndex = 0

  pyodide.setStdin({
    stdin: () => {
      if (lineIndex >= lines.length) return null // EOF -> input() raises EOFError
      return lines[lineIndex++] + '\n'
    },
  })
  pyodide.setStdout({ batched: (s: string) => (stdout += s) })
  pyodide.setStderr({ batched: (s: string) => (stderr += s) })

  try {
    // Best-effort: pull in any non-stdlib imports (harmless for stdlib-only code).
    try {
      await pyodide.loadPackagesFromImports(code)
    } catch {
      /* ignore package-resolution issues; stdlib code needs nothing */
    }
    await pyodide.runPythonAsync(code)
    return { stdout, stderr, ok: stderr.trim().length === 0 }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    // Pyodide surfaces Python tracebacks as the error message.
    return { stdout, stderr: (stderr ? stderr + '\n' : '') + message, ok: false }
  }
}
