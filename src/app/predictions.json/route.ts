import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-static'

export function GET() {
  try {
    const predictionsPath = path.join(process.cwd(), 'public', 'predictions.json')
    const rawData = fs.readFileSync(predictionsPath, 'utf8')
    const data = JSON.parse(rawData)

    // v91: return the FULL structure so the client gets free[] and vipPreview[] arrays
    const response = {
      date: data.date || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      source: 'ESPN + TheSportsDB',
      disclaimer: 'Prédictions informatives, pas de gain garanti, 18+',
      free: data.free || [],
      vipPreview: data.vipPreview || [],
      stats: data.stats || {},
      // Backward compat: predictions = free
      predictions: data.free || data.predictions || [],
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        'Content-Type': 'application/json',
      },
    })
  } catch {
    return NextResponse.json(
      {
        date: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString(),
        source: 'ESPN + TheSportsDB',
        disclaimer: 'Prédictions informatives, pas de gain garanti, 18+',
        free: [],
        vipPreview: [],
        stats: {},
        predictions: [],
        status: 'no data yet',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
