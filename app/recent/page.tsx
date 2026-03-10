import { getTorrents } from '@/lib/data'
import TorrentTable from '@/components/TorrentTable'
import Pagination from '@/components/Pagination'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recent Torrents',
  description: 'Latest Lip Critic music uploads. New FLAC, WAV, and MP3 torrents.',
}

const PER_PAGE = 35

export default function RecentPage({
  searchParams,
}: {
  searchParams: { page?: string; sort?: string; order?: string }
}) {
  const page = parseInt(searchParams.page || '1') || 1
  const sort = searchParams.sort || 'date'
  const order = searchParams.order || 'desc'

  const allTorrents = getTorrents()

  // Sort by date descending by default (most recent first)
  const sorted = [...allTorrents].sort((a, b) => {
    const dir = order === 'desc' ? -1 : 1
    switch (sort) {
      case 'name':
        return dir * a.name.localeCompare(b.name)
      case 'size':
        return dir * (a.sizeBytes - b.sizeBytes)
      case 'seeders':
        return dir * (a.se - b.se)
      case 'leechers':
        return dir * (a.le - b.le)
      default: // date
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
    }
  })

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const params = new URLSearchParams()
  if (sort !== 'date') params.set('sort', sort)
  if (order !== 'desc') params.set('order', order)
  const baseUrl = `/recent${params.toString() ? '?' + params.toString() : ''}`

  return (
    <>
      <Header />
      <div style={{ maxWidth: 999, margin: '0 auto', textAlign: 'left' }}>
        <h2><b>Recent Torrents</b></h2>

        <TorrentTable
          torrents={paged}
          currentSort={sort}
          currentOrder={order}
          baseUrl={baseUrl}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseUrl={baseUrl}
        />
      </div>
      <PeerCounts />
    </>
  )
}
