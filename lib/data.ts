import { readFileSync } from 'fs'
import { join } from 'path'
import type { Torrent, Category, Ad, Show } from './types'

const dataDir = join(process.cwd(), 'data')

export function getTorrents(): Torrent[] {
  const raw = readFileSync(join(dataDir, 'torrents.json'), 'utf-8')
  return JSON.parse(raw)
}

export function getCategories(): Category[] {
  const raw = readFileSync(join(dataDir, 'categories.json'), 'utf-8')
  return JSON.parse(raw)
}

export function getAds(): Ad[] {
  const raw = readFileSync(join(dataDir, 'ads.json'), 'utf-8')
  return JSON.parse(raw)
}

export function getShows(): Show[] {
  const raw = readFileSync(join(dataDir, 'shows.json'), 'utf-8')
  return JSON.parse(raw)
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
