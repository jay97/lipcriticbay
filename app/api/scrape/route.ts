import { NextResponse } from 'next/server'
import { writeCache } from '@/lib/scrape-cache'
import { scrapeAll } from '@/lib/tracker-scrape'
import { getTorrents } from '@/lib/data'

export async function POST() {
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

    return NextResponse.json({
      success: true,
      scraped: Object.keys(peers).length,
      peers,
    })
  } catch (e) {
    return NextResponse.json(
      { success: false, error: String(e) },
      { status: 500 }
    )
  }
}
