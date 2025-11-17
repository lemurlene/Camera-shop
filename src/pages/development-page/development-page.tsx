import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/enum';
import Breadcrumbs from '../../components/breadcrumbs';

function DevelopmentPage(): JSX.Element {
  return (
    <div className="page-content">
      <Breadcrumbs />
      <div className="container">
        <h1 className="title title--h2">Cтраница в разработке</h1>
        <Link to={AppRoute.Root} className='btn btn--purple'>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}

export default DevelopmentPage;
