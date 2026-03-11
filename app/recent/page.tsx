import { getTorrents } from '@/lib/data'
import RecentResults from '@/components/RecentResults'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recent Torrents',
  description: 'Latest Lip Critic music uploads. New FLAC, WAV, and MP3 torrents.',
}

export default function RecentPage() {
  const allTorrents = getTorrents()

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <RecentResults torrents={allTorrents} />
      </Suspense>
      <PeerCounts />
    </>
  )
}
