import { getShows } from '@/lib/data'
import Header from '@/components/Header'
import ShowsTable from '@/components/ShowsTable'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tour Dates — Lip Critic',
  description: 'Lip Critic live tour dates, ticket links, and show info. See Lip Critic live near you.',
  openGraph: {
    title: 'Lip Critic Tour Dates',
    description: 'See Lip Critic live. Full tour schedule with ticket links.',
  },
}

export default function ShowsPage() {
  const shows = getShows()
  const today = new Date().toISOString().split('T')[0]

  return (
    <>
      <Header />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
        <h2><span>Tour Dates — Lip Critic</span></h2>
        <ShowsTable shows={shows} today={today} />
      </div>
    </>
  )
}
