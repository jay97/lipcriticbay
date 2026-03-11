'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import type { Torrent } from '@/lib/types'
import { generateMagnet } from '@/lib/magnet'
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

      {paged.length === 0 ? (
        <div id="error"><span>No results found.</span></div>
      ) : (
        <table id="searchResult">
          <thead>
            <tr>
              <th colSpan={6} style={{ fontSize: '1.1em' }}>
                Recent Uploads
                <span style={{ fontSize: '0.75em', fontWeight: 'normal', marginLeft: 10 }}>
                  (sorted by date, newest first)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map(t => {
              const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
              const magnet = generateMagnet(t.hash, t.name, t.trackers)
              return (
                <tr key={t.id}>
                  <td className="col-name">
                    <a href={`/torrent/${t.id}/${slug}`}>{t.name}</a>
                    {t.trusted && <> <span className="badge-trusted" title="Trusted">&#9733;</span></>}
                  </td>
                  <td className="col-date" style={{ whiteSpace: 'nowrap' }}>{t.uploadedRaw || t.date}</td>
                  <td className="col-icons" style={{ whiteSpace: 'nowrap' }}>
                    <a href={magnet} title="Download this torrent using magnet" className="dl-magnet" style={{ border: 0 }}>
                      <img src="/img/icon-magnet.gif" alt="Magnet" width={12} height={12} style={{ border: 0, verticalAlign: 'middle' }} />
                    </a>
                    {t.vip && (
                      <img src="/img/vip.gif" alt="VIP" title="VIP" width={11} height={11} style={{ border: 0, verticalAlign: 'middle', marginLeft: 2 }} />
                    )}
                  </td>
                  <td className="col-size" style={{ whiteSpace: 'nowrap' }}>{t.size}</td>
                  <td className="se-col col-se-cell" data-hash={t.hash} data-field="se">{t.se}</td>
                  <td className="le-col col-le-cell" data-hash={t.hash} data-field="le">{t.le}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </div>
  )
}
