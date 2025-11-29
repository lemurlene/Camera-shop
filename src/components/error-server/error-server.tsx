import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/enum';

type ErrorServerProps = {
  mainPage?: boolean;
}

function ErrorServer({ mainPage = false }: ErrorServerProps): JSX.Element | null {
  return (
    <>
      <Helmet>
        <title>Camera-shop: Error server</title>
      </Helmet>
      <main data-testid="error-server">
        <div className="page-content">
          <div className="container">
            <h1 className="title title--h2">Error server</h1>
            <h2 className="title title--h3">Что-то пошло не так. Попробуйте перезагрузить страницу.</h2>
            {!mainPage &&
              <Link to={AppRoute.Root} className='btn btn--purple'>
                Вернуться на главную
              </Link>}
          </div>
        </div>
      </main >
    </>
  );
}


export default ErrorServer;
