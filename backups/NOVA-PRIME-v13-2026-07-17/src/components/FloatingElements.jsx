import { useEffect, useRef, useCallback } from 'react'

const shapes = [
  { type: 'hexagon', x: '15%', y: '20%', size: 26, delay: 0, duration: 8 },
  { type: 'hexagon', x: '80%', y: '50%', size: 20, delay: 2, duration: 9 },
  { type: 'diamond', x: '8%', y: '70%', size: 18, delay: 1, duration: 7 },
  { type: 'diamond', x: '72%', y: '25%', size: 14, delay: 3, duration: 8 },
  { type: 'circle', x: '30%', y: '40%', size: 12, delay: 0.5, duration: 10 },
  { type: 'circle', x: '60%', y: '80%', size: 10, delay: 2.5, duration: 9 },
]

function ShapeSVG({ type, size }) {
  switch (type) {
    case 'hexagon':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.1"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" /></svg>
    case 'diamond':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.1"><polygon points="12,2 22,12 12,22 2,12" /></svg>
    case 'circle':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.08"><circle cx="12" cy="12" r="10" /></svg>
    default:
      return null
  }
}

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute text-emerald floating-shape"
          style={{
            left: shape.x,
            top: shape.y,
            animationDuration: `${shape.duration}s`,
            animationDelay: `${shape.delay}s`,
          }}
        >
          <ShapeSVG type={shape.type} size={shape.size} />
        </div>
      ))}
    </div>
  )
}
