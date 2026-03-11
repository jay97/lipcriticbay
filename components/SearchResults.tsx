'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import type { Torrent, Category } from '@/lib/types'
import { searchTorrents, isInfoHash } from '@/lib/search'
import type { SortField, SortOrder } from '@/lib/search'
import TorrentTable from './TorrentTable'
import Pagination from './Pagination'

const PER_PAGE = 35

interface SearchResultsProps {
  torrents: Torrent[]
  categories: Category[]
}

export default function SearchResults({ torrents, categories }: SearchResultsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get('q') || ''
  const catId = searchParams.get('cat') ? parseInt(searchParams.get('cat')!) : undefined
  const sort = (searchParams.get('sort') as SortField) || 'relevance'
  const order = (searchParams.get('order') as SortOrder) || 'desc'
  const page = parseInt(searchParams.get('page') || '1') || 1
  const lucky = searchParams.get('lucky')

  // Info hash direct lookup
  useEffect(() => {
    if (isInfoHash(query)) {
      const match = torrents.find(t => t.hash.toLowerCase() === query.toLowerCase())
      if (match) {
        const slug = match.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        router.replace(`/torrent/${match.id}/${slug}`)
      }
    }
  }, [query, torrents, router])

  const results = useMemo(() => searchTorrents(torrents, query, catId, sort, order), [torrents, query, catId, sort, order])

  // I'm Feeling Lucky
  useEffect(() => {
    if (lucky && results.length > 0) {
      const luckyTorrent = results[Math.floor(Math.random() * results.length)]
      const slug = luckyTorrent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      router.replace(`/torrent/${luckyTorrent.id}/${slug}`)
    }
  }, [lucky, results, router])

  const totalPages = Math.ceil(results.length / PER_PAGE)
  const paged = results.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Build base URL for pagination/sorting
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (catId) params.set('cat', String(catId))
  if (sort !== 'relevance') params.set('sort', sort)
  if (order !== 'desc') params.set('order', order)
  const baseUrl = `/search?${params.toString()}`

  const catName = catId
    ? categories.flatMap(c => [c, ...c.sub]).find(c => c.id === catId)?.name
    : null

  return (
    <div style={{ maxWidth: 999, margin: '0 auto', textAlign: 'left' }}>
      <h2>
        {query ? (
          <b>Results for: {query}</b>
        ) : catName ? (
          <b>{catName} Torrents</b>
        ) : (
          <b>All Torrents</b>
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
  )
}
