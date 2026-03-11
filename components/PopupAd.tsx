'use client'

import { useState, useEffect } from 'react'

export default function PopupAd() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('popup_dismissed')) {
      setShow(true)
    }
  }, [])

  function dismiss() {
    sessionStorage.setItem('popup_dismissed', '1')
    setShow(false)
  }

  return show ? (
    <div className="popup-overlay" onClick={dismiss}>
      <div className="popup-window" onClick={e => e.stopPropagation()}>
        <div className="popup-titlebar">
          <span className="popup-titlebar-text">THEFT WORLD — OUT NOW</span>
          <button className="popup-close" onClick={dismiss} aria-label="Close">X</button>
        </div>
        <div className="popup-body">
          <div className="popup-hero">THEFT WORLD</div>
          <div className="popup-subtitle">The new album from Lip Critic</div>

          <ul className="popup-features">
            <li>Free FLAC &amp; WAV Downloads</li>
            <li>Live Recordings &amp; Bootlegs</li>
            <li>Stems for Remixing</li>
            <li>Tour Dates &amp; Tickets</li>
          </ul>

          <a
            href="https://lipcritic.lnk.to/theftworld"
            target="_blank"
            rel="noopener noreferrer"
            className="popup-cta"
          >
            STREAM / BUY THEFT WORLD
          </a>

          <div className="popup-footer-text">
            lipcritic.com &middot; Free music, no ads, no tracking
          </div>
        </div>
      </div>
    </div>
  ) : <span data-popup="" style={{ display: 'none' }} />
}
