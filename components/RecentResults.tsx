'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import type { Torrent } from '@/lib/types'
import TorrentTable from './TorrentTable'
import Pagination from './Pagination'

const PER_PAGE = 35

interface RecentResultsProps {
  torrents: Torrent[]
}

export default function RecentResults({ torrents }: RecentResultsProps) {
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1') || 1
  const sort = searchParams.get('sort') || 'date'
  const order = searchParams.get('order') || 'desc'

  const sorted = useMemo(() => {
    const dir = order === 'desc' ? -1 : 1
    return [...torrents].sort((a, b) => {
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
  }, [torrents, sort, order])

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paged = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const params = new URLSearchParams()
  if (sort !== 'date') params.set('sort', sort)
  if (order !== 'desc') params.set('order', order)
  const baseUrl = `/recent${params.toString() ? '?' + params.toString() : ''}`

  return (
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
  )
}
