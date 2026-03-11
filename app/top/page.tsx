import { getTorrents } from '@/lib/data'
import TorrentTable from '@/components/TorrentTable'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Torrents',
  description: 'Top 100 most popular Lip Critic torrents by total peers.',
}

export default function TopPage() {
  const allTorrents = getTorrents()

  const sorted = [...allTorrents]
    .sort((a, b) => (b.se + b.le) - (a.se + a.le))
    .slice(0, 100)

  return (
    <>
      <Header />
      <div style={{ maxWidth: 999, margin: '0 auto', textAlign: 'left' }}>
        <h2><b>Top 100: All torrents</b></h2>

        <TorrentTable
          torrents={sorted}
          baseUrl="/top"
        />
      </div>
      <PeerCounts />
    </>
  )
}
