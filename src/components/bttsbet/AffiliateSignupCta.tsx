'use client'

import type { CSSProperties, ReactNode } from 'react'
import { trackAffiliateAction } from '@/lib/affiliateTracking'

export default function AffiliateSignupCta({
  href,
  partner,
  placement,
  children,
  className,
  style,
}: {
  href: string
  partner: 'linebet' | '888starz'
  placement: string
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      className={className}
      style={style}
      onClick={() => trackAffiliateAction(partner, 'signup', placement)}
    >
      {children}
    </a>
  )
}
