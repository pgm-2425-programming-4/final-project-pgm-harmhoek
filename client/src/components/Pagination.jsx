import { useState } from 'react';

export default function Pagination({
  page,
  pageCount,
  setPage,
  pageSize,
  setPageSize,
}) {
  const [pageSizes] = useState([2, 5, 10, 20]);

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < pageCount) setPage(page + 1);
  };

  return (
    <div className="pagination-container">
      <div className="pagination-buttons">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            disabled={n === page}
            className={n === page ? 'active' : ''}
          >
            {n}
          </button>
        ))}

        <button onClick={handleNext} disabled={page === pageCount}>Next</button>
      </div>

      <div className="page-size-select">
        <label htmlFor="pageSize">Toon:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1) // reset naar eerste pagina
          }}
        >
          <option value={2}>2</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
        </select>
      </div>
    </div>
  );
}
