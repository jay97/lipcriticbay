export interface Torrent {
  id: number
  name: string
  catId: number
  catName: string
  hash: string
  size: string
  sizeBytes: number
  se: number
  le: number
  date: string
  uploadedRaw: string
  uploader: string
  vip: boolean
  trusted: boolean
  desc: string
  files: string[]
  trackers: string[]
}

export interface SubCategory {
  id: number
  name: string
}

export interface Category {
  id: number
  name: string
  sub: SubCategory[]
}

export interface Ad {
  title: string
  html: string
}

export interface Show {
  date: string
  city: string
  venue: string
  address?: string
  sup: string[]
  doors: string
  ages: string
  price: string
  url: string
  lat: number
  lng: number
  photo: string
  soldOut?: boolean
  tags?: string[]
}

export interface PeerData {
  [hash: string]: { se: number; le: number }
}

export interface ScrapeCache {
  lastScrape: string
  peers: PeerData
}
