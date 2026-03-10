import { NextResponse } from 'next/server'
import { getCachedPeers, isCacheStale, writeCache } from '@/lib/scrape-cache'
import { scrapeAll } from '@/lib/tracker-scrape'
import { getTorrents } from '@/lib/data'

// Prevent concurrent scrapes
let scraping = false

export async function GET() {
  const peers = getCachedPeers()

  // Trigger background scrape if cache is stale
  if (isCacheStale() && !scraping) {
    scraping = true
    // Fire and forget - don't await
    doScrape().finally(() => { scraping = false })
  }

  return NextResponse.json({ peers, stale: isCacheStale() })
}

async function doScrape() {
  try {
    const torrents = getTorrents()
    const results = await scrapeAll(
      torrents.map(t => ({ hash: t.hash, trackers: t.trackers }))
    )

    const peers: Record<string, { se: number; le: number }> = {}
    for (const [hash, data] of results) {
      peers[hash] = data
    }

    writeCache(peers)
  } catch {
    // Scrape failure is non-fatal
  }
}
