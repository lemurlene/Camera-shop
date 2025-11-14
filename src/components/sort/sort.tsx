import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeSortType, changeSortOrder } from '../../store/sort/sort.slice';
import { selectSortType, selectSortOrder } from '../../store/sort/sort.selector';
import { SortTypes, SortOrders } from './const';
import { SortType, SortOrder } from './type';

function Sort(): JSX.Element {
  const dispatch = useAppDispatch();
  const currentSortType = useAppSelector(selectSortType);
  const currentSortOrder = useAppSelector(selectSortOrder);

  const handleSortTypeChange = (type: SortType) => {
    dispatch(changeSortType(type));
  };

  const handleSortOrderChange = (order: SortOrder) => {
    dispatch(changeSortOrder(order));
  };

  return (
    <div className="catalog-sort">
      <form action="#">
        <div className="catalog-sort__inner">
          <p className="title title--h5">Сортировать:</p>
          <div className="catalog-sort__type">
            <div className="catalog-sort__btn-text">
              <input
                type="radio"
                id="sortPrice"
                name="sort"
                checked={currentSortType === SortTypes.Price}
                onChange={() => handleSortTypeChange(SortTypes.Price)}
              />
              <label htmlFor="sortPrice">по цене</label>
            </div>
            <div className="catalog-sort__btn-text">
              <input
                type="radio"
                id="sortPopular"
                name="sort"
                checked={currentSortType === SortTypes.Popular}
                onChange={() => handleSortTypeChange(SortTypes.Popular)}
              />
              <label htmlFor="sortPopular">по популярности</label>
            </div>
          </div>
          <div className="catalog-sort__order">
            <div className="catalog-sort__btn catalog-sort__btn--up">
              <input
                type="radio"
                id="up"
                name="sort-icon"
                checked={currentSortOrder === SortOrders.Asc}
                onChange={() => handleSortOrderChange(SortOrders.Asc)}
                aria-label="По возрастанию"
              />
              <label htmlFor="up">
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-sort"></use>
                </svg>
              </label>
            </div>
            <div className="catalog-sort__btn catalog-sort__btn--down">
              <input
                type="radio"
                id="down"
                name="sort-icon"
                checked={currentSortOrder === SortOrders.Desc}
                onChange={() => handleSortOrderChange(SortOrders.Desc)}
                aria-label="По убыванию"
              />
              <label htmlFor="down">
                <svg width="16" height="14" aria-hidden="true">
                  <use xlinkHref="#icon-sort"></use>
                </svg>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Sort;

