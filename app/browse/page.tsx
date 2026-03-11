import { getTorrents, getCategories } from '@/lib/data'
import { generateMagnet } from '@/lib/magnet'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Torrents',
  description: 'Browse all Lip Critic torrents by category. Audio, Video, Stems, and more.',
}

export default function BrowsePage() {
  const categories = getCategories()
  const allTorrents = getTorrents()

  return (
    <>
      <Header />
      <div style={{ maxWidth: 999, margin: '0 auto', textAlign: 'left' }}>
        <h2><b>Browse Torrents</b></h2>

        {categories.map(cat => {
          const catTorrents = allTorrents
            .filter(t => t.catId >= cat.id && t.catId < cat.id + 100)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)

          return (
            <div key={cat.id} style={{ marginBottom: 20 }}>
              <table id="searchResult">
                <thead>
                  <tr>
                    <th colSpan={7} style={{ fontSize: '1.1em' }}>
                      <a href={`/search?cat=${cat.id}`} style={{ color: '#000' }}>
                        {cat.name}
                      </a>
                      <span style={{ fontSize: '0.75em', fontWeight: 'normal', marginLeft: 10 }}>
                        ({cat.sub.map(s => s.name).join(', ')})
                      </span>
                    </th>
                  </tr>
                  <tr>
                    <th className="col-category">Category</th>
                    <th className="col-name">Name</th>
                    <th className="col-date">Uploaded</th>
                    <th className="col-size">Size</th>
                    <th className="col-se">SE</th>
                    <th className="col-le">LE</th>
                    <th className="col-uled">ULed by</th>
                  </tr>
                </thead>
                <tbody>
                  {catTorrents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 10, color: '#666' }}>
                        No torrents in this category yet.
                      </td>
                    </tr>
                  ) : (
                    catTorrents.map(t => {
                      const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      const magnet = generateMagnet(t.hash, t.name, t.trackers)
                      return (
                        <tr key={t.id}>
                          <td className="vertTh">
                            <a href={`/search?cat=${t.catId}`}>{t.catName}</a>
                          </td>
                          <td className="col-name">
                            <a href={`/torrent/${t.id}/${slug}`}>{t.name}</a>
                            {t.trusted && <> <span className="badge-trusted" title="Trusted">&#9733;</span></>}
                            {' '}
                            <a href={magnet} title="Download this torrent using magnet" className="dl-magnet" style={{ border: 0 }}>
                              <img src="/img/icon-magnet.gif" alt="Magnet" width={12} height={12} style={{ border: 0, verticalAlign: 'middle' }} />
                            </a>
                            {t.vip && (
                              <img src="/img/vip.gif" alt="VIP" title="VIP" width={11} height={11} style={{ border: 0, verticalAlign: 'middle', marginLeft: 2 }} />
                            )}
                          </td>
                          <td className="col-date" style={{ whiteSpace: 'nowrap' }}>{t.uploadedRaw || t.date}</td>
                          <td className="col-size" style={{ whiteSpace: 'nowrap' }}>{t.size}</td>
                          <td className="se-col col-se-cell" data-hash={t.hash} data-field="se">{t.se}</td>
                          <td className="le-col col-le-cell" data-hash={t.hash} data-field="le">{t.le}</td>
                          <td className="uled-by">{t.uploader}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
      <PeerCounts />
    </>
  )
}
