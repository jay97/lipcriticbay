import { Suspense } from 'react'
import { getCategories } from '@/lib/data'
import SearchBar from './SearchBar'
import Image from 'next/image'

interface HeaderProps {
  hideSearchOnMobile?: boolean
}

export default function Header({ hideSearchOnMobile = false }: HeaderProps) {
  const categories = getCategories()

  return (
    <div id="header" className={hideSearchOnMobile ? 'header-no-mobile-search' : undefined}>
      <form method="get" id="q" action="/search">
        <div id="logo">
          <a href="/" style={{ borderBottom: 0 }}>
            <Image
              src="/img/logo.png"
              alt="Lip Critic Bay"
              width={82}
              height={78}
              sizes="82px"
              style={{ height: 86, width: 'auto', marginTop: -12, marginRight: 10, float: 'left', border: 0, objectFit: 'contain' }}
            />
          </a>
        </div>
        <div style={{ float: 'left' }}>
          <div style={{ marginBottom: 8, fontSize: 11 }}>
            <b><a href="/" title="Search Torrents">Search Torrents</a></b>
            {' | '}
            <a href="/browse" title="Browse Torrents">Browse Torrents</a>
            {' | '}
            <a href="/recent" title="Recent Torrents">Recent Torrents</a>
            {' | '}
            <a href="/top" title="Top Torrents">Top Torrents</a>
          </div>
          <div className="header-search-wrap">
            <Suspense fallback={null}>
              <SearchBar categories={categories} compact />
            </Suspense>
          </div>
          <div className="header-custom-links" style={{ marginTop: 6, fontSize: 11 }}>
            <a href="/about" title="About">About</a>
            {' | '}
            <a href="/shows" title="Tour Dates">Tour Dates</a>
            {' | '}
            <a href="https://www.instagram.com/lipcritic/" target="_blank" rel="noopener noreferrer" title="Instagram">Instagram</a>
            {' | '}
            <a href="/merch" title="Merch">Merch</a>
            {' | '}
            <a href="/liptube" title="LipTube">LipTube</a>
            {' | '}
            <a href="https://discord.gg/4Rgf4xbH" target="_blank" rel="noopener noreferrer" title="Discord">Discord</a>
          </div>
        </div>
      </form>
    </div>
  )
}
