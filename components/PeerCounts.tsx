'use client'

import { useEffect } from 'react'

export default function PeerCounts() {
  useEffect(() => {
    let stopped = false

    function collectVisibleHashes(): string[] {
      const hashes = new Set<string>()
      document.querySelectorAll('[data-hash][data-field]').forEach(el => {
        const hash = el.getAttribute('data-hash')?.toLowerCase()
        if (hash && /^[a-f0-9]{40}$/.test(hash)) {
          hashes.add(hash)
        }
      })
      return [...hashes].slice(0, 80)
    }

    async function fetchPeers() {
      if (document.hidden || stopped) return
      try {
        const hashes = collectVisibleHashes()
        if (hashes.length === 0) return

        const query = encodeURIComponent(hashes.join(','))
        const res = await fetch(`/api/peers?hashes=${query}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()

        // Stop polling if running on serverless (peers are always 0)
        if (data.serverless) {
          stopped = true
          return
        }

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
    const intervalMs = window.matchMedia('(max-width: 768px)').matches ? 120000 : 60000
    const interval = setInterval(() => {
      if (!stopped) fetchPeers()
    }, intervalMs)
    const onVisible = () => {
      if (!document.hidden && !stopped) fetchPeers()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return null
}
