import { getTorrents, getTorrentById } from '@/lib/data'
import { generateMagnet } from '@/lib/magnet'
import { formatAge } from '@/lib/format'
import MagnetButton from '@/components/MagnetButton'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export function generateStaticParams() {
  const torrents = getTorrents()
  return torrents.map(t => ({ id: `${t.id}` }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const torrent = getTorrentById(parseInt(params.id))
  if (!torrent) return { title: 'Not Found' }
  return {
    title: `${torrent.name} — Lip Critic Bay`,
    description: `Download ${torrent.name} (${torrent.size}) via magnet link. ${torrent.catName}. Free from Lip Critic Bay.`,
    openGraph: {
      title: torrent.name,
      description: `${torrent.size} — ${torrent.catName}. Download free from Lip Critic Bay.`,
      type: 'music.song',
    },
  }
}

export default function TorrentPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const torrent = getTorrentById(id)

  if (!torrent) {
    notFound()
  }

  const magnet = generateMagnet(torrent.hash, torrent.name, torrent.trackers)

  return (
    <>
      <Header />
      <div id="details" style={{ maxWidth: 625, margin: '2em auto', padding: '0 1.5em 0.5em 1.5em' }}>
        <div className="detail-title">
          {torrent.name}
        </div>

        <dl id="col1" style={{ float: 'left', margin: '.9em 3%', width: '43%', lineHeight: '140%' }}>
          <dt>Type:</dt>
          <dd><a href={`/search?cat=${torrent.catId}`}>{torrent.catName}</a></dd>

          <dt>Files:</dt>
          <dd>{torrent.files.length || 'N/A'}</dd>

          <dt>Size:</dt>
          <dd>{torrent.size}</dd>

          <dt>Seeders:</dt>
          <dd>
            <span data-hash={torrent.hash} data-field="se">{torrent.se}</span>
          </dd>

          <dt>Leechers:</dt>
          <dd>
            <span data-hash={torrent.hash} data-field="le">{torrent.le}</span>
          </dd>
        </dl>

        <dl id="col2" style={{ float: 'left', margin: '.9em 3%', width: '43%', lineHeight: '140%' }}>
          <dt>Info Hash:</dt>
          <dd style={{ fontFamily: 'monospace', fontSize: '0.85em', wordBreak: 'break-all' }}>{torrent.hash}</dd>

          <dt>Uploaded:</dt>
          <dd>{torrent.uploadedRaw} ({formatAge(torrent.date)})</dd>

          <dt>By:</dt>
          <dd>
            {torrent.uploader}
            {torrent.vip && <> <span className="badge-vip">[VIP]</span></>}
            {torrent.trusted && <> <span className="badge-trusted">[Trusted]</span></>}
          </dd>
        </dl>

        <div style={{ clear: 'both' }} />

        <div className="download">
          <MagnetButton href={magnet} />
        </div>

        <div className="nfo">
          {torrent.desc}
        </div>

        {torrent.files.length > 0 && (
          <div className="filelist-container">
            <h4 style={{ margin: '0 0 5px 0', color: '#7B563A', fontSize: '1em' }}>
              File list
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'monospace', fontSize: 11 }}>
              {torrent.files.map((f, i) => (
                <li key={i} style={{ padding: '1px 0' }}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="download">
          <MagnetButton href={magnet} />
        </div>
      </div>
      <PeerCounts />
    </>
  )
}
