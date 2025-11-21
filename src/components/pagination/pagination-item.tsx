import { Link } from 'react-router-dom';

interface PaginationItemProps {
  page: number | string;
  currentPage: number;
  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

function PaginationItem({
  page,
  currentPage,
  createPageUrl,
  onPageClick,
}: PaginationItemProps): JSX.Element {
  if (page === '...') {
    return (
      <li className="pagination__item">
        <span className="pagination__link pagination__link--text">...</span>
      </li>
    );
  }

  const pageNumber = page as number;
  const isActive = currentPage === pageNumber;

  return (
    <li className="pagination__item">
      <Link
        className={`pagination__link ${isActive ? 'pagination__link--active' : ''}`}
        to={createPageUrl(pageNumber)}
        onClick={() => onPageClick(pageNumber)}
      >
        {pageNumber}
      </Link>
    </li>
  );
}

export default PaginationItem;
