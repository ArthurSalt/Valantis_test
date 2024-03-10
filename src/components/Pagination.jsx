/* eslint-disable react/prop-types */


import './Pagination.css';

export const Pagination = ({ totalItems, itemsPerPage, handlePageChange, currentPage}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
          currentPage > 1 ? currentPage - 1 : totalPages
          )}>
          {'<'}
        </li>
        {renderPageNumbers()}
        <li
          onClick={() => handlePageChange(
            currentPage < totalPages ? currentPage + 1 : 1,
            )}>
          {'>'}
        </li>
      </ul>
    </div>
  );
};

