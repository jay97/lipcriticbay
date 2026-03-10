'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Show } from '@/lib/types'
import { safeExternalHref } from '@/lib/url'

interface ShowsTableProps {
  shows: Show[]
  today: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const SUP_KEY: Record<string, { label: string; color: string }> = {
  B: { label: 'Bejalvin', color: '#3579BC' },
  F: { label: 'Flatwounds', color: '#c44' },
}

function parseShowDate(dateStr: string): Date {
  return new Date(dateStr)
}

function splitShowDate(dateStr: string): { main: string; year: string } {
  const match = dateStr.match(/^(.*?)(?:,\s*(\d{4}))$/)
  if (!match) return { main: dateStr, year: '' }
  return { main: match[1], year: match[2] || '' }
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

// Weather forecast — Open-Meteo (free, no API key)
function WeatherForecast({ lat, lng, date }: { lat: number; lng: number; date: string }) {
  const [weather, setWeather] = useState<{ tempHigh: number; tempLow: number; code: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const showDate = new Date(date)
    const now = new Date()
    const diffDays = Math.ceil((showDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

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

  if (loading) return null
  if (!weather) return null

  return (
    <div className="show-detail-weather-box">
      <span className="weather-forecast">
        <span className="weather-icon">{weatherIcon(weather.code)}</span>
        {' '}{weather.tempHigh}°/{weather.tempLow}°F
      </span>
    </div>
  )
}

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

// ===== ShowRow — controlled by parent (accordion) =====
function ShowRow({ show, isPast, expanded, onToggle, showKey }: {
  show: Show; isPast: boolean; expanded: boolean; onToggle: () => void; showKey: string
}) {
  const day = getDayOfWeek(show.date)
  const dateParts = splitShowDate(show.date)
  const ticketHref = show.url ? safeExternalHref(show.url) : null
  const photoHref = show.photo ? safeExternalHref(show.photo) : null

  return (
    <>
      <tr
        data-show-key={showKey}
        className={`show-row ${isPast ? 'past-show-row' : ''} ${show.soldOut ? 'sold-out' : ''} ${expanded ? 'show-row-expanded' : ''}`}
        onClick={onToggle}
      >
        <td className="col-date">{dateParts.main}</td>
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
          ) : ticketHref ? (
            <a href={ticketHref} target="_blank" rel="noopener noreferrer" style={{ border: 0 }}
              className="msb-btn" onClick={e => e.stopPropagation()}>TICKETS</a>
          ) : (
            <span style={{ color: '#888', fontSize: '0.85em' }}>TBA</span>
          )}
        </td>
      </tr>
      {expanded && (
        <tr className={`show-detail-row ${isPast ? 'past-show-row' : ''}`}>
          <td colSpan={4}>
            <div className="show-detail">
              {photoHref ? (
                <a href={photoHref} target="_blank" rel="noopener noreferrer"
                  className="show-thumb-link" onClick={e => e.stopPropagation()}>
                  <img src={photoHref} alt={show.venue} className="show-thumb" loading="lazy" />
                </a>
              ) : (
                <div className="show-thumb-link">
                  <div className="show-thumb" aria-hidden />
                </div>
              )}
              <div className="show-detail-info">
                <div className="show-detail-top">
                  <div className="show-detail-left">
                    <div><b>{show.venue}</b></div>
                    {show.address && (
                      <div className="show-detail-address">{show.address}</div>
                    )}
                    <div className="show-detail-sub">{day} · {show.city}</div>
                  </div>
                  <div className="show-detail-right">
                    <div className="show-detail-admission">
                      {show.price} · {show.ages}
                    </div>
                    {!isPast && (
                      <WeatherForecast lat={show.lat} lng={show.lng} date={show.date} />
                    )}
                  </div>
                </div>
                <div className="show-detail-doors">
                  Doors {show.doors}
                </div>
                {show.sup.length > 0 && (
                  <div className="show-detail-support">
                    w/ {show.sup.map(s => SUP_KEY[s]?.label || s).join(', ')}
                  </div>
                )}
                <div className="show-detail-maps">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(show.address || (show.venue + ', ' + show.city))}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >&#x1F4CD; Google Maps</a>
                  <span className="map-sep">·</span>
                  <a
                    href={`https://maps.apple.com/?q=${encodeURIComponent(show.venue)}&ll=${show.lat},${show.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >&#x1F34E; Apple Maps</a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ===== Mini Calendar (interactive) =====
function MiniCalendar({ shows, today, onSelectDate }: {
  shows: Show[]; today: string; onSelectDate: (dateKey: string) => void
}) {
  const showDateSet = new Map<string, Show>()
  for (const show of shows) {
    const d = new Date(show.date)
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
    showDateSet.set(key, show)
  }

  const dates = shows.map(s => new Date(s.date))
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

  const months: { year: number; month: number }[] = []
  const cur = new Date(Date.UTC(minDate.getUTCFullYear(), minDate.getUTCMonth(), 1))
  const end = new Date(Date.UTC(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), 1))
  while (cur <= end) {
    months.push({ year: cur.getUTCFullYear(), month: cur.getUTCMonth() })
    cur.setUTCMonth(cur.getUTCMonth() + 1)
  }

  const todayDate = new Date(today)
  const todayKey = `${todayDate.getUTCFullYear()}-${String(todayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(todayDate.getUTCDate()).padStart(2, '0')}`
  const monthStartTs = Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), 1)
  const defaultMonthIndex = (() => {
    const todayMonthIndex = months.findIndex(m => m.year === todayDate.getUTCFullYear() && m.month === todayDate.getUTCMonth())
    if (todayMonthIndex >= 0) return todayMonthIndex
    const nextMonthIndex = months.findIndex(m => Date.UTC(m.year, m.month, 1) >= monthStartTs)
    if (nextMonthIndex >= 0) return nextMonthIndex
    return Math.max(0, months.length - 1)
  })()
  const [monthIndex, setMonthIndex] = useState(defaultMonthIndex)

  if (months.length === 0) return null

  const clampedMonthIndex = Math.min(Math.max(monthIndex, 0), months.length - 1)
  const { year, month } = months[clampedMonthIndex]
  const firstDay = new Date(Date.UTC(year, month, 1))
  const startDow = firstDay.getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()

  const cells: JSX.Element[] = []
  for (let i = 0; i < startDow; i++) {
    cells.push(<td key={`e${i}`} className="cal-empty"></td>)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const show = showDateSet.get(key)
    const isToday = key === todayKey
    const isPast = key < todayKey
    let cls = 'cal-day'
    if (show) cls += show.soldOut ? ' cal-show cal-sold-out' : ' cal-show'
    if (isToday) cls += ' cal-today'
    if (isPast && show) cls += ' cal-past'
    cells.push(
      <td
        key={d}
        className={cls}
        title={show ? `${show.venue} — ${show.city}` : undefined}
        onClick={show ? () => onSelectDate(show.date) : undefined}
      >
        {d}
      </td>
    )
  }

  const rows: JSX.Element[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  const lastRow = rows[rows.length - 1]
  while (lastRow.length < 7) {
    lastRow.push(<td key={`p${lastRow.length}`} className="cal-empty"></td>)
  }

  return (
    <div className="shows-calendar">
      <div className="cal-month">
        <div className="cal-nav">
          <button
            type="button"
            className="cal-nav-btn"
            onClick={() => setMonthIndex(i => Math.max(0, i - 1))}
            disabled={clampedMonthIndex === 0}
            aria-label="Previous month"
          >
            &#8249;
          </button>
          <div className="cal-month-title">{MONTHS[month]} {year}</div>
          <button
            type="button"
            className="cal-nav-btn"
            onClick={() => setMonthIndex(i => Math.min(months.length - 1, i + 1))}
            disabled={clampedMonthIndex === months.length - 1}
            aria-label="Next month"
          >
            &#8250;
          </button>
        </div>
        <table className="cal-grid">
          <thead>
            <tr>
              <th>S</th><th>M</th><th>T</th><th>W</th><th>T</th><th>F</th><th>S</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => <tr key={i}>{row}</tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ===== Main export =====
export default function ShowsTable({ shows, today }: ShowsTableProps) {
  const [showPast, setShowPast] = useState(false)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const todayDate = new Date(today)
  todayDate.setHours(23, 59, 59, 999)

  const pastShows = shows.filter(s => parseShowDate(s.date) < todayDate)
  const upcomingShows = shows.filter(s => parseShowDate(s.date) >= todayDate)
  const dateHeaderYear = splitShowDate((upcomingShows[0] || shows[0])?.date || today).year || String(todayDate.getUTCFullYear())
  const hasPastShows = pastShows.length > 0
  const hasSupport = shows.some(s => s.sup.length > 0)

  function toggle(key: string) {
    setExpandedKey(prev => prev === key ? null : key)
  }

  // Scroll to a show row after React re-renders
  function scrollToRow(key: string) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelector(`[data-show-key="${key}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 60)
    })
  }

  // Calendar click → find show, expand it, scroll to it
  const handleCalendarClick = useCallback((dateStr: string) => {
    // Check upcoming first
    const upIdx = upcomingShows.findIndex(s => s.date === dateStr)
    if (upIdx >= 0) {
      const key = `upcoming-${upIdx}`
      setExpandedKey(prev => prev === key ? null : key)
      scrollToRow(key)
      return
    }
    // Check past shows
    const pastIdx = pastShows.findIndex(s => s.date === dateStr)
    if (pastIdx >= 0) {
      if (!showPast) setShowPast(true)
      const key = `past-${pastIdx}`
      setExpandedKey(prev => prev === key ? null : key)
      // Longer delay for past shows since they need to render first
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelector(`[data-show-key="${key}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
      })
    }
  }, [upcomingShows, pastShows, showPast])

  return (
    <div className="shows-layout">
      <div className="shows-main">
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
          <button className="past-shows-toggle" onClick={() => setShowPast(!showPast)} type="button">
            {showPast ? '▾ HIDE PAST SHOWS' : `▸ PAST SHOWS (${pastShows.length})`}
          </button>
        )}

        <table className="shows-table">
          <thead>
            <tr>
              <th>Date ({dateHeaderYear})</th>
              <th>City</th>
              <th>Venue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {showPast && pastShows.map((show, i) => {
              const key = `past-${i}`
              return <ShowRow key={key} show={show} isPast expanded={expandedKey === key} onToggle={() => toggle(key)} showKey={key} />
            })}
            {upcomingShows.map((show, i) => {
              const key = `upcoming-${i}`
              return <ShowRow key={key} show={show} isPast={false} expanded={expandedKey === key} onToggle={() => toggle(key)} showKey={key} />
            })}
          </tbody>
        </table>
      </div>

      <div className="shows-sidebar">
        <MiniCalendar shows={shows} today={today} onSelectDate={handleCalendarClick} />
      </div>
    </div>
  )
}
