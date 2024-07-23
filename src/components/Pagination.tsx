// Pagination.tsx
import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  totalRows: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
          className="border border-gray-300 rounded p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="border border-gray-300 rounded p-1"
        >
          &lt;&lt;
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="border border-gray-300 rounded p-1"
        >
          &lt;
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="border border-gray-300 rounded p-1"
        >
          &gt;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="border border-gray-300 rounded p-1"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  )
}

export default Pagination
