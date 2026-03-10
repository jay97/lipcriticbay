'use client'

import { useState } from 'react'
import type { Show } from '@/lib/types'

interface ShowsTableProps {
  shows: Show[]
  today: string
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const SUP_KEY: Record<string, { label: string; color: string }> = {
  B: { label: 'Bejalvin', color: '#3579BC' },
  F: { label: 'Flatwounds', color: '#c44' },
}

function parseShowDate(dateStr: string): Date {
  return new Date(dateStr)
}

function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr)
  return DAYS[d.getUTCDay()] || ''
}

function renderTags(tags?: string[]) {
  if (!tags || tags.length === 0) return null
  return tags.map((tag, i) => (
    <span key={i} className={`show-tag tag-${tag.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{tag}</span>
  ))
}

function renderSup(sup: string[]) {
  if (!sup || sup.length === 0) return null
  return (
    <span className="sup-indicators">
      {sup.map(s => {
        const info = SUP_KEY[s]
        if (!info) return null
        return (
          <span key={s} className="sup-dot" style={{ color: info.color }} title={info.label}>
            {s}
          </span>
        )
      })}
    </span>
  )
}

function ShowRow({ show, isPast }: { show: Show; isPast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const day = getDayOfWeek(show.date)

  return (
    <>
      <tr
        className={`show-row ${isPast ? 'past-show-row' : ''} ${show.soldOut ? 'sold-out' : ''} ${expanded ? 'show-row-expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
        style={{ cursor: 'pointer' }}
      >
        <td style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
          <span className="show-day">{day}</span> {show.date}
        </td>
        <td>{show.city}</td>
        <td>
          {show.soldOut ? <span className="sold-out">{show.venue}</span> : show.venue}
          {renderSup(show.sup)}
          {renderTags(show.tags)}
        </td>
        <td className="col-ages">{show.ages}</td>
        <td>{show.price}</td>
        <td>
          {isPast ? (
            <span style={{ color: '#999', fontSize: '0.85em' }}>PAST</span>
          ) : show.soldOut ? (
            <span style={{ color: '#c00', fontWeight: 'bold', fontSize: '0.85em' }}>SOLD OUT</span>
          ) : show.url && show.url !== '#' ? (
            <a
              href={show.url}
              target="_blank"
              rel="noopener"
              style={{ border: 0 }}
              className="msb-btn"
              onClick={e => e.stopPropagation()}
            >
              TICKETS
            </a>
          ) : (
            <span style={{ color: '#888', fontSize: '0.85em' }}>TBA</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className={`show-detail-row ${isPast ? 'past-show-row' : ''}`}>
          <td colSpan={6}>
            <div className="show-detail">
              <a
                href={show.photo}
                target="_blank"
                rel="noopener"
                className="show-thumb-link"
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={show.photo}
                  alt={show.venue}
                  className="show-thumb"
                  loading="lazy"
                />
              </a>
              <div className="show-detail-info">
                <div><b>{show.venue}</b></div>
                <div style={{ color: '#7B563A', fontSize: '0.95em' }}>
                  {show.city}
                </div>
                <div style={{ marginTop: 4, fontSize: '0.9em' }}>
                  Doors: {show.doors} · {show.ages} · {show.price}
                </div>
                {show.sup.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: '0.85em', color: '#666' }}>
                    w/ {show.sup.map(s => SUP_KEY[s]?.label || s).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function ShowsTable({ shows, today }: ShowsTableProps) {
  const [showPast, setShowPast] = useState(false)
  const todayDate = new Date(today)
  todayDate.setHours(23, 59, 59, 999)

  const pastShows = shows.filter(s => parseShowDate(s.date) < todayDate)
  const upcomingShows = shows.filter(s => parseShowDate(s.date) >= todayDate)
  const hasPastShows = pastShows.length > 0

  // Check if any upcoming show has supporters
  const hasSupport = shows.some(s => s.sup.length > 0)

  return (
    <>
      {hasSupport && (
        <div className="sup-key">
          {Object.entries(SUP_KEY).map(([code, info]) => (
            <span key={code} className="sup-key-item">
              <span className="sup-dot" style={{ color: info.color }}>{code}</span>
              {' '}{info.label}
            </span>
          ))}
        </div>
      )}

      {hasPastShows && (
        <button
          className="past-shows-toggle"
          onClick={() => setShowPast(!showPast)}
          type="button"
        >
          {showPast ? '▾ HIDE PAST SHOWS' : `▸ PAST SHOWS (${pastShows.length})`}
        </button>
      )}

      <table className="shows-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>City</th>
            <th>Venue</th>
            <th className="col-ages">Ages</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {showPast && pastShows.map((show, i) => (
            <ShowRow key={`past-${i}`} show={show} isPast />
          ))}
          {upcomingShows.map((show, i) => (
            <ShowRow key={`upcoming-${i}`} show={show} isPast={false} />
          ))}
        </tbody>
      </table>
    </>
  )
}
