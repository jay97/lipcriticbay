'use client'

import { useEffect } from 'react'

export default function PeerCounts() {
  useEffect(() => {
    async function fetchPeers() {
      try {
        const res = await fetch('/api/peers')
        if (!res.ok) return
        const data = await res.json()
        const peers = data.peers || {}

        // Update all SE/LE cells in the DOM
        document.querySelectorAll('[data-hash][data-field]').forEach(el => {
          const hash = el.getAttribute('data-hash')?.toLowerCase()
          const field = el.getAttribute('data-field')
          if (hash && field && peers[hash]) {
            el.textContent = String(peers[hash][field] ?? el.textContent)
          }
        })
      } catch {
        // Silently fail - cached values remain
      }
    }

    fetchPeers()
    // Re-fetch every 60 seconds
    const interval = setInterval(fetchPeers, 60000)
    return () => clearInterval(interval)
  }, [])

  return null
}
