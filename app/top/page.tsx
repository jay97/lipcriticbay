import { getTorrents } from '@/lib/data'
import { generateMagnet } from '@/lib/magnet'
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

        <table id="searchResult">
          <thead>
            <tr>
              <th colSpan={6} style={{ fontSize: '1.1em' }}>
                Top Torrents
                <span style={{ fontSize: '0.75em', fontWeight: 'normal', marginLeft: 10 }}>
                  (sorted by total peers)
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(t => {
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
      </div>
      <PeerCounts />
    </>
  )
}
