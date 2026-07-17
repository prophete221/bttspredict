import { motion } from 'framer-motion'
import { TESTIMONIALS } from '../data/constants'
import { useScrollAnimation } from '../hooks/useAnimations'

// ─── Star Rating Component ───
function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} sur ${max} étoiles`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < rating
        return (
          <svg
            key={i}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={filled ? 0 : 1.5}
            className={filled ? 'text-gold' : 'text-edge-light'}
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      })}
    </div>
  )
}

// ─── Individual Testimonial Card ───
function TestimonialCard({ testimonial, index, isVisible }) {
  const { name, city, initials, text, rating } = testimonial

  // Alternate avatar accent colors for visual variety
  const avatarStyles = [
    'bg-emerald/15 border-emerald/25 text-emerald',
    'bg-gold/15 border-gold/25 text-gold',
    'bg-emerald/15 border-emerald/25 text-emerald-soft',
    'bg-gold/15 border-gold/25 text-gold-light',
  ]
  const avatarStyle = avatarStyles[index % avatarStyles.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{
        duration: 0.5,
        delay: 0.1 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="glass-3d rounded-xl p-5 sm:p-6 hover-lift group relative overflow-hidden"
      role="article"
      aria-label={`Témoignage de ${name}`}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote decoration */}
      <div className="absolute top-3 right-4 text-emerald/5 text-5xl font-bold leading-none select-none pointer-events-none" aria-hidden="true">
        &ldquo;
      </div>

      <div className="relative">
        {/* Header: Avatar + Name + City */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar circle with initials */}
          <div
            className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarStyle}`}
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-semibold text-sm leading-tight truncate">{name}</h4>
            <p className="text-gray-400 text-xs mt-0.5 truncate">{city}</p>
          </div>
        </div>

        {/* Star rating */}
        <div className="mb-3">
          <StarRating rating={rating} />
        </div>

        {/* Quote text */}
        <blockquote className="text-gray-300 text-sm leading-relaxed relative">
          <p>&ldquo;{text}&rdquo;</p>
        </blockquote>
      </div>
    </motion.article>
  )
}

// ─── Main Testimonials Section ───
export default function Testimonials() {
  const [ref, isVisible] = useScrollAnimation()

  return (
    <section
      ref={ref}
      id="testimonials"
      className="py-10 sm:py-16 px-4 bg-dark-800/50 relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald/3 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-gold/2 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl font-bold text-white uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}
          >
            Ils nous font <span className="text-emerald neon-glow">confiance</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
            Découvrez les retours de notre communauté de parieurs à travers l&apos;Afrique
          </p>

          {/* Accent line */}
          <div className="accent-line-emerald w-24 mx-auto mt-4" aria-hidden="true" />
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {TESTIMONIALS.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.initials}
              testimonial={testimonial}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="text-center mt-6 sm:mt-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-3d">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" aria-hidden="true" />
            <span className="text-[11px] text-gray-400">
              <span className="text-white font-semibold">15 000+</span> parieurs nous font confiance
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
