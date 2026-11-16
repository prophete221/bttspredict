import { NextResponse } from 'next/server'
import { getWinHistory } from '../historique/getWinHistory'

export const dynamic = 'force-static'

export function GET() {
  const history = getWinHistory()
  if (!history || history.geminiOnly !== true) {
    return NextResponse.json(
      { status: 'unavailable', geminiOnly: false, history: [], stats: {} },
      { status: 503 },
    )
  }
  return NextResponse.json(history, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800' },
  })
}
