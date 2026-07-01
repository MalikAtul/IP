import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { config } from '../config'
import MascotCharacter, { type MascotPose } from './Mascot/MascotCharacter'

interface IntroProps {
  onFinish: () => void
}

/**
 * Full-screen near-black preloader. The intro words emerge from deep z-space
 * (tiny, far, blurred → sharp, centered, warm glow). Dissolves after
 * ~introDurationMs or on any click / scroll / key press.
 */
export default function Intro({ onFinish }: IntroProps) {
  const [visible, setVisible] = useState(true)
  const [muted, setMuted] = useState(false) // sound ON by default
  const [offerSound, setOfferSound] = useState(false)
  const [mascotPose, setMascotPose] = useState<MascotPose>('run')
  const audioRef = useRef<HTMLAudioElement>(null)
  const reduce = useReducedMotion()

  const dismiss = useCallback(() => {
    setMascotPose('superhero-landing')
    setVisible((v) => {
      if (v) window.setTimeout(onFinish, 700) // allow exit animation
      return false
    })
  }, [onFinish])

  // Mascot beat sheet: run in → wave → thumbs-up.
  useEffect(() => {
    if (reduce) {
      setMascotPose('wave')
      return
    }
    const t1 = window.setTimeout(() => setMascotPose('wave'), 1100)
    const t2 = window.setTimeout(() => setMascotPose('thumbs-up'), 2100)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [reduce])

  // Auto-dismiss timer.
  useEffect(() => {
    const t = window.setTimeout(dismiss, reduce ? 900 : config.introDurationMs)
    return () => window.clearTimeout(t)
  }, [dismiss, reduce])

  // Keep the audio element in sync with the mute state; sound is ON by default,
  // so try to start playback immediately (browsers may defer it until the first
  // user gesture — see the interaction handler below).
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = muted
    if (!muted) {
      audio.volume = 0.5
      void audio.play().catch(() => {})
    }
  }, [muted])

  // Any deliberate interaction dismisses early and offers sound. A short grace
  // period prevents a stray wheel/scroll at load (e.g. from Lenis init) from
  // killing the intro before it's even seen.
  useEffect(() => {
    const mountedAt = Date.now()
    const GRACE_MS = 900
    const onInteract = () => {
      setOfferSound(true)
      // First gesture satisfies the browser's autoplay policy — start sound now.
      const audio = audioRef.current
      if (audio && !audio.muted) void audio.play().catch(() => {})
    }
    const onDismiss = () => {
      if (Date.now() - mountedAt < GRACE_MS) return
      dismiss()
    }
    window.addEventListener('keydown', onDismiss)
    window.addEventListener('wheel', onDismiss, { passive: true })
    window.addEventListener('touchmove', onDismiss, { passive: true })
    window.addEventListener('pointerdown', onInteract)
    return () => {
      window.removeEventListener('keydown', onDismiss)
      window.removeEventListener('wheel', onDismiss)
      window.removeEventListener('touchmove', onDismiss)
      window.removeEventListener('pointerdown', onInteract)
    }
  }, [dismiss])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.muted = false
      audio.volume = 0.5
      void audio.play().catch(() => {})
      setMuted(false)
    } else {
      audio.muted = true
      setMuted(true)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          onClick={dismiss}
          role="dialog"
          aria-label="Intro"
        >
          {/* Hidden looping intro audio (public/audio/audio.mp3). Sound is on by default. */}
          <audio id="intro-audio" ref={audioRef} loop autoPlay preload="auto">
            <source src={`${import.meta.env.BASE_URL}audio/audio.mp3`} type="audio/mpeg" />
          </audio>

          <motion.h1
            className="select-none text-center text-5xl font-black tracking-tight md:text-7xl"
            style={{
              color: '#FFB877',
              textShadow: '0 0 40px rgba(255,138,61,0.55), 0 0 120px rgba(255,107,26,0.35)',
            }}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.2, filter: 'blur(14px)', z: -400 }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, filter: 'blur(0px)', z: 0 }
            }
            transition={{ duration: reduce ? 0.5 : 2.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {config.introText}
          </motion.h1>

          <motion.p
            className="mt-6 text-xs uppercase tracking-[0.35em] text-text-light/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0.4 : 1.6, duration: 1 }}
          >
            click · scroll · to enter
          </motion.p>

          {/* Mascot runs in from the left and greets */}
          <motion.div
            className="mt-6"
            initial={reduce ? { opacity: 0 } : { x: -360, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { x: 0, opacity: 1 }}
            transition={{ duration: reduce ? 0.4 : 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <MascotCharacter pose={mascotPose} size={150} interactive={false} />
          </motion.div>

          {/* Mute / unmute toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            data-cursor="hover"
            aria-label={muted ? 'Enable sound' : 'Mute sound'}
            className="absolute bottom-8 right-8 flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-text-light/70 transition-colors hover:border-orange hover:text-orange"
          >
            {muted ? '🔇 Sound off' : '🔊 Sound on'}
          </button>

          {offerSound && muted && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => {
                e.stopPropagation()
                toggleMute()
              }}
              data-cursor="hover"
              className="absolute bottom-8 left-8 rounded-full bg-orange/90 px-4 py-2 text-xs font-semibold text-white"
            >
              Enable sound?
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
