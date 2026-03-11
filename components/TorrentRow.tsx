import type { Torrent } from '@/lib/types'
import { generateMagnet } from '@/lib/magnet'

interface TorrentRowProps {
  torrent: Torrent
}

export default function TorrentRow({ torrent }: TorrentRowProps) {
  const magnet = generateMagnet(torrent.hash, torrent.name, torrent.trackers)
  const slug = torrent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  return (
    <tr>
      <td className="vertTh">
        <a href={`/search?cat=${torrent.catId}`}>{torrent.catName}</a>
      </td>
      <td className="col-name">
        <a href={`/torrent/${torrent.id}/${slug}`} style={{ border: 0 }}>
          {torrent.name}
        </a>
        {torrent.trusted && <> <span className="badge-trusted" title="Trusted">&#9733;</span></>}
      </td>
      <td className="col-date" style={{ whiteSpace: 'nowrap' }}>
        {torrent.uploadedRaw || torrent.date}
      </td>
      <td className="col-icons" style={{ whiteSpace: 'nowrap' }}>
        <a href={magnet} title="Download this torrent using magnet" className="dl-magnet" style={{ border: 0 }}>
          <img src="/img/icon-magnet.gif" alt="Magnet" width={12} height={12} style={{ border: 0, verticalAlign: 'middle' }} />
        </a>
        {torrent.vip && (
          <img src="/img/vip.gif" alt="VIP" title="VIP" width={11} height={11} style={{ border: 0, verticalAlign: 'middle', marginLeft: 2 }} />
        )}
      </td>
      <td className="col-size" style={{ whiteSpace: 'nowrap' }}>
        {torrent.size}
      </td>
      <td className="se-col col-se-cell" data-hash={torrent.hash} data-field="se">
        {torrent.se}
      </td>
      <td className="le-col col-le-cell" data-hash={torrent.hash} data-field="le">
        {torrent.le}
      </td>
      <td className="uled-by">
        {torrent.uploader}
      </td>
    </tr>
  )
}
