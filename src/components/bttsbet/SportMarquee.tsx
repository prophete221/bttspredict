'use client'

/**
 * SportMarquee — Infinite horizontal scrolling marquee of sport icons
 * Pure CSS animation (no JS library needed — lightweight, 60fps)
 * Sports: Football, NBA, Tennis, NFL, UFC, FIFA E-sports
 */
const SPORTS = [
  { name: 'Football', icon: '/logos/sport-football.svg' },
  { name: 'NBA', icon: '/logos/sport-nba.svg' },
  { name: 'Tennis', icon: '/logos/sport-tennis.svg' },
  { name: 'NFL', icon: '/logos/sport-nfl.svg' },
  { name: 'UFC', icon: '/logos/sport-ufc.svg' },
  { name: 'FIFA', icon: '/logos/sport-handball.svg' }, // reuse available logo
]

export default function SportMarquee() {
  // Duplicate the list for seamless infinite scroll
  const items = [...SPORTS, ...SPORTS]

  return (
    <div className="relative overflow-hidden py-3 border-y" style={{ borderColor: 'rgba(165, 171, 197, 0.3)', backgroundColor: 'rgba(7, 17, 26, 0.5)' }}>
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10 w-16 sm:w-24 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #131314, transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 z-10 w-16 sm:w-24 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #131314, transparent)' }}
      />

      {/* Scrolling track */}
      <div
        className="flex items-center gap-8 sm:gap-12 whitespace-nowrap"
        style={{
          animation: 'marquee-scroll 30s linear infinite',
        }}
      >
        {items.map((sport, i) => (
          <div
            key={i}
            className="flex items-center gap-2 flex-shrink-0 transition-all duration-300 cursor-default group"
          >
            <img
              src={sport.icon}
              alt={sport.name}
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain transition-all duration-300 group-hover:scale-110"
              style={{
                filter: 'grayscale(1) brightness(0.7)',
                opacity: 0.6,
              }}
              loading="lazy"
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'grayscale(0) brightness(1)'
                e.currentTarget.style.opacity = '1'
                ;(e.currentTarget.style as any).dropShadow = '0 0 12px rgba(199, 244, 100, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'grayscale(1) brightness(0.7)'
                e.currentTarget.style.opacity = '0.6'
              }}
            />
            <span
              className="text-xs sm:text-sm font-semibold transition-colors duration-300"
              style={{ color: '#9ca3af' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#22c55e' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#9ca3af' }}
            >
              {sport.name}
            </span>
          </div>
        ))}
      </div>

      {/* Keyframes injected inline for portability */}
      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
