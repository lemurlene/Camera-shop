import Spinner from '../../components/spinner';

function LoadingPage(): JSX.Element {
  return (
    <div className="page-content">
      <div className="container">
        <h1 className="title title--h2">Page loading...</h1>
        <Spinner />
      </div>
    </div>
  );
}

export default LoadingPage;
