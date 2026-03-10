import type { Torrent } from './types'

export type SortField = 'relevance' | 'date' | 'size' | 'seeders' | 'leechers' | 'name'
export type SortOrder = 'asc' | 'desc'

function scoreMatch(torrent: Torrent, query: string): number {
  const name = torrent.name.toLowerCase()
  const q = query.toLowerCase().trim()
  const words = q.split(/\s+/).filter(Boolean)

  if (words.length === 0) return 0

  let score = 0

  // Exact full query match
  if (name.includes(q)) score += 50

  // Per-word matching
  for (const word of words) {
    if (name.includes(word)) score += 10
    if (name.startsWith(word)) score += 5
  }

  // Recency bonus (up to 10 points for last 30 days)
  const age = Date.now() - new Date(torrent.date).getTime()
  score += Math.max(0, 10 - age / (86400000 * 30))

  return score
}

export function searchTorrents(
  torrents: Torrent[],
  query: string,
  catId?: number,
  sort: SortField = 'relevance',
  order: SortOrder = 'desc'
): Torrent[] {
  let results = [...torrents]

  // Category filter
  if (catId && catId > 0) {
    if (catId % 100 === 0) {
      const min = catId
      const max = catId + 99
      results = results.filter(t => t.catId >= min && t.catId <= max)
    } else {
      results = results.filter(t => t.catId === catId)
    }
  }

  // Text search
  if (query && query.trim()) {
    const scored = results.map(t => ({ torrent: t, score: scoreMatch(t, query) }))
    results = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(s => s.torrent)
  }

  // Sort
  if (sort !== 'relevance' || !query) {
    const dir = order === 'desc' ? -1 : 1
    results.sort((a, b) => {
      switch (sort) {
        case 'date':
          return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
        case 'size':
          return dir * (a.sizeBytes - b.sizeBytes)
        case 'seeders':
          return dir * (a.se - b.se)
        case 'leechers':
          return dir * (a.le - b.le)
        case 'name':
          return dir * a.name.localeCompare(b.name)
        default:
          return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
      }
    })
  }

  return results
}

export function isInfoHash(query: string): boolean {
  return /^[a-fA-F0-9]{40}$/.test(query.trim())
}
