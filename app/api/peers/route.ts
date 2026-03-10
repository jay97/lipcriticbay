import { NextResponse } from 'next/server'
import { getTorrents } from '@/lib/data'

export async function GET() {
  // On serverless (Vercel), UDP scraping isn't available.
  // Return empty peers — PeerCounts component will show 0/0 gracefully.
  const torrents = getTorrents()
  const peers: Record<string, { se: number; le: number }> = {}
  for (const t of torrents) {
    peers[t.hash] = { se: 0, le: 0 }
  }

  return NextResponse.json({ peers, serverless: true })
}
