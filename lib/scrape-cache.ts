import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import type { ScrapeCache, PeerData } from './types'

const CACHE_DIR = join(process.cwd(), 'data', 'cache')
const CACHE_FILE = join(CACHE_DIR, 'scrape-cache.json')
const CACHE_MAX_AGE_MS = 5 * 60 * 1000 // 5 minutes

export function readCache(): ScrapeCache | null {
  try {
    if (!existsSync(CACHE_FILE)) return null
    const raw = readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeCache(peers: PeerData): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true })
  }
  const cache: ScrapeCache = {
    lastScrape: new Date().toISOString(),
    peers,
  }
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
}

export function isCacheStale(): boolean {
  const cache = readCache()
  if (!cache) return true
  const age = Date.now() - new Date(cache.lastScrape).getTime()
  return age > CACHE_MAX_AGE_MS
}

export function getCachedPeers(): PeerData {
  const cache = readCache()
  return cache?.peers ?? {}
}
