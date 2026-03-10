import { Suspense } from 'react'
import { getCategories } from '@/lib/data'
import SearchBar from './SearchBar'

export default function Header() {
  const categories = getCategories()

  return (
    <div id="header">
      <form method="get" id="q" action="/search">
        <div id="logo">
          <a href="/" style={{ borderBottom: 0 }}>
            <img
              src="/img/logo.png"
              alt="Lip Critic Bay"
              width={82}
              height={78}
              style={{ height: 86, width: 'auto', marginTop: -12, marginRight: 10, float: 'left', border: 0, objectFit: 'contain' }}
            />
          </a>
        </div>
        <div style={{ float: 'left' }}>
          <div style={{ marginBottom: 8, fontSize: 11 }}>
            <a href="/about" title="About">About</a>
            {' | '}
            <a href="/shows" title="Tour Dates">Tour Dates</a>
            {' | '}
            <a href="https://www.instagram.com/lipcriticworld" target="_blank" rel="noopener" title="Instagram">Instagram</a>
            {' | '}
            <a href="https://lipcriticworld.myshopify.com" target="_blank" rel="noopener" title="Merch">Merch</a>
            <br />
            <b><a href="/" title="Search Torrents">Search Torrents</a></b>
            {' | '}
            <a href="/browse" title="Browse Torrents">Browse Torrents</a>
            {' | '}
            <a href="/recent" title="Recent Torrents">Recent Torrents</a>
          </div>
          <Suspense fallback={null}>
            <SearchBar categories={categories} compact />
          </Suspense>
        </div>
      </form>
    </div>
  )
}
