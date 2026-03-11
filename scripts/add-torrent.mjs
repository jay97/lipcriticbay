#!/usr/bin/env node

/**
 * CLI script to add a new torrent to data/torrents.json
 * Run: node scripts/add-torrent.mjs
 *
 * Validates all inputs, auto-generates id/catName/uploadedRaw,
 * checks for duplicate hashes, and writes back with formatting.
 */

import { readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TORRENTS_PATH = resolve(__dirname, '../data/torrents.json')
const CATEGORIES_PATH = resolve(__dirname, '../data/categories.json')

const DEFAULT_TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.demonii.com:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'udp://open.stealth.si:80/announce',
  'udp://exodus.desync.com:6969/announce',
]

function loadJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function buildCategoryMap(categories) {
  const map = {}
  for (const cat of categories) {
    map[cat.id] = cat.name
    for (const sub of cat.sub) {
      map[sub.id] = `${cat.name} > ${sub.name}`
    }
  }
  return map
}

function formatUploadedRaw(dateStr) {
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const mm = months[d.getMonth()]
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${mm} ${dd}, ${d.getFullYear()} ${hh}:${min}`
}

function ask(rl, question) {
  return new Promise(resolve => rl.question(question, resolve))
}

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })

  const categories = loadJSON(CATEGORIES_PATH)
  const catMap = buildCategoryMap(categories)
  const torrents = loadJSON(TORRENTS_PATH)

  console.log('\n=== Add New Torrent ===\n')

  // Show categories
  console.log('Available categories:')
  for (const cat of categories) {
    console.log(`  ${cat.id} — ${cat.name}`)
    for (const sub of cat.sub) {
      console.log(`    ${sub.id} — ${sub.name}`)
    }
  }
  console.log()

  // Collect inputs
  const name = (await ask(rl, 'Name: ')).trim()
  if (!name) { console.error('Error: Name is required.'); rl.close(); process.exit(1) }

  const catIdStr = (await ask(rl, 'Category ID: ')).trim()
  const catId = parseInt(catIdStr, 10)
  if (!catMap[catId]) { console.error(`Error: Unknown category ID "${catIdStr}".`); rl.close(); process.exit(1) }

  const hash = (await ask(rl, 'Info hash (40-char hex): ')).trim().toLowerCase()
  if (!/^[a-f0-9]{40}$/.test(hash)) { console.error('Error: Hash must be exactly 40 hex characters.'); rl.close(); process.exit(1) }

  // Duplicate check
  if (torrents.some(t => t.hash === hash)) {
    console.error('Error: A torrent with this hash already exists.')
    rl.close()
    process.exit(1)
  }

  const size = (await ask(rl, 'Size (e.g. "320 MB"): ')).trim()
  if (!size) { console.error('Error: Size is required.'); rl.close(); process.exit(1) }

  const sizeBytesStr = (await ask(rl, 'Size in bytes: ')).trim()
  const sizeBytes = parseInt(sizeBytesStr, 10)
  if (isNaN(sizeBytes) || sizeBytes <= 0) { console.error('Error: Invalid size in bytes.'); rl.close(); process.exit(1) }

  const dateInput = (await ask(rl, 'Date (YYYY-MM-DD, default: today): ')).trim()
  const date = dateInput || new Date().toISOString().split('T')[0]
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { console.error('Error: Date must be YYYY-MM-DD format.'); rl.close(); process.exit(1) }

  const uploader = (await ask(rl, 'Uploader (default: "LipCritic"): ')).trim() || 'LipCritic'

  const vipInput = (await ask(rl, 'VIP? (y/N): ')).trim().toLowerCase()
  const vip = vipInput === 'y' || vipInput === 'yes'

  const trustedInput = (await ask(rl, 'Trusted? (Y/n): ')).trim().toLowerCase()
  const trusted = trustedInput !== 'n' && trustedInput !== 'no'

  const desc = (await ask(rl, 'Description: ')).trim()

  const filesInput = (await ask(rl, 'Files (comma-separated, or empty): ')).trim()
  const files = filesInput ? filesInput.split(',').map(f => f.trim()).filter(Boolean) : []

  const trackersInput = (await ask(rl, 'Trackers (comma-separated, or Enter for defaults): ')).trim()
  const trackers = trackersInput
    ? trackersInput.split(',').map(t => t.trim()).filter(Boolean)
    : DEFAULT_TRACKERS

  // Build entry
  const maxId = torrents.reduce((max, t) => Math.max(max, t.id), 0)
  const newTorrent = {
    id: maxId + 1,
    name,
    catId,
    catName: catMap[catId],
    hash,
    size,
    sizeBytes,
    se: 0,
    le: 0,
    date,
    uploadedRaw: formatUploadedRaw(date),
    uploader,
    vip,
    trusted,
    desc: desc || '',
    files,
    trackers,
  }

  // Preview
  console.log('\n--- New Torrent Entry ---')
  console.log(JSON.stringify(newTorrent, null, 2))

  const confirm = (await ask(rl, '\nSave? (Y/n): ')).trim().toLowerCase()
  if (confirm === 'n' || confirm === 'no') {
    console.log('Aborted.')
    rl.close()
    process.exit(0)
  }

  // Write
  torrents.push(newTorrent)
  writeFileSync(TORRENTS_PATH, JSON.stringify(torrents, null, 2) + '\n', 'utf-8')
  console.log(`\nSaved! Torrent #${newTorrent.id} added to ${TORRENTS_PATH}`)
  console.log('Remember to commit and push to deploy.')

  rl.close()
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
