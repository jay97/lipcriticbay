import { NextResponse } from 'next/server'

export async function POST() {
  // UDP tracker scraping requires a full Node.js runtime (dgram).
  // Not available on serverless platforms like Vercel.
  return NextResponse.json(
    { success: false, error: 'Tracker scraping requires a Node.js VPS (UDP not available in serverless)' },
    { status: 501 }
  )
}
