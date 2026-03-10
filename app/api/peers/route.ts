import { NextResponse } from 'next/server'
import { getTorrents } from '@/lib/data'

export async function GET(request: Request) {
  // On serverless (Vercel), UDP scraping isn't available.
  // Return empty peers — PeerCounts component will show 0/0 gracefully.
  const url = new URL(request.url)
  const rawHashes = url.searchParams.get('hashes')
  const allowedHashes = rawHashes
    ? new Set(
        rawHashes
          .split(',')
          .map(hash => hash.trim().toLowerCase())
          .filter(hash => /^[a-f0-9]{40}$/.test(hash))
      )
    : null

  const torrents = getTorrents()
  const peers: Record<string, { se: number; le: number }> = {}
  for (const t of torrents) {
    const lowerHash = t.hash.toLowerCase()
    if (!allowedHashes || allowedHashes.has(lowerHash)) {
      peers[lowerHash] = { se: 0, le: 0 }
    }
  }

  return NextResponse.json(
    { peers, serverless: true },
    { headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' } }
  )
}
