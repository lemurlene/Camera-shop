import Spinner from '../spinner/spinner';

function LoaderOverlay(): JSX.Element {
  return (
    <div className="modal is-active">
      <div className="modal__wrapper">
        <Spinner />
        <p className="title title--h4">Проверка данных...</p>
      </div>
    </div>
  );
}

export default LoaderOverlay;

