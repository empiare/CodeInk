export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        上一页
      </button>
      {start > 0 && (
        <>
          <button className="pagination__btn" onClick={() => onPageChange(0)}>1</button>
          {start > 1 && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>...</span>}
          <button className="pagination__btn" onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        下一页
      </button>
    </nav>
  );
}
