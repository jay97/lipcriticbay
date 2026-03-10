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

  // Compute next show for header
  const upcoming = shows.filter(s => new Date(s.date) >= new Date(today))
  const nextShow = upcoming[0]
  const totalUpcoming = upcoming.length

  return (
    <>
      <Header hideSearchOnMobile />
      <div className="shows-page">
        <h2 className="shows-h2">
          <span className="shows-h2-title">Tour Dates</span>
          {nextShow && (
            <span className="shows-h2-stats">
              {totalUpcoming} shows &middot; Next: {nextShow.city} — {nextShow.date}
            </span>
          )}
        </h2>
        <ShowsTable shows={shows} today={today} />
      </div>
    </>
  )
}
