import { getTorrents, getCategories } from '@/lib/data'
import { searchTorrents, isInfoHash } from '@/lib/search'
import type { SortField, SortOrder } from '@/lib/search'
import TorrentTable from '@/components/TorrentTable'
import Pagination from '@/components/Pagination'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

const PER_PAGE = 35

export function generateMetadata({ searchParams }: { searchParams: { q?: string; cat?: string } }): Metadata {
  const query = searchParams.q || ''
  const title = query ? `${query} — Lip Critic Bay` : 'Search — Lip Critic Bay'
  const desc = query
    ? `Download "${query}" from Lip Critic Bay. Free FLAC, WAV, MP3 torrents.`
    : 'Search and download free Lip Critic music torrents.'
  return { title, description: desc }
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; cat?: string; sort?: string; order?: string; page?: string; lucky?: string }
}) {
  const query = searchParams.q || ''
  const catId = searchParams.cat ? parseInt(searchParams.cat) : undefined
  const sort = (searchParams.sort as SortField) || 'relevance'
  const order = (searchParams.order as SortOrder) || 'desc'
  const page = parseInt(searchParams.page || '1') || 1

  // Info hash direct lookup
  if (isInfoHash(query)) {
    const torrents = getTorrents()
    const match = torrents.find(t => t.hash.toLowerCase() === query.toLowerCase())
    if (match) {
      const slug = match.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      redirect(`/torrent/${match.id}/${slug}`)
    }
  }

  const allTorrents = getTorrents()
  const results = searchTorrents(allTorrents, query, catId, sort, order)

  // I'm Feeling Lucky
  if (searchParams.lucky && results.length > 0) {
    const lucky = results[Math.floor(Math.random() * results.length)]
    const slug = lucky.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    redirect(`/torrent/${lucky.id}/${slug}`)
  }

  const totalPages = Math.ceil(results.length / PER_PAGE)
  const paged = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Build base URL for pagination/sorting
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (catId) params.set('cat', String(catId))
  if (sort !== 'relevance') params.set('sort', sort)
  if (order !== 'desc') params.set('order', order)
  const baseUrl = `/search?${params.toString()}`

  const categories = getCategories()
  const catName = catId
    ? categories.flatMap(c => [c, ...c.sub]).find(c => c.id === catId)?.name
    : null

  return (
    <>
      <Header />
      <div style={{ maxWidth: 999, margin: '0 auto', textAlign: 'left' }}>
        <h2>
          {query ? (
            <><b>Results for: {query}</b></>
          ) : catName ? (
            <><b>{catName} Torrents</b></>
          ) : (
            <><b>All Torrents</b></>
          )}
        </h2>

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
