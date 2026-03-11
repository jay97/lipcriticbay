import { getCategories } from '@/lib/data'
import SearchBar from '@/components/SearchBar'
import PopupAd from '@/components/PopupAd'
import { Suspense } from 'react'
import Image from 'next/image'

export default function HomePage() {
  const categories = getCategories()

  return (
    <>
    <PopupAd />
    <div id="fp">
      <h1>
        <a href="/" title="Lip Critic Bay">
          <Image
            src="/img/logo.png"
            alt="Lip Critic Bay"
            width={275}
            height={295}
            priority
            sizes="(max-width: 480px) 80vw, 275px"
            style={{ maxWidth: '90vw', height: 'auto', border: 0 }}
          />
          <span>Lip Critic Bay</span>
        </a>
      </h1>

      <nav id="navlinks">
        <strong>Search Torrents</strong> |{' '}
        <a href="/browse" title="Browse Torrents">Browse Torrents</a> |{' '}
        <a href="/recent" title="Recent Torrents">Recent Torrents</a>
        <span className="nav-desktop-only">
        {' | '}
        <a href="/top" title="Top Torrents">Top Torrents</a>
        </span>
      </nav>

      <form name="q" method="get" action="/search">
        <Suspense fallback={null}>
          <SearchBar categories={categories} />
        </Suspense>
      </form>

      <nav id="customlinks">
        <a href="/about" title="About">About</a> |{' '}
        <a href="/shows" title="Tour Dates">Tour Dates</a>
        <span className="nav-desktop-only">
        {' | '}
        <a href="https://www.instagram.com/lipcritic/" target="_blank" rel="noopener noreferrer">Instagram</a> |{' '}
        <a href="/merch" title="Merch">Merch</a> |{' '}
        <a href="/liptube" title="LipTube">LipTube</a> |{' '}
        <a href="https://discord.gg/4Rgf4xbH" target="_blank" rel="noopener noreferrer">Discord</a>
        </span>
      </nav>
    </div>
    </>
  )
}
