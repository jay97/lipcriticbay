const DEFAULT_TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.demonii.com:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'udp://open.stealth.si:80/announce',
  'udp://exodus.desync.com:6969/announce',
]

export function generateMagnet(
  hash: string,
  name: string,
  trackers?: string[]
): string {
  const params = new URLSearchParams()
  params.set('xt', `urn:btih:${hash}`)
  params.set('dn', name)

  const trList = trackers && trackers.length > 0 ? trackers : DEFAULT_TRACKERS
  for (const tr of trList) {
    params.append('tr', tr)
  }

  return `magnet:?${params.toString()}`
}
