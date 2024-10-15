import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  paginate
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      // If total pages are 7 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage > 3) {
        // Add ellipsis if current page is more than 3
        pageNumbers.push('...');
      }
      
      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);
      
      // Adjust if at the start or end
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        // Add ellipsis if current page is less than total pages - 2
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages-3);
    }
    return pageNumbers;
  };

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {currentPage > 1 && (
          <li>
            <button
              onClick={() => paginate(currentPage - 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700"
            >
              Previous
            </button>
          </li>
        )}
        {getPageNumbers().map((number, index) => (
          <li key={index}>
            {number === '...' ? (
              <span className="px-3 py-1 text-zinc-300">...</span>
            ) : (
              <button
                onClick={() => paginate(number as number)}
                className={`px-3 py-1 rounded ${
                  currentPage === number
                    ? 'bg-violet-700 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-violet-700'
                }`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
        {currentPage < totalPages && (
          <li>
            <button
              onClick={() => paginate(currentPage + 1)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-violet-700"
            >
              Next
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;