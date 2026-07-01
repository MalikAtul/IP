import { motion, useReducedMotion, type Variants } from 'framer-motion'

type Tag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4'

// Create the motion-enabled tags once, at module scope, to avoid remounting.
const MOTION_TAGS = {
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
} as const

interface SplitTextProps {
  text: string
  className?: string
  as?: Tag
  delay?: number
  stagger?: number
  once?: boolean
}

/**
 * Splits `text` into words and reveals them with a staggered mask-up motion
 * when scrolled into view. Honours prefers-reduced-motion (renders plainly).
 */
export default function SplitText({
  text,
  className = '',
  as = 'span',
  delay = 0,
  stagger = 0.045,
  once = true,
}: SplitTextProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = MOTION_TAGS[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{text}</Tag>
  }

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }
  const child: Variants = {
    hidden: { y: '110%' },
    visible: {
      y: '0%',
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-10% 0px -10% 0px' }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
        >
          <motion.span className="inline-block will-change-transform" variants={child}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
