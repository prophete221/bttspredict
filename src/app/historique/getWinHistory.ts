import fs from 'fs'
import path from 'path'

export function getWinHistory() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'win-history.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}
