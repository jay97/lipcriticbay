import { getMerch } from '@/lib/data'
import { safeExternalHref } from '@/lib/url'
import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Lip Critic merch — tees, hoodies, totes, and more. Ships from Big Cartel.',
}

export default function MerchPage() {
  const allItems = getMerch()
  const available = allItems.filter(i => !i.soldOut)
  const soldOut = allItems.filter(i => i.soldOut)

  return (
    <>
      <Header hideSearchOnMobile />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', padding: '0 1em' }}>
        <h2><b>Merch</b></h2>
        <p className="merch-subhead">
          All items ship from{' '}
          <a href={safeExternalHref('https://lipcriticshop.bigcartel.com/') || '#'} target="_blank" rel="noopener noreferrer">
            lipcriticshop.bigcartel.com
          </a>
        </p>

        <div className="merch-grid">
          {available.map(item => (
            <a
              key={item.id}
              href={safeExternalHref(item.url) || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="merch-card"
            >
              <div className="merch-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="merch-img"
                  loading="lazy"
                  width={300}
                  height={300}
                />
                {item.tag && <span className="merch-tag">{item.tag}</span>}
              </div>
              <div className="merch-info">
                <div className="merch-name">{item.name}</div>
                <div className="merch-price">${item.price}</div>
              </div>
            </a>
          ))}
        </div>

        {soldOut.length > 0 && (
          <>
            <h3 className="merch-sold-out-heading">Sold Out</h3>
            <div className="merch-grid merch-grid-sold-out">
              {soldOut.map(item => (
                <a
                  key={item.id}
                  href={safeExternalHref(item.url) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="merch-card merch-card-sold-out"
                >
                  <div className="merch-img-wrap">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="merch-img"
                      loading="lazy"
                      width={300}
                      height={300}
                    />
                    <span className="merch-tag merch-tag-sold-out">SOLD OUT</span>
                  </div>
                  <div className="merch-info">
                    <div className="merch-name">{item.name}</div>
                    <div className="merch-price">${item.price}</div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
