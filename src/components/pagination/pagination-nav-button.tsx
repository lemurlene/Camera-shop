import { Link } from 'react-router-dom';

interface PaginationNavButtonProps {
  type: 'prev' | 'next';
  targetPage: number;
  createPageUrl: (page: number) => string;
  onPageClick: (page: number) => void;
}

function PaginationNavButton({
  type,
  targetPage,
  createPageUrl,
  onPageClick
}: PaginationNavButtonProps): JSX.Element {
  const label = type === 'prev' ? 'Назад' : 'Далее';

  return (
    <li className="pagination__item">
      <Link
        className="pagination__link pagination__link--text"
        to={createPageUrl(targetPage)}
        onClick={() => onPageClick(targetPage)}
      >
        {label}
      </Link>
    </li>
  );
}

export default PaginationNavButton;
