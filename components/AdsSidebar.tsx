import { getAds } from '@/lib/data'

export default function AdsSidebar() {
  const ads = getAds()

  return (
    <div className="ads-sidebar">
      {ads.map((ad, i) => (
        <div key={i} className="ad-block">
          <div className="ad-block-title">{ad.title}</div>
          <div dangerouslySetInnerHTML={{ __html: ad.html }} />
        </div>
      ))}
    </div>
  )
}
