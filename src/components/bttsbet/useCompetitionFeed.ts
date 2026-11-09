'use client'

import { useEffect, useMemo, useState } from 'react'
import { readCurrentCompetitionFeed } from '@/lib/competition-pages'

export function useCompetitionFeed() {
  const [payload, setPayload] = useState<unknown>(null)
  const [now, setNow] = useState<Date | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  useEffect(() => {
    let active = true
    const controller = new AbortController()
    fetch('/predictions.json', { cache: 'no-store', signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Public feed unavailable')
        return response.json()
      })
      .then(data => {
        if (!data || typeof data !== 'object' || (!Array.isArray(data.free) && !Array.isArray(data.predictions))) throw new Error('Invalid public feed')
        if (active) { setPayload(data); setNow(new Date()); setStatus('ready') }
      })
      .catch(() => { if (active) setStatus('error') })
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => { active = false; controller.abort(); window.clearInterval(timer) }
  }, [])
  const feed = useMemo(() => readCurrentCompetitionFeed(payload, now || new Date(0)), [payload, now])
  return { ...feed, status }
}
