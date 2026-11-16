import predictions from '../../public/predictions.json'
import { readCurrentCompetitionFeed, type CompetitionFeedSnapshot } from './competition-pages'

/** Build-time view of the public Gemini/ESPN feed; client components revalidate it after hydration. */
export function getInitialCompetitionFeed(now = new Date()): CompetitionFeedSnapshot {
  return readCurrentCompetitionFeed(predictions, now)
}

export function getInitialCompetitionPageFeed(slug: string, now = new Date()): CompetitionFeedSnapshot {
  const feed = getInitialCompetitionFeed(now)
  return {
    lastUpdated: feed.lastUpdated,
    matches: { [slug]: feed.matches[slug] || [] },
  }
}
