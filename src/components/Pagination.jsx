/* eslint-disable react/prop-types */
import { useState } from 'react';

import './Pagination.css';

export const Pagination = ({ totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </li>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <ul>
        <li onClick={() => handlePageChange(
          currentPage > 1 ? currentPage - 1 : 1
          )}>
          {'<'}
        </li>
        {renderPageNumbers()}
        <li
          onClick={() => handlePageChange(
            currentPage < totalPages ? currentPage + 1 : totalPages,
            )}>
          {'>'}
        </li>
      </ul>
    </div>
  );
};
