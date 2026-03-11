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
          <span className="popup-titlebar-text">Lip Critic — New Album</span>
          <button className="popup-close" onClick={dismiss} aria-label="Close">X</button>
        </div>
        <div className="popup-body">
          <div className="popup-hero">THEFT WORLD</div>
          <div className="popup-subtitle">Out now on Partisan Records</div>

          <a
            href="https://lipcritic.lnk.to/theftworld"
            target="_blank"
            rel="noopener noreferrer"
            className="popup-cta"
          >
            PRE-SAVE ALBUM
          </a>
        </div>
      </div>
    </div>
  ) : <span data-popup="" style={{ display: 'none' }} />
}
