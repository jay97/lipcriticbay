import { getVideos } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'LipTube',
  description: 'All Lip Critic videos. A retro YouTube experience.',
  openGraph: {
    title: 'LipTube — Lip Critic Videos',
    description: 'Watch all Lip Critic videos in a classic YouTube interface.',
  },
}

export default function LipTubePage() {
  const videos = getVideos()
  const totalResults = videos.length

  return (
    <div className="liptube">
      {/* === YOUTUBE HEADER BAR === */}
      <div className="lt-header">
        <div className="lt-header-inner">
          <a href="/liptube" className="lt-logo">
            <span className="lt-logo-icon">&#9654;</span>
            <span className="lt-logo-text">LipTube</span>
          </a>
          <div className="lt-search-wrap">
            <input
              type="text"
              className="lt-search-input"
              placeholder="Search"
              defaultValue="Lip Critic"
              readOnly
            />
            <button className="lt-search-btn" type="button">
              &#128269;
            </button>
          </div>
          <div className="lt-header-links">
            <a href="/">Back to Lip Critic Bay</a>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT AREA === */}
      <div className="lt-body">
        {/* Left sidebar / Guide */}
        <div className="lt-sidebar">
          <div className="lt-guide-section">
            <a href="/liptube" className="lt-guide-link lt-guide-active">
              &#127968; Home
            </a>
            <a href="/liptube" className="lt-guide-link">
              &#128250; Videos
            </a>
            <a href="/shows" className="lt-guide-link">
              &#127925; Tour Dates
            </a>
            <a href="/" className="lt-guide-link">
              &#128190; Torrents
            </a>
            <a
              href="https://www.youtube.com/@lipcritic"
              target="_blank"
              rel="noopener noreferrer"
              className="lt-guide-link"
            >
              &#9654; Real YouTube
            </a>
          </div>
        </div>

        {/* Main results area */}
        <div className="lt-content">
          {/* Filter bar */}
          <div className="lt-filter-bar">
            <span className="lt-result-count">
              About {totalResults.toLocaleString()} results
            </span>
            <span className="lt-filter-options">
              Filter &middot; Upload date &middot; View count &middot; Rating
            </span>
          </div>

          {/* Video results list */}
          <div className="lt-results">
            {videos.map((video) => (
              <a
                key={video.id}
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lt-result-row"
              >
                <div className="lt-thumb-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="lt-thumb"
                    width={196}
                    height={110}
                    loading="lazy"
                  />
                  <span className="lt-duration">{video.duration}</span>
                </div>
                <div className="lt-result-info">
                  <div className="lt-result-title">{video.title}</div>
                  <div className="lt-result-meta">
                    by <span className="lt-channel">{video.channel}</span>
                    {' \u00B7 '}
                    {video.uploadLabel}
                    {' \u00B7 '}
                    {video.views}
                  </div>
                  {video.description && (
                    <div className="lt-result-desc">{video.description}</div>
                  )}
                </div>
              </a>
            ))}
          </div>

          {/* Pagination (decorative) */}
          <div className="lt-pagination">
            <span className="lt-page-active">1</span>
          </div>
        </div>
      </div>
    </div>
  )
}
