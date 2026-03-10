const RELATIVE_PATH = /^\/(?!\/)/

export function safeHref(rawHref: string, allowRelative = true): string | null {
  const href = rawHref.trim()
  if (!href) return null

  if (allowRelative && RELATIVE_PATH.test(href)) {
    return href
  }

  try {
    const url = new URL(href)
    if (url.protocol === 'https:') {
      return url.toString()
    }
  } catch {
    return null
  }

  return null
}

export function safeExternalHref(rawHref: string): string | null {
  return safeHref(rawHref, false)
}
