export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  const btnClass = "inline-flex items-center justify-center min-w-9 h-9 px-3 text-xs font-medium rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
  const inactiveClass = "bg-white dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-700/40 text-stone-600 dark:text-stone-400 hover:border-amber-300 dark:hover:border-amber-600 hover:text-amber-700 dark:hover:text-amber-400 hover:shadow-sm";
  const activeClass = "bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-500 dark:to-amber-600 text-white border-none shadow-sm";

  return (
    <nav className="flex justify-center items-center gap-1.5">
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
          {start > 1 && <span className="text-stone-400 dark:text-stone-500 text-xs px-1">...</span>}
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
          {end < totalPages - 2 && <span className="text-stone-400 dark:text-stone-500 text-xs px-1">...</span>}
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
