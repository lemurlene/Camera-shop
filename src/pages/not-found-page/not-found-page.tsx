import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page-content" data-testid="not-found-page">
      <Breadcrumbs />
      <div className="container">
        <h1 className="title title--h2">404 Page not found</h1>
        <Link to="/" className='btn btn--purple'>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
