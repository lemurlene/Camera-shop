import { Helmet } from 'react-helmet-async';
import Spinner from '../../components/spinner';

function LoadingPage(): JSX.Element {
  return (
    <>
      <Helmet>
        <title>Camera-shop: Page loading</title>
      </Helmet>
      <main data-testid="loading-page">
        <div className="page-content">
          <div className="container">
            <h1 className="title title--h2">Page loading...</h1>
            <Spinner />
          </div>
        </div>
      </main >
    </>
  );
}

export default LoadingPage;
