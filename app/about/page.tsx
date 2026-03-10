import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About Lip Critic Bay — a free torrent index for Lip Critic music, stems, live recordings, and more.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <div style={{ maxWidth: 625, margin: '0 auto', textAlign: 'left', padding: '0 1.5em' }}>
        <h2><b>About Lip Critic Bay</b></h2>

        <div style={{ lineHeight: '1.6em', marginTop: 10 }}>
          <p>
            <b>Lip Critic Bay</b> is the official torrent index for <a href="https://lipcriticworld.com" target="_blank" rel="noopener">Lip Critic</a>.
            Download studio albums, singles, stems, live recordings, and more — all free, all legal, straight from the band.
          </p>

          <p style={{ marginTop: 12 }}>
            Every release is available as a magnet link. No account needed, no ratio to maintain,
            no tracker drama. Just click the magnet icon and start downloading.
          </p>

          <h2 style={{ marginTop: 20 }}><b>How It Works</b></h2>
          <p style={{ marginTop: 8 }}>
            You need a BitTorrent client to download. We recommend{' '}
            <a href="https://transmissionbt.com" target="_blank" rel="noopener">Transmission</a> (Mac/Linux) or{' '}
            <a href="https://www.qbittorrent.org" target="_blank" rel="noopener">qBittorrent</a> (Windows/Mac/Linux).
            Click any magnet link on this site and it will open in your torrent client automatically.
          </p>

          <h2 style={{ marginTop: 20 }}><b>Formats</b></h2>
          <p style={{ marginTop: 8 }}>
            Most releases are available in <b>FLAC</b> (lossless), <b>WAV</b>, and <b>MP3 320</b>.
            Stems and multitracks are typically in WAV format. Check each torrent&apos;s description for details.
          </p>

          <h2 style={{ marginTop: 20 }}><b>Seeding</b></h2>
          <p style={{ marginTop: 8 }}>
            Please seed after downloading. The more seeders, the faster everyone can download.
            If you can leave your client running, we appreciate it.
          </p>

          <h2 style={{ marginTop: 20 }}><b>Links</b></h2>
          <p style={{ marginTop: 8 }}>
            <a href="https://lipcriticworld.com" target="_blank" rel="noopener">Official Website</a><br />
            <a href="https://www.instagram.com/lipcriticworld" target="_blank" rel="noopener">Instagram</a><br />
            <a href="https://lipcriticworld.myshopify.com" target="_blank" rel="noopener">Merch Store</a><br />
            <a href="/shows">Tour Dates</a>
          </p>
        </div>
      </div>
    </>
  )
}
