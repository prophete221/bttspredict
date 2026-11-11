'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveTeamLogoSrc } from '@/lib/teamLogoOverrides'

export { resolveTeamLogoSrc } from '@/lib/teamLogoOverrides'

type ImageState = { src: string; status: 'loaded' | 'error' }

export default function TeamLogo({ src, name }: { src?: string; name: string }) {
  const logoSrc = resolveTeamLogoSrc(src)
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageState, setImageState] = useState<ImageState | null>(null)
  const status = !logoSrc
    ? 'error'
    : imageState?.src === logoSrc
      ? imageState.status
      : 'loading'
  const isLoaded = status === 'loaded'
  const canTryImage = Boolean(logoSrc) && status !== 'error'
  const initial = (name || '?').trim().slice(0, 3).toUpperCase() || '?'

  useEffect(() => {
    const image = imageRef.current
    if (!logoSrc || !image) return

    let frame: number | undefined
    let timer: number | undefined
    const inspectImage = () => {
      const currentImage = imageRef.current
      if (!currentImage) return false
      if (currentImage.naturalWidth > 0) {
        setImageState({ src: logoSrc, status: 'loaded' })
        return true
      }
      return false
    }

    const checkImageAfterHydration = () => {
      const currentImage = imageRef.current
      if (!currentImage || inspectImage()) return

      // A request can start or finish during hydration before React attaches onLoad.
      let checksRemaining = 20
      timer = window.setInterval(() => {
        const activeImage = imageRef.current
        if (inspectImage() || !activeImage || --checksRemaining <= 0) {
          if (timer !== undefined) window.clearInterval(timer)
        }
      }, 100)
    }

    if (typeof window.requestAnimationFrame === 'function') {
      frame = window.requestAnimationFrame(checkImageAfterHydration)
    } else {
      timer = window.setTimeout(checkImageAfterHydration, 0)
    }

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      if (timer !== undefined) {
        window.clearInterval(timer)
        window.clearTimeout(timer)
      }
    }
  }, [logoSrc])

  return (
    <div className="btx-team__logo" aria-label={name} title={name}>
      {canTryImage && logoSrc && (
        <img
          key={logoSrc}
          ref={imageRef}
          src={logoSrc}
          alt={`${name} logo`}
          loading="lazy"
          decoding="async"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 120ms ease' }}
          onLoad={() => setImageState({ src: logoSrc, status: 'loaded' })}
          onError={() => setImageState({ src: logoSrc, status: 'error' })}
        />
      )}
      {!isLoaded && (
        <span
          data-testid="team-logo-fallback"
          aria-hidden="true"
          style={{
            fontSize: '0.72rem',
            fontWeight: 900,
            color: '#34D399',
            letterSpacing: '0.02em',
          }}
        >
          {initial}
        </span>
      )}
    </div>
  )
}
