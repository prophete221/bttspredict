'use client'

import { useState } from 'react'
import { copyTextToClipboard } from '@/lib/clipboard'
import type { Locale } from '@/lib/i18n'

type ShareAnalysisButtonProps = {
  home: string
  away: string
  league: string
  date: string
  time: string
  bttsProbability: string
  over25Probability: string
  exactScore?: string
  exactScoreProbability?: string
  path: string
  locale: Locale
}

export default function ShareAnalysisButton(props: ShareAnalysisButtonProps) {
  const [status, setStatus] = useState<'idle' | 'shared' | 'copied' | 'error'>('idle')
  const labels = props.locale === 'en'
    ? { share: 'Share analysis', shared: 'Shared', copied: 'Copied', error: 'Could not share' }
    : props.locale === 'ar'
      ? { share: 'مشاركة التحليل', shared: 'تمت المشاركة', copied: 'تم النسخ', error: 'تعذّرت المشاركة' }
      : { share: 'Partager l’analyse', shared: 'Partagé', copied: 'Copié', error: 'Partage impossible' }

  const handleShare = async () => {
    const url = `${window.location.origin}${props.path}`
    const metrics = props.locale === 'en'
      ? [`BTTS probability: ${props.bttsProbability}`, `Over 2.5 probability: ${props.over25Probability}`]
      : props.locale === 'ar'
        ? [`احتمال BTTS: ${props.bttsProbability}`, `احتمال Over 2.5: ${props.over25Probability}`]
        : [`Probabilité BTTS : ${props.bttsProbability}`, `Probabilité Over 2,5 : ${props.over25Probability}`]
    const score = props.exactScore
      ? `${props.locale === 'en' ? 'Projected exact score' : props.locale === 'ar' ? 'النتيجة الدقيقة المتوقعة' : 'Score exact proposé'}: ${props.exactScore}${props.exactScoreProbability ? ` (${props.exactScoreProbability})` : ''}`
      : ''
    const disclaimer = props.locale === 'en'
      ? 'Statistical analysis only. No result is guaranteed. 18+.'
      : props.locale === 'ar'
        ? 'تحليل إحصائي فقط. لا توجد نتيجة مضمونة. 18+.'
        : 'Analyse statistique uniquement. Aucun résultat n’est garanti. 18+.'
    const text = [
      `${props.home} vs ${props.away} — BTTSPredict`,
      `${props.league} · ${props.date} · ${props.time} GMT`,
      ...metrics,
      score,
      disclaimer,
      url,
    ].filter(Boolean).join('\n')

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `${props.home} vs ${props.away} — BTTSPredict`, text, url })
        setStatus('shared')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }

    const copied = await copyTextToClipboard(text)
    setStatus(copied ? 'copied' : 'error')
  }

  const statusLabel = status === 'shared' ? labels.shared : status === 'copied' ? labels.copied : status === 'error' ? labels.error : labels.share

  return (
    <button
      type="button"
      onClick={handleShare}
      className="btx-share-button"
      aria-label={labels.share}
      title={statusLabel}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.7" y1="10.7" x2="15.3" y2="6.3" />
        <line x1="8.7" y1="13.3" x2="15.3" y2="17.7" />
      </svg>
      <span>{statusLabel}</span>
      <span className="sr-only" aria-live="polite">{statusLabel}</span>
    </button>
  )
}
