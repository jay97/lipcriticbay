import type { Torrent } from '@/lib/types'
import TorrentRow from './TorrentRow'

interface TorrentTableProps {
  torrents: Torrent[]
  currentSort?: string
  currentOrder?: string
  baseUrl?: string
}

function sortLink(field: string, currentSort?: string, currentOrder?: string, baseUrl?: string) {
  const base = baseUrl || ''
  const sep = base.includes('?') ? '&' : '?'
  const order = currentSort === field && currentOrder === 'desc' ? 'asc' : 'desc'
  return `${base}${sep}sort=${field}&order=${order}`
}

export default function TorrentTable({ torrents, currentSort, currentOrder, baseUrl }: TorrentTableProps) {
  if (torrents.length === 0) {
    return <div id="error"><span>No results found.</span></div>
  }

  return (
    <table id="searchResult">
      <thead>
        <tr>
          <th className="col-category">Category</th>
          <th className="col-name">
            <a href={sortLink('name', currentSort, currentOrder, baseUrl)}>Name</a>
          </th>
          <th className="col-date">
            <a href={sortLink('date', currentSort, currentOrder, baseUrl)}>Uploaded</a>
          </th>
          <th className="col-icons"></th>
          <th className="col-size">
            <a href={sortLink('size', currentSort, currentOrder, baseUrl)}>Size</a>
          </th>
          <th className="col-se">
            <a href={sortLink('seeders', currentSort, currentOrder, baseUrl)}>SE</a>
          </th>
          <th className="col-le">
            <a href={sortLink('leechers', currentSort, currentOrder, baseUrl)}>LE</a>
          </th>
          <th className="col-uled">ULed by</th>
        </tr>
      </thead>
      <tbody>
        {torrents.map((torrent) => (
          <TorrentRow key={torrent.id} torrent={torrent} />
        ))}
      </tbody>
    </table>
  )
}
