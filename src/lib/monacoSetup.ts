/**
 * Self-host a trimmed Monaco (instead of loading it from a CDN) so the code
 * editor works offline with no CDN console errors. We import only the editor
 * core + the Python basic-language contribution — not the ~80 other languages
 * or the TS/CSS/HTML/JSON language services — keeping the lazy chunk small.
 */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/python/python.contribution'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { loader } from '@monaco-editor/react'

// Basic Python tokenization needs only the core editor worker.
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

loader.config({ monaco })

export {}
