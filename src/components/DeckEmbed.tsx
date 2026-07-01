import { useRef } from 'react'
import { config } from '../config'
import SplitText from './SplitText'

export default function DeckEmbed() {
  const frameRef = useRef<HTMLDivElement>(null)
  const url = config.STARSHIP_DECK_URL

  const goFullscreen = () => {
    const el = frameRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen?.()
    }
  }

  return (
    <section className="bg-base py-20 md:py-28">
      <div className="container-page">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
              Slide Deck
            </p>
            <h3 className="text-3xl font-black md:text-4xl">
              <SplitText text="Starship: The Software Story — Slide Deck" as="span" />
            </h3>
          </div>
          {url && (
            <button
              onClick={goFullscreen}
              data-cursor="hover"
              className="rounded-full border border-ink-black/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-orange hover:text-orange"
            >
              Fullscreen ⛶
            </button>
          )}
        </div>

        {/* Charcoal frame + orange accent line */}
        <div className="rounded-2xl bg-ink-charcoal p-3 shadow-card">
          <div className="mb-3 h-1 w-24 rounded-full bg-orange-grad" />
          <div
            ref={frameRef}
            className="relative w-full overflow-hidden rounded-xl bg-ink-black"
            style={{ aspectRatio: '16 / 9' }}
          >
            {url ? (
              <iframe
                src={url}
                title="Starship: The Software Story slide deck"
                allow="fullscreen; autoplay"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-orange/15 text-2xl">
                    🛰️
                  </div>
                  <p className="text-lg font-semibold text-text-light">Slide deck coming soon.</p>
                  <p className="mt-2 text-sm text-text-light/50">
                    Set <code className="text-orange">STARSHIP_DECK_URL</code> in{' '}
                    <code className="text-orange">src/config.ts</code> to embed it here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
