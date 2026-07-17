import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useAnimations'
import { HOW_IT_WORKS } from '../data/constants'

// ─── SVG Icons for each step ───
function ScanIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Brain / circuit scan icon */}
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M9 9h.01" />
      <path d="M15 9h.01" />
      <path d="M10 13a2 2 0 0 0 4 0" />
      {/* Signal waves */}
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function SelectIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Target / filter icon */}
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Trophy / checkmark icon */}
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

const STEP_ICONS = [ScanIcon, SelectIcon, TrophyIcon]

// ─── Animation Variants ───
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const lineVariants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
    },
  },
}

const verticalLineVariants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3,
    },
  },
}

// ─── Step Card ───
function StepCard({ step, index, isVisible }) {
  const IconComponent = STEP_ICONS[index]

  return (
    <motion.div
      variants={cardVariants}
      className="flex flex-col items-center text-center flex-1 min-w-0"
    >
      {/* Step number circle */}
      <div
        className="relative w-16 h-16 rounded-full flex items-center justify-center mb-4 shrink-0"
        style={{
          background: 'linear-gradient(135deg, #00D4AA, #00A888)',
          boxShadow: '0 0 24px rgba(0, 212, 170, 0.25), 0 4px 16px rgba(0, 0, 0, 0.3)',
        }}
        aria-hidden="true"
      >
        <span className="text-midnight font-extrabold text-xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
          {step.step}
        </span>
        {/* Glow ring */}
        <div className="absolute inset-0 rounded-full border border-emerald/20" />
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-emerald/8 border border-emerald/15 flex items-center justify-center mb-3 text-emerald">
        <IconComponent />
      </div>

      {/* Title */}
      <h3
        className="text-white font-bold text-base sm:text-lg mb-2"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed max-w-[260px]">
        {step.desc}
      </p>
    </motion.div>
  )
}

// ─── Main Component ───
export default function HowItWorks() {
  const [ref, isVisible] = useScrollAnimation()

  const scrollToPredictions = () => {
    const el = document.getElementById('free-predictions')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => window.scrollBy({ top: -64, behavior: 'smooth' }), 400)
    }
  }

  return (
    <section ref={ref} className="py-10 sm:py-14 px-4" aria-label="Comment ça marche">
      <div className="max-w-5xl mx-auto">
        {/* ── Section Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
          >
            COMMENT ÇA{' '}
            <span className="text-emerald neon-glow">MARCHE</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-md mx-auto">
            Trois étapes pour parier avec l&apos;intelligence artificielle
          </p>
        </motion.div>

        {/* ── Timeline Steps ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {/* Desktop: Horizontal layout */}
          <div className="hidden md:flex items-start justify-center gap-0 relative">
            {/* Step 01 */}
            <StepCard step={HOW_IT_WORKS[0]} index={0} isVisible={isVisible} />

            {/* Connector line 1-2 */}
            <div className="flex items-center self-start mt-8 w-16 lg:w-24 shrink-0">
              <motion.div
                variants={lineVariants}
                className="w-full h-px border-t border-dashed border-emerald/30"
              />
            </div>

            {/* Step 02 */}
            <StepCard step={HOW_IT_WORKS[1]} index={1} isVisible={isVisible} />

            {/* Connector line 2-3 */}
            <div className="flex items-center self-start mt-8 w-16 lg:w-24 shrink-0">
              <motion.div
                variants={lineVariants}
                className="w-full h-px border-t border-dashed border-emerald/30"
              />
            </div>

            {/* Step 03 */}
            <StepCard step={HOW_IT_WORKS[2]} index={2} isVisible={isVisible} />
          </div>

          {/* Mobile: Vertical layout */}
          <div className="md:hidden flex flex-col items-center gap-0 relative">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.step} className="flex flex-col items-center w-full">
                <StepCard step={step} index={index} isVisible={isVisible} />

                {/* Vertical connector between steps (not after last) */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <motion.div
                      variants={verticalLineVariants}
                      className="w-px h-8 border-l border-dashed border-emerald/30"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="text-center mt-10 sm:mt-14"
        >
          <button
            onClick={scrollToPredictions}
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-emerald to-emerald-dark text-midnight font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-emerald/30 btn-emerald transition-all hover:brightness-110 hover-lift"
            aria-label="Voir les pronostics du jour"
          >
            <span>Voir les pronostics du jour</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
