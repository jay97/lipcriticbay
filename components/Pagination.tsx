interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  const sep = baseUrl.includes('?') ? '&' : '?'

  const pages: (number | string)[] = []

  // Always show first page
  pages.push(1)

  if (currentPage > 3) pages.push('...')

  // Pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 2) pages.push('...')

  // Always show last page
  if (totalPages > 1) pages.push(totalPages)

  return (
    <div className="pagination">
      <ul>
        {currentPage > 1 && (
          <>
            <li><a href={`${baseUrl}${sep}page=1`}>&laquo;&laquo;</a></li>
            <li><a href={`${baseUrl}${sep}page=${currentPage - 1}`}>&laquo;</a></li>
          </>
        )}
        {pages.map((p, i) => (
          <li key={i} className={p === currentPage ? 'active' : ''}>
            {p === '...' ? (
              <span>&hellip;</span>
            ) : p === currentPage ? (
              <span><b>{p}</b></span>
            ) : (
              <a href={`${baseUrl}${sep}page=${p}`}>{p}</a>
            )}
          </li>
        ))}
        {currentPage < totalPages && (
          <>
            <li><a href={`${baseUrl}${sep}page=${currentPage + 1}`}>&raquo;</a></li>
            <li><a href={`${baseUrl}${sep}page=${totalPages}`}>&raquo;&raquo;</a></li>
          </>
        )}
      </ul>
    </div>
  )
}
