import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D2B9A6',
}

export const metadata: Metadata = {
  title: {
    default: 'Lip Critic Bay — Free Music Downloads',
    template: '%s | Lip Critic Bay',
  },
  description: 'Download Lip Critic music, stems, live recordings, and more. Free FLAC, WAV, and MP3 torrents from the band that sounds like a broken factory.',
  keywords: ['lip critic', 'lip critic bay', 'lip critic torrent', 'lip critic download', 'lip critic flac', 'lip critic stems', 'lip critic hex dealer', 'lip critic killing joke joke', 'lip critic theft world', 'noise pop', 'experimental punk', 'free music download', 'torrent', 'magnet link'],
  authors: [{ name: 'Lip Critic' }],
  creator: 'Lip Critic',
  publisher: 'Lip Critic Bay',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lipcritic.com',
    siteName: 'Lip Critic Bay',
    title: 'Lip Critic Bay — Free Music Downloads',
    description: 'Download Lip Critic music, stems, live recordings, and more. Free FLAC, WAV, and MP3 torrents.',
    images: [{ url: '/img/logo.png', width: 1200, height: 1144, alt: 'Lip Critic Bay' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lip Critic Bay — Free Music Downloads',
    description: 'Download Lip Critic music, stems, live recordings, and more.',
    images: ['/img/logo.png'],
  },
  alternates: {
    canonical: 'https://lipcritic.com',
  },
  icons: {
    icon: '/img/logo.png',
    apple: '/img/logo.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Lip Critic',
  url: 'https://lipcritic.com',
  image: 'https://lipcritic.com/img/logo.png',
  genre: ['Noise Pop', 'Experimental Punk', 'Art Punk'],
  sameAs: [
    'https://lipcriticworld.com',
    'https://www.instagram.com/lipcritic/',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <footer>
          <p className="crypto-donations">
            <span><a href="bitcoin:31oWGmzmyjfwPQzv2kpQXASwMXe57f8K9w" className="crypto-label">BTC</a>: <a href="bitcoin:31oWGmzmyjfwPQzv2kpQXASwMXe57f8K9w" className="crypto-addr">31oWGmzmyjfwPQzv2kpQXASwMXe57f8K9w</a></span><br />
            <span><a href="litecoin:MMdWGCxCqMEuGnAYm761rHQQzbSiJT3w8C" className="crypto-label">LTC</a>: <a href="litecoin:MMdWGCxCqMEuGnAYm761rHQQzbSiJT3w8C" className="crypto-addr">MMdWGCxCqMEuGnAYm761rHQQzbSiJT3w8C</a></span><br />
            <span><a href="ethereum:0x7e9B37dEBbDA960F56053aF76A70d3674e3aB8A9" className="crypto-label">ETH</a>: <a href="ethereum:0x7e9B37dEBbDA960F56053aF76A70d3674e3aB8A9" className="crypto-addr">0x7e9B37dEBbDA960F56053aF76A70d3674e3aB8A9</a></span>
          </p>
        </footer>
      </body>
    </html>
  )
}
