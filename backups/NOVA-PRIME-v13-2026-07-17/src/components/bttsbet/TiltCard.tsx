'use client'

import { useEffect, useRef, useCallback } from 'react'

export default function TiltCard({ children, className = '', maxTilt = 6, glareEnabled = true }: {
  children: React.ReactNode
  className?: string
  maxTilt?: number
  glareEnabled?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -maxTilt
      const rotateY = ((x - centerX) / centerX) * maxTilt

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
      
      const glare = cardRef.current.querySelector('.tilt-card-glare') as HTMLElement | null
      if (glare && glareEnabled) {
        glare.style.opacity = '0.12'
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(56, 189, 248, 0.2), transparent 60%)`
      }
      rafRef.current = null
    })
  }, [maxTilt, glareEnabled])

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    cardRef.current.style.transition = 'transform 0.5s ease-out'
    const glare = cardRef.current.querySelector('.tilt-card-glare') as HTMLElement | null
    if (glare) glare.style.opacity = '0'
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) cardRef.current.style.transition = 'transform 0.1s ease-out'
  }, [])

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: 'transform 0.5s ease-out',
      }}
    >
      {children}
      {glareEnabled && (
        <div
          className="tilt-card-glare"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            opacity: 0,
            zIndex: 1,
          }}
        />
      )}
    </div>
  )
}
