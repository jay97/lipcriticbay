import dgram from 'dgram'
import { URL } from 'url'

interface ScrapeResult {
  seeders: number
  leechers: number
  completed: number
}

function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, 'hex')
}

function randomTransactionId(): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32BE(Math.floor(Math.random() * 0xFFFFFFFF))
  return buf
}

const CONNECTION_ID = Buffer.from([0x00, 0x00, 0x04, 0x17, 0x27, 0x10, 0x19, 0x80])

export async function udpScrape(
  trackerUrl: string,
  infoHashes: string[]
): Promise<Map<string, ScrapeResult>> {
  const results = new Map<string, ScrapeResult>()

  // Filter out placeholder hashes
  const validHashes = infoHashes.filter(h => /^[a-fA-F0-9]{40}$/.test(h))
  if (validHashes.length === 0) return results

  let url: URL
  try {
    url = new URL(trackerUrl)
  } catch {
    return results
  }

  const host = url.hostname
  const port = parseInt(url.port) || 1337

  return new Promise((resolve) => {
    const socket = dgram.createSocket('udp4')
    const timeout = setTimeout(() => {
      socket.close()
      resolve(results)
    }, 15000)

    let state: 'connecting' | 'scraping' = 'connecting'
    const txnId = randomTransactionId()

    socket.on('error', () => {
      clearTimeout(timeout)
      socket.close()
      resolve(results)
    })

    socket.on('message', (msg) => {
      if (msg.length < 8) return

      const action = msg.readUInt32BE(0)
      const responseTxn = msg.slice(4, 8)

      if (!responseTxn.equals(txnId)) return

      if (state === 'connecting' && action === 0) {
        // Connect response - extract connection_id and send scrape
        if (msg.length < 16) return
        const connectionId = msg.slice(8, 16)

        state = 'scraping'

        // Build scrape request
        // connection_id (8) + action=2 (4) + transaction_id (4) + info_hashes (20 each)
        const scrapeReq = Buffer.alloc(16 + validHashes.length * 20)
        connectionId.copy(scrapeReq, 0)
        scrapeReq.writeUInt32BE(2, 8) // action = scrape
        txnId.copy(scrapeReq, 12)

        for (let i = 0; i < validHashes.length; i++) {
          hexToBuffer(validHashes[i]).copy(scrapeReq, 16 + i * 20)
        }

        socket.send(scrapeReq, 0, scrapeReq.length, port, host)
      } else if (state === 'scraping' && action === 2) {
        // Scrape response
        // For each hash: seeders (4) + completed (4) + leechers (4) = 12 bytes
        const data = msg.slice(8)
        for (let i = 0; i < validHashes.length; i++) {
          const offset = i * 12
          if (offset + 12 > data.length) break

          results.set(validHashes[i].toLowerCase(), {
            seeders: data.readUInt32BE(offset),
            completed: data.readUInt32BE(offset + 4),
            leechers: data.readUInt32BE(offset + 8),
          })
        }

        clearTimeout(timeout)
        socket.close()
        resolve(results)
      }
    })

    // Send connect request
    const connectReq = Buffer.alloc(16)
    CONNECTION_ID.copy(connectReq, 0)
    connectReq.writeUInt32BE(0, 8) // action = connect
    txnId.copy(connectReq, 12)

    socket.send(connectReq, 0, 16, port, host, (err) => {
      if (err) {
        clearTimeout(timeout)
        socket.close()
        resolve(results)
      }
    })
  })
}

export async function scrapeAll(
  torrents: { hash: string; trackers: string[] }[]
): Promise<Map<string, { se: number; le: number }>> {
  const allResults = new Map<string, { se: number; le: number }>()

  // Group hashes by tracker
  const trackerMap = new Map<string, string[]>()
  for (const t of torrents) {
    if (!/^[a-fA-F0-9]{40}$/.test(t.hash)) continue
    for (const tracker of t.trackers) {
      if (!trackerMap.has(tracker)) trackerMap.set(tracker, [])
      trackerMap.get(tracker)!.push(t.hash)
    }
  }

  // Scrape each tracker in parallel
  const promises = Array.from(trackerMap.entries()).map(
    async ([tracker, hashes]) => {
      try {
        const results = await udpScrape(tracker, hashes)
        for (const [hash, data] of results) {
          const existing = allResults.get(hash)
          if (!existing || data.seeders > existing.se) {
            allResults.set(hash, { se: data.seeders, le: data.leechers })
          }
        }
      } catch {
        // Tracker failure is non-fatal
      }
    }
  )

  await Promise.all(promises)
  return allResults
}
