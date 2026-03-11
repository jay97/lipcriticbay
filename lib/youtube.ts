import type { Video } from './types'

const CHANNEL_ID = 'UCwH5vyrF2i7HZHOckojO6rg'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

/**
 * Fetch fresh video data from YouTube's public RSS feed.
 * Returns up to 15 most recent videos (RSS feed limit).
 * Falls back to null on any error so callers can use static data.
 */
export async function fetchYouTubeVideos(): Promise<Video[] | null> {
  try {
    const res = await fetch(FEED_URL, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null

    const xml = await res.text()
    return parseYouTubeFeed(xml)
  } catch {
    return null
  }
}

/**
 * Parse YouTube Atom feed XML into Video objects.
 * Uses simple regex parsing — the feed format is very stable.
 */
function parseYouTubeFeed(xml: string): Video[] {
  const videos: Video[] = []
  const entryPattern = /<entry>([\s\S]*?)<\/entry>/g
  let match

  while ((match = entryPattern.exec(xml)) !== null) {
    const entry = match[1]

    const videoId = extractTag(entry, 'yt:videoId')
    const title = decodeXmlEntities(extractTag(entry, 'title') || '')
    const published = extractTag(entry, 'published') || ''
    const description = decodeXmlEntities(
      extractTag(entry, 'media:description') || ''
    )
    const viewsStr = extractAttr(entry, 'media:statistics', 'views') || '0'
    const viewCount = parseInt(viewsStr, 10) || 0

    if (!videoId || !title) continue

    videos.push({
      id: videoId,
      title,
      duration: '', // RSS feed doesn't include duration
      durationSeconds: 0,
      views: formatViews(viewCount),
      viewCount,
      uploadDate: published,
      uploadLabel: relativeDate(published),
      description: truncate(description, 150),
      channel: 'Lip Critic',
    })
  }

  return videos
}

function extractTag(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)
  const m = re.exec(xml)
  return m ? m[1].trim() : null
}

function extractAttr(
  xml: string,
  tag: string,
  attr: string
): string | null {
  const re = new RegExp(`<${tag}[^>]*?${attr}="([^"]*)"`)
  const m = re.exec(xml)
  return m ? m[1] : null
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1).replace(/\.0$/, '')}K views`.replace(/\.0K/, 'K')
  return `${n.toLocaleString()} views`
}

function relativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'just now'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  const years = Math.floor(diffDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max).replace(/\s+\S*$/, '') + '...'
}
