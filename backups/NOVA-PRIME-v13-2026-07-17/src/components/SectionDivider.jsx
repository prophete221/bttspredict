export default function SectionDivider({ type = 'wave', flip = false, color = '#0B1020' }) {
  const variants = {
    wave: (
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[60px]">
        <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill={color} fillOpacity="0.6" />
        <path d="M0 50C240 80 480 20 720 50C960 80 1200 20 1440 50V80H0V50Z" fill={color} />
      </svg>
    ),
    mountain: (
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[60px]">
        <path d="M0 80L120 40L240 60L360 20L480 50L600 10L720 45L840 15L960 55L1080 25L1200 50L1320 30L1440 60V80H0Z" fill={color} fillOpacity="0.5" />
        <path d="M0 80L100 55L240 65L400 35L560 58L700 28L860 55L1000 38L1160 60L1300 42L1440 68V80H0Z" fill={color} />
      </svg>
    ),
    curve: (
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[30px] sm:h-[50px]">
        <path d="M0 30C360 0 720 60 1080 30C1260 15 1350 20 1440 30V60H0V30Z" fill={color} />
      </svg>
    ),
  }

  return (
    <div
      className={`section-divider ${flip ? 'rotate-180' : ''}`}
      style={{ lineHeight: 0, overflow: 'hidden' }}
    >
      {variants[type] || variants.wave}
    </div>
  )
}
