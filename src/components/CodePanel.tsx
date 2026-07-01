import { useCallback, useEffect, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import { useReducedMotion } from 'framer-motion'
import '../lib/monacoSetup'
import type { Problem } from '../types'
import { runPython } from '../lib/pyRunner'
import { config } from '../config'

interface CodePanelProps {
  problem: Problem
}

type Status = 'idle' | 'loading' | 'running' | 'done' | 'error'

export default function CodePanel({ problem }: CodePanelProps) {
  const [code, setCode] = useState(problem.code)
  const [stdin, setStdin] = useState(problem.stdin)
  const [output, setOutput] = useState('')
  const [displayed, setDisplayed] = useState('')
  const [isError, setIsError] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const reduce = useReducedMotion()
  const typeTimer = useRef<number | undefined>(undefined)

  // Reset when a different problem is opened.
  useEffect(() => {
    setCode(problem.code)
    setStdin(problem.stdin)
    setOutput('')
    setDisplayed('')
    setIsError(false)
    setStatus('idle')
  }, [problem])

  // Typewriter reveal of the captured output.
  useEffect(() => {
    if (typeTimer.current) window.clearInterval(typeTimer.current)
    if (!output) {
      setDisplayed('')
      return
    }
    if (reduce) {
      setDisplayed(output)
      return
    }
    let i = 0
    setDisplayed('')
    typeTimer.current = window.setInterval(() => {
      i += Math.max(1, Math.round(output.length / 240))
      setDisplayed(output.slice(0, i))
      if (i >= output.length) {
        if (typeTimer.current) window.clearInterval(typeTimer.current)
      }
    }, 16)
    return () => {
      if (typeTimer.current) window.clearInterval(typeTimer.current)
    }
  }, [output, reduce])

  const handleRun = useCallback(async () => {
    setStatus('loading')
    setStatusMsg('Warming up Python…')
    setOutput('')
    setDisplayed('')
    setIsError(false)
    const result = await runPython(code, stdin, (msg) => setStatusMsg(msg))
    setStatus('running')
    const combined =
      result.stdout + (result.stderr ? (result.stdout ? '\n' : '') + result.stderr : '')
    setIsError(!result.ok)
    setOutput(combined || '(no output)')
    setStatus(result.ok ? 'done' : 'error')
  }, [code, stdin])

  const onEditorMount: OnMount = (_editor, monaco) => {
    monaco.editor.defineTheme('atul-charcoal', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': config.palette.charcoal,
        'editor.lineHighlightBackground': '#26262A',
        'editorLineNumber.foreground': '#5A5A60',
        'editorCursor.foreground': config.palette.orange,
      },
    })
    monaco.editor.setTheme('atul-charcoal')
  }

  const busy = status === 'loading' || status === 'running'

  return (
    <div className="flex flex-col gap-4">
      {/* Editor — charcoal accent block */}
      <div className="overflow-hidden rounded-xl border border-white/10">
        <div className="flex items-center justify-between bg-ink-raised px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
            <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
            <span className="h-3 w-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="font-mono text-xs text-text-light/50">solution.py</span>
        </div>
        <Editor
          height="280px"
          defaultLanguage="python"
          language="python"
          value={code}
          onChange={(v) => setCode(v ?? '')}
          onMount={onEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 14, bottom: 14 },
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            smoothScrolling: true,
            tabSize: 4,
          }}
        />
      </div>

      {/* stdin + Run */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-text-light/50">
            stdin
          </span>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            rows={2}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-white/10 bg-ink-black px-3 py-2 font-mono text-sm text-text-light outline-none focus:border-orange"
            placeholder="Input passed to the program…"
          />
        </label>
        <button
          onClick={handleRun}
          disabled={busy}
          data-cursor="hover"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-orange px-6 text-sm font-bold text-white shadow-glow transition-colors hover:bg-orange-hover disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              {status === 'loading' ? 'Loading…' : 'Running…'}
            </>
          ) : (
            <>Run ▶</>
          )}
        </button>
      </div>

      {/* Terminal console */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-black">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-mono text-xs text-text-light/50">output</span>
          {status === 'loading' && (
            <span className="font-mono text-xs text-orange-light">{statusMsg}</span>
          )}
          {status === 'done' && <span className="font-mono text-xs text-[#28C840]">✓ done</span>}
          {status === 'error' && <span className="font-mono text-xs text-orange">⚠ error</span>}
        </div>
        <pre
          className={`max-h-64 overflow-auto whitespace-pre-wrap px-4 py-3 font-mono text-sm leading-relaxed ${
            isError ? 'text-[#FF7A4D]' : 'text-text-light'
          }`}
        >
          {displayed ||
            (status === 'idle'
              ? '# Press Run ▶ to execute in your browser (Pyodide).'
              : status === 'loading'
                ? statusMsg
                : '')}
          {busy && <span className="animate-pulse text-orange">▋</span>}
        </pre>
      </div>

      {problem.note && (
        <p className="text-xs italic text-text-light/50">Note: {problem.note}</p>
      )}
    </div>
  )
}
