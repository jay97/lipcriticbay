import { getTorrents, getCategories } from '@/lib/data'
import SearchResults from '@/components/SearchResults'
import PeerCounts from '@/components/PeerCounts'
import Header from '@/components/Header'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search — Lip Critic Bay',
  description: 'Search and download free Lip Critic music torrents.',
}

export default function SearchPage() {
  const allTorrents = getTorrents()
  const categories = getCategories()

  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <SearchResults torrents={allTorrents} categories={categories} />
      </Suspense>
      <PeerCounts />
    </>
  )
}
