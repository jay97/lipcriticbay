import { getAds } from '@/lib/data'
import { safeHref } from '@/lib/url'

export default function AdsSidebar() {
  const ads = getAds()

  return (
    <div className="ads-sidebar">
      {ads.map((ad, i) => (
        <div key={i} className="ad-block">
          <div className="ad-block-title">{ad.title}</div>
          <div>
            {ad.lines.map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
            {ad.links && ad.links.length > 0 && (
              <div style={{ marginTop: 6 }}>
                {ad.links.map((link, linkIdx) => {
                  const href = safeHref(link.href, !link.external)
                  if (!href) return null
                  return (
                    <span key={`${link.label}-${linkIdx}`} style={{ marginRight: 8 }}>
                      <a
                        href={href}
                        className="msb-btn"
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        style={{ border: 0 }}
                      >
                        {link.label}
                      </a>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
