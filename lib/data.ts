import { readFileSync } from 'fs'
import { join } from 'path'
import type { Torrent, Category, Ad, Show } from './types'

const dataDir = join(process.cwd(), 'data')
let torrentsCache: Torrent[] | null = null
let categoriesCache: Category[] | null = null
let adsCache: Ad[] | null = null
let showsCache: Show[] | null = null

function loadJson<T>(filename: string): T {
  const raw = readFileSync(join(dataDir, filename), 'utf-8')
  return JSON.parse(raw) as T
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map(v => v.trim()).filter(Boolean))]
}

function extractFileLikeLines(desc: string): string[] {
  return uniqueStrings(
    desc
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => /[A-Za-z0-9_\-./ ]+\.[A-Za-z0-9]{1,6}$/.test(line))
  )
}

function normalizeFileList(input: unknown, desc: string): string[] {
  if (Array.isArray(input)) {
    return uniqueStrings(input.filter((item): item is string => typeof item === 'string'))
  }
  if (typeof input === 'string') {
    const chunks = input.includes('\n') ? input.split(/\r?\n/) : input.split(',')
    return uniqueStrings(chunks)
  }
  return extractFileLikeLines(desc)
}

type RawTorrent = Omit<Torrent, 'files'> & { files?: unknown; fileList?: unknown }

function normalizeTorrent(torrent: RawTorrent): Torrent {
  const filesSource = torrent.files ?? torrent.fileList
  return {
    ...torrent,
    files: normalizeFileList(filesSource, typeof torrent.desc === 'string' ? torrent.desc : ''),
  }
}

export function getTorrents(): Torrent[] {
  if (!torrentsCache) {
    const rawTorrents = loadJson<RawTorrent[]>('torrents.json')
    torrentsCache = rawTorrents.map(normalizeTorrent)
  }
  return torrentsCache
}

export function getCategories(): Category[] {
  if (!categoriesCache) {
    categoriesCache = loadJson<Category[]>('categories.json')
  }
  return categoriesCache
}

export function getAds(): Ad[] {
  if (!adsCache) {
    adsCache = loadJson<Ad[]>('ads.json')
  }
  return adsCache
}

export function getShows(): Show[] {
  if (!showsCache) {
    showsCache = loadJson<Show[]>('shows.json')
  }
  return showsCache
}

export function getTorrentById(id: number): Torrent | undefined {
  return getTorrents().find(t => t.id === id)
}

export function getTorrentsByCategory(catId: number): Torrent[] {
  const torrents = getTorrents()
  // Top-level category: match range (e.g. 100 matches 100-199)
  if (catId % 100 === 0) {
    const min = catId
    const max = catId + 99
    return torrents.filter(t => t.catId >= min && t.catId <= max)
  }
  return torrents.filter(t => t.catId === catId)
}
