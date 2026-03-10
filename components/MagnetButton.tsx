interface MagnetButtonProps {
  href: string
}

export default function MagnetButton({ href }: MagnetButtonProps) {
  return (
    <div className="download">
      <a href={href} title="MAGNET LINK">
        <img src="/img/icon-magnet.gif" alt="" width={12} height={12} style={{ border: 0, verticalAlign: 'middle', marginRight: 4 }} />
        MAGNET LINK
      </a>
    </div>
  )
}
