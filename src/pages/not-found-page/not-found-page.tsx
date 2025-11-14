import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs';

function NotFoundPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>Camera-shop: Page not found</title>
      </Helmet>
      <main data-testid="not-found-page">
        <div className="page-content">
          <Breadcrumbs />
          <div className="container">
            <h1 className="title title--h2">404 Page not found</h1>
            <Link to="/" className='btn btn--purple'>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </main >
    </>
  );
}

export default NotFoundPage;
