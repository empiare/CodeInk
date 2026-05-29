export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnClass = "inline-flex items-center justify-center min-w-8 h-8 px-2 text-xs border rounded cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const inactiveClass = "text-stone-600 dark:text-stone-400 bg-transparent border-stone-200 dark:border-stone-800 hover:border-amber-700 dark:hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400";
  const activeClass = "text-white bg-amber-700 dark:bg-amber-500 border-amber-700 dark:border-amber-500";

  return (
    <nav className="flex justify-center items-center gap-1 my-8">
      <button
        className={`${btnClass} ${inactiveClass}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        上一页
      </button>
      {start > 0 && (
        <>
          <button className={`${btnClass} ${inactiveClass}`} onClick={() => onPageChange(0)}>1</button>
          {start > 1 && <span className="text-stone-400 dark:text-stone-500 text-xs">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`${btnClass} ${p === page ? activeClass : inactiveClass}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span className="text-stone-400 dark:text-stone-500 text-xs">...</span>}
          <button className={`${btnClass} ${inactiveClass}`} onClick={() => onPageChange(totalPages - 1)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        className={`${btnClass} ${inactiveClass}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        下一页
      </button>
    </nav>
  );
}
