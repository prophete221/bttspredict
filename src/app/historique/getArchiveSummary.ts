import fs from 'fs'
import path from 'path'
import { extractArchiveSummary, type ArchiveSummary } from '@/lib/archive-summary'

/** Read the original archive rollup without changing any historical source file. */
export function getArchiveSummary(): ArchiveSummary | null {
  try {
    const source = fs.readFileSync(path.join(process.cwd(), 'public', 'win-history.json'), 'utf8')
    return extractArchiveSummary(JSON.parse(source))
  } catch {
    return null
  }
}
