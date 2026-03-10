import Header from '@/components/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merch',
  description: 'Lip Critic merch is coming soon.',
}

export default function MerchPage() {
  return (
    <>
      <Header hideSearchOnMobile />
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left', padding: '0 1em' }}>
        <h2><b>Merch</b></h2>
        <div className="coming-soon-wrap">
          <p className="coming-soon-text">COMING SOON</p>
        </div>
      </div>
    </>
  )
}
