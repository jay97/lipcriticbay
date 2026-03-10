import { getCategories } from '@/lib/data'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'

export default function HomePage() {
  const categories = getCategories()

  return (
    <div id="fp">
      <h1>
        <a href="/" title="Lip Critic Bay">
          <img
            src="/img/logo.png"
            alt="Lip Critic Bay"
            width={450}
            height={429}
            style={{ maxWidth: '90vw', height: 'auto', border: 0 }}
          />
          <span>Lip Critic Bay</span>
        </a>
      </h1>

      <nav id="navlinks">
        <a href="/about" title="About">About</a> |{' '}
        <a href="/shows" title="Tour Dates">Tour Dates</a> |{' '}
        <a href="https://www.instagram.com/lipcriticworld" target="_blank" rel="noopener">Instagram</a> |{' '}
        <a href="https://lipcriticworld.myshopify.com" target="_blank" rel="noopener">Merch</a>
        <br />
        <strong>Search Torrents</strong> |{' '}
        <a href="/browse" title="Browse Torrents">Browse Torrents</a> |{' '}
        <a href="/recent" title="Recent Torrents">Recent Torrents</a>
      </nav>

      <form name="q" method="get" action="/search">
        <Suspense fallback={null}>
          <SearchBar categories={categories} />
        </Suspense>
      </form>
    </div>
  )
}
