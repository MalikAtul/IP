import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import { config } from '../../config'
import SpeechBubble from './SpeechBubble'

export type MascotPose =
  | 'idle'
  | 'wave'
  | 'point-right'
  | 'point-left'
  | 'point-up'
  | 'thinking'
  | 'celebrate'
  | 'dance'
  | 'run'
  | 'sit-type'
  | 'sit-chill'
  | 'explain'
  | 'mind-blown'
  | 'thumbs-up'
  | 'facepalm'
  | 'superhero-landing'

type Expr = 'smile' | 'grin' | 'open' | 'flat' | 'shock' | 'happy' | 'cool'
type Hand = 'open' | 'point' | 'thumb' | 'fist'

interface PoseSpec {
  armL: number
  armR: number
  legL: number
  legR: number
  headRot: number
  bodyY: number
  bodyRot: number
  expr: Expr
  handR: Hand
}

// Arm/leg rotations in degrees (CSS clockwise; limbs are drawn hanging down).
const POSES: Record<MascotPose, PoseSpec> = {
  idle: { armL: 0, armR: 0, legL: 0, legR: 0, headRot: 0, bodyY: 0, bodyRot: 0, expr: 'smile', handR: 'open' },
  wave: { armL: 4, armR: -140, legL: 0, legR: 0, headRot: -5, bodyY: 0, bodyRot: 0, expr: 'grin', handR: 'open' },
  'point-right': { armL: 4, armR: -92, legL: 0, legR: 0, headRot: -8, bodyY: 0, bodyRot: 0, expr: 'grin', handR: 'point' },
  'point-left': { armL: 92, armR: -4, legL: 0, legR: 0, headRot: 8, bodyY: 0, bodyRot: 0, expr: 'grin', handR: 'open' },
  'point-up': { armL: 4, armR: -172, legL: 0, legR: 0, headRot: -5, bodyY: 0, bodyRot: 0, expr: 'grin', handR: 'point' },
  thinking: { armL: 6, armR: 152, legL: 0, legR: 0, headRot: 7, bodyY: 0, bodyRot: 0, expr: 'flat', handR: 'fist' },
  celebrate: { armL: 145, armR: -145, legL: 6, legR: -6, headRot: 0, bodyY: -8, bodyRot: 0, expr: 'happy', handR: 'open' },
  dance: { armL: 150, armR: -60, legL: 16, legR: -14, headRot: 8, bodyY: -2, bodyRot: 6, expr: 'grin', handR: 'open' },
  run: { armL: 46, armR: -52, legL: 34, legR: -30, headRot: 4, bodyY: 0, bodyRot: 8, expr: 'grin', handR: 'fist' },
  'sit-type': { armL: -22, armR: 22, legL: 88, legR: 86, headRot: 6, bodyY: 44, bodyRot: 0, expr: 'flat', handR: 'open' },
  'sit-chill': { armL: -14, armR: 12, legL: 84, legR: 76, headRot: -6, bodyY: 40, bodyRot: -4, expr: 'cool', handR: 'open' },
  explain: { armL: 10, armR: -56, legL: 0, legR: 0, headRot: -4, bodyY: 0, bodyRot: 0, expr: 'smile', handR: 'open' },
  'mind-blown': { armL: 148, armR: -148, legL: 4, legR: -4, headRot: -6, bodyY: -4, bodyRot: 0, expr: 'shock', handR: 'open' },
  'thumbs-up': { armL: 6, armR: -150, legL: 0, legR: 0, headRot: -4, bodyY: 0, bodyRot: 0, expr: 'grin', handR: 'thumb' },
  facepalm: { armL: 6, armR: 150, legL: 0, legR: 0, headRot: 9, bodyY: 0, bodyRot: 0, expr: 'flat', handR: 'open' },
  'superhero-landing': { armL: 30, armR: -120, legL: 54, legR: -34, headRot: -4, bodyY: 32, bodyRot: 0, expr: 'cool', handR: 'fist' },
}

const HOVER_POSES: MascotPose[] = ['dance', 'celebrate', 'wave', 'mind-blown', 'thumbs-up']

// --- palette ---
const SKIN = '#C0844F'
const SKIN_DK = '#A66C3B'
const HAIR = '#171012'
const HOODIE = '#2C2C33'
const HOODIE_DK = '#212127'
const TEE = '#FF6B1A'
const PANTS = '#3A3A44'
const SHOE = '#0F0F10'
const STROKE = '#141414'

const EASE = 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'

/** CSS transform helper that rotates around a joint in SVG view-box space. */
function pivot(deg: number, x: number, y: number, transition = EASE): CSSProperties {
  return {
    transform: `rotate(${deg}deg)`,
    transformBox: 'view-box',
    transformOrigin: `${x}px ${y}px`,
    transition,
  }
}

interface FaceProps {
  expr: Expr
  blink: boolean
  pupil: { x: number; y: number }
}

function Face({ expr, blink, pupil }: FaceProps) {
  const closed = expr === 'happy'
  const eyeScaleY = blink ? 0.12 : 1
  const browY = expr === 'shock' ? -5 : expr === 'flat' ? 1 : 0
  const eyeStyle = (x: number, y: number): CSSProperties => ({
    transform: `scaleY(${eyeScaleY})`,
    transformBox: 'view-box',
    transformOrigin: `${x}px ${y}px`,
    transition: 'transform 0.09s ease',
  })
  const mouth: Record<Expr, JSX.Element> = {
    smile: <path d="M96 96 Q110 107 124 96" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />,
    grin: <path d="M94 95 Q110 115 126 95 Q110 104 94 95 Z" fill="#5A2A1E" stroke={STROKE} strokeWidth={2} />,
    open: <ellipse cx={110} cy={100} rx={6} ry={8} fill="#5A2A1E" stroke={STROKE} strokeWidth={2} />,
    flat: <path d="M99 100 L121 100" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />,
    shock: <ellipse cx={110} cy={102} rx={8} ry={11} fill="#5A2A1E" stroke={STROKE} strokeWidth={2} />,
    happy: <path d="M96 97 Q110 108 124 97" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />,
    cool: <path d="M99 99 Q113 105 123 96" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />,
  }
  return (
    <g>
      <g transform={`translate(0 ${browY})`}>
        <path
          d={expr === 'cool' ? 'M88 60 L104 57' : 'M89 59 L103 59'}
          stroke={STROKE}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path d="M117 59 L131 59" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
      </g>
      {closed ? (
        <>
          <path d="M90 74 Q96 68 102 74" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
          <path d="M118 74 Q124 68 130 74" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <g style={eyeStyle(96, 74)}>
            <ellipse cx={96} cy={74} rx={6.5} ry={7.5} fill="#fff" stroke={STROKE} strokeWidth={1.6} />
            <circle cx={96 + pupil.x} cy={74 + pupil.y} r={3.4} fill={STROKE} />
          </g>
          <g style={eyeStyle(124, 74)}>
            <ellipse cx={124} cy={74} rx={6.5} ry={7.5} fill="#fff" stroke={STROKE} strokeWidth={1.6} />
            <circle cx={124 + pupil.x} cy={74 + pupil.y} r={3.4} fill={STROKE} />
          </g>
        </>
      )}
      <path d="M110 78 Q108 86 112 87" fill="none" stroke={SKIN_DK} strokeWidth={2} strokeLinecap="round" />
      {mouth[expr]}
    </g>
  )
}

function RightHand({ kind }: { kind: Hand }) {
  switch (kind) {
    case 'point':
      return (
        <g>
          <circle cx={146} cy={202} r={7} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
          <rect x={150} y={199} width={12} height={5} rx={2.5} fill={SKIN} stroke={STROKE} strokeWidth={1.4} />
        </g>
      )
    case 'thumb':
      return (
        <g>
          <circle cx={146} cy={202} r={7.5} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
          <rect x={143} y={189} width={5} height={11} rx={2.5} fill={SKIN} stroke={STROKE} strokeWidth={1.4} />
        </g>
      )
    case 'fist':
      return <circle cx={146} cy={202} r={8} fill={SKIN} stroke={STROKE} strokeWidth={1.8} />
    default:
      return <circle cx={146} cy={202} r={7} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
  }
}

export interface MascotCharacterProps {
  pose?: MascotPose
  className?: string
  size?: number
  followCursor?: boolean
  interactive?: boolean
  flip?: boolean
}

export default function MascotCharacter({
  pose = 'idle',
  className = '',
  size = 150,
  followCursor = false,
  interactive = true,
  flip = false,
}: MascotCharacterProps) {
  const reduce = useReducedMotion()
  const svgRef = useRef<SVGSVGElement>(null)
  const [blink, setBlink] = useState(false)
  const [pupil, setPupil] = useState({ x: 0, y: 0 })
  const [headExtra, setHeadExtra] = useState(0)
  const [hoverPose, setHoverPose] = useState<MascotPose | null>(null)
  const [bubble, setBubble] = useState<string | null>(null)
  const bubbleTimer = useRef<number | undefined>(undefined)
  const hoverTimer = useRef<number | undefined>(undefined)

  const spec = POSES[hoverPose ?? pose]

  useEffect(() => {
    if (reduce) return
    let t: number
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true)
        window.setTimeout(() => setBlink(false), 120)
        loop()
      }, 2600 + Math.random() * 2600)
    }
    loop()
    return () => window.clearTimeout(t)
  }, [reduce])

  useEffect(() => {
    if (reduce || followCursor) return
    const t = window.setInterval(() => {
      setPupil({ x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 3 })
    }, 2200)
    return () => window.clearInterval(t)
  }, [reduce, followCursor])

  useEffect(() => {
    if (!followCursor || reduce) return
    const onMove = (e: PointerEvent) => {
      const el = svgRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth / 2)))
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight / 2)))
      setPupil({ x: nx * 3, y: ny * 2.5 })
      setHeadExtra(nx * 7)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [followCursor, reduce])

  const onEnter = useCallback(() => {
    if (!interactive || reduce) return
    const p = HOVER_POSES[Math.floor(Math.random() * HOVER_POSES.length)]
    setHoverPose(p)
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setHoverPose(null), 1300)
  }, [interactive, reduce])

  const onClickMascot = useCallback(() => {
    if (!interactive) return
    const quips = config.mascotQuips
    setBubble(quips[Math.floor(Math.random() * quips.length)])
    if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 2500)
  }, [interactive])

  useEffect(
    () => () => {
      if (bubbleTimer.current) window.clearTimeout(bubbleTimer.current)
      if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    },
    [],
  )

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size * 1.4 }}
      onMouseEnter={onEnter}
      onClick={onClickMascot}
      data-cursor="hover"
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'Mascot guide — click for a quip' : 'Mascot guide'}
    >
      <SpeechBubble text={bubble} />
      <svg
        ref={svgRef}
        viewBox="0 0 220 340"
        width={size}
        height={size * 1.4}
        style={{ transform: flip ? 'scaleX(-1)' : undefined, overflow: 'visible' }}
      >
        <ellipse cx={110} cy={324} rx={54} ry={9} fill="rgba(15,15,16,0.14)" />

        {/* body offset (jump / sit) */}
        <g
          style={{
            transform: `translateY(${spec.bodyY}px) rotate(${spec.bodyRot}deg)`,
            transformBox: 'view-box',
            transformOrigin: '110px 240px',
            transition: EASE,
          }}
        >
          {/* breathing wrapper */}
          <g className={reduce ? undefined : 'mascot-breathe'}>
            {/* ---- legs ---- */}
            <g style={pivot(spec.legL, 95, 210)}>
              <path d="M95 210 L93 262 L92 300" fill="none" stroke={PANTS} strokeWidth={16} strokeLinecap="round" />
              <path d="M84 302 q-2 8 8 8 l10 0 q4 0 3 -6" fill={SHOE} stroke={STROKE} strokeWidth={1.6} />
              <path d="M84 309 l19 0" stroke={TEE} strokeWidth={2.4} strokeLinecap="round" />
            </g>
            <g style={pivot(spec.legR, 125, 210)}>
              <path d="M125 210 L127 262 L128 300" fill="none" stroke={PANTS} strokeWidth={16} strokeLinecap="round" />
              <path d="M118 302 q-1 8 8 8 l10 0 q5 0 4 -6" fill={SHOE} stroke={STROKE} strokeWidth={1.6} />
              <path d="M118 309 l19 0" stroke={TEE} strokeWidth={2.4} strokeLinecap="round" />
            </g>

            {/* ---- torso: hoodie over an orange tee ---- */}
            <path d="M74 132 Q110 120 146 132 L150 205 Q110 216 70 205 Z" fill={HOODIE} stroke={STROKE} strokeWidth={2} />
            <path d="M99 124 L110 150 L121 124 Q110 132 99 124 Z" fill={TEE} stroke={STROKE} strokeWidth={1.4} />
            <path d="M110 150 L110 202" stroke={HOODIE_DK} strokeWidth={3} strokeLinecap="round" />
            <path d="M86 178 Q110 190 134 178" fill="none" stroke={HOODIE_DK} strokeWidth={2.4} />

            {/* ---- arms ---- */}
            <g style={pivot(spec.armL, 78, 132)}>
              <path d="M78 132 L75 170" fill="none" stroke={HOODIE} strokeWidth={15} strokeLinecap="round" />
              <path d="M75 170 L74 198" fill="none" stroke={SKIN} strokeWidth={12} strokeLinecap="round" />
              <circle cx={74} cy={202} r={7} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
            </g>
            <g style={pivot(spec.armR, 142, 132)}>
              <path d="M142 132 L145 170" fill="none" stroke={HOODIE} strokeWidth={15} strokeLinecap="round" />
              <path d="M145 170 L146 198" fill="none" stroke={SKIN} strokeWidth={12} strokeLinecap="round" />
              <RightHand kind={spec.handR} />
            </g>

            {/* ---- head ---- */}
            <g
              style={{
                transform: `rotate(${spec.headRot + headExtra}deg)`,
                transformBox: 'view-box',
                transformOrigin: '110px 116px',
                transition: EASE,
              }}
            >
              <path d="M104 108 L104 122 L116 122 L116 108 Z" fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
              <ellipse cx={110} cy={76} rx={36} ry={38} fill={SKIN} stroke={STROKE} strokeWidth={2} />
              <circle cx={74} cy={80} r={6} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
              <circle cx={146} cy={80} r={6} fill={SKIN} stroke={STROKE} strokeWidth={1.6} />
              <g fill={HAIR} stroke={STROKE} strokeWidth={1.2}>
                <path d="M74 62 Q68 30 100 34 Q110 22 130 34 Q158 32 150 64 Q150 46 132 44 Q120 36 108 44 Q92 38 84 50 Q76 52 74 62 Z" />
                <circle cx={80} cy={54} r={9} />
                <circle cx={95} cy={44} r={10} />
                <circle cx={112} cy={40} r={11} />
                <circle cx={129} cy={45} r={10} />
                <circle cx={142} cy={56} r={9} />
              </g>
              <Face expr={spec.expr} blink={blink} pupil={pupil} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
