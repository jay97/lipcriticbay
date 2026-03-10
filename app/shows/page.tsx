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
      <Header />
      <div className="shows-page">
        <div className="shows-header">
          <div className="shows-header-title">
            <h2 style={{ margin: 0, width: '100%' }}><span>Tour Dates</span></h2>
          </div>
          {nextShow && (
            <div className="shows-header-stats">
              <span className="shows-stat">
                <b>{totalUpcoming}</b> upcoming shows
              </span>
              <span className="shows-stat-sep">·</span>
              <span className="shows-stat">
                Next: <b>{nextShow.city}</b> — {nextShow.date}
              </span>
            </div>
          )}
        </div>
        <ShowsTable shows={shows} today={today} />
      </div>
    </>
  )
}
