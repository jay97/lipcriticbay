'use client'

import { useState, useEffect } from 'react'
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

// Weather forecast component — uses Open-Meteo (free, no API key)
function WeatherForecast({ lat, lng, date }: { lat: number; lng: number; date: string }) {
  const [weather, setWeather] = useState<{ tempHigh: number; tempLow: number; code: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const showDate = new Date(date)
    const now = new Date()
    const diffDays = Math.ceil((showDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Open-Meteo forecast API supports up to 16 days out
    if (diffDays < 0 || diffDays > 16) {
      setLoading(false)
      return
    }

    const dateStr = showDate.toISOString().split('T')[0]
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&start_date=${dateStr}&end_date=${dateStr}&timezone=auto`

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.daily && data.daily.temperature_2m_max?.[0] != null) {
          setWeather({
            tempHigh: Math.round(data.daily.temperature_2m_max[0]),
            tempLow: Math.round(data.daily.temperature_2m_min[0]),
            code: data.daily.weather_code?.[0] ?? -1,
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [lat, lng, date])

  if (loading) return <span className="weather-loading">...</span>
  if (!weather) return null

  const icon = weatherIcon(weather.code)

  return (
    <span className="weather-forecast">
      <span className="weather-icon">{icon}</span>
      {' '}{weather.tempHigh}°/{weather.tempLow}°F
    </span>
  )
}

// WMO weather code → emoji
function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 48) return '🌫️'
  if (code <= 57) return '🌧️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '🌨️'
  if (code <= 82) return '🌧️'
  if (code <= 86) return '🌨️'
  if (code >= 95) return '⛈️'
  return '🌤️'
}

function ShowRow({ show, isPast }: { show: Show; isPast: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const day = getDayOfWeek(show.date)

  return (
    <>
      <tr
        className={`show-row ${isPast ? 'past-show-row' : ''} ${show.soldOut ? 'sold-out' : ''} ${expanded ? 'show-row-expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="col-date">
          {show.date}
        </td>
        <td className="col-city">{show.city}</td>
        <td className="col-venue">
          {show.soldOut ? <span className="sold-out">{show.venue}</span> : show.venue}
          {renderSup(show.sup)}
          {renderTags(show.tags)}
        </td>
        <td className="col-ticket">
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
          <td colSpan={4}>
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
                  {day} · {show.city}
                </div>
                <div style={{ marginTop: 4, fontSize: '0.9em' }}>
                  Doors: {show.doors} · {show.ages} · {show.price}
                </div>
                {show.sup.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: '0.85em', color: '#666' }}>
                    w/ {show.sup.map(s => SUP_KEY[s]?.label || s).join(', ')}
                  </div>
                )}
                {!isPast && (
                  <div style={{ marginTop: 4, fontSize: '0.85em', color: '#666' }}>
                    <WeatherForecast lat={show.lat} lng={show.lng} date={show.date} />
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

  // Check if any show has supporters
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
