import { useMemo, useEffect } from 'react';
import { useAppSelector, useFilteredProducts, usePagination, usePriceSync } from '../../hooks';
import { selectOffersPromo } from '../../store/offers-promo/offers-promo.selector';
import BannerPromo from '../../components/banner-promo';
import Breadcrumbs from '../../components/breadcrumbs';
import СatalogFiltersMemo from '../../components/catalog-filters';
import MainEmpty from './main-empty';
import Sort from '../../components/sort';
import { OfferListMemo } from '../../components/offer';
import Pagination from '../../components/pagination/pagination';
import { FilterSyncWrapper } from '../../components/wrappers/filter-sync-wrapper';
import { useUrl } from '../../contexts/url-context';
import { Setting } from '../../const/const.ts';

function MainPageContent(): JSX.Element {
  const { filteredProducts, filteredPriceRange } = useFilteredProducts();
  const offersPromo = useAppSelector(selectOffersPromo);
  const { setParam } = useUrl();
  usePriceSync();

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex
  } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage: Setting.CardsCountOnCatalog,
  });

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setParam('page', null);
    }
  }, [currentPage, totalPages, setParam]);

  const paginatedProducts = useMemo(() => {
    if (currentPage > totalPages) {
      return [];
    }
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex, currentPage, totalPages]);

  const isEmpty = filteredProducts.length === 0;

  return (
    <>
      <BannerPromo offersPromo={offersPromo} />
      <div className="page-content">
        <Breadcrumbs />
        <section className="catalog">
          <div className="container">
            <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
            <div className="page-content__columns">
              <div className="catalog__aside">
                <СatalogFiltersMemo priceRange={filteredPriceRange} />
              </div>
              <div className="catalog__content">
                <Sort />
                {isEmpty && <MainEmpty />}
                {!isEmpty && (
                  <>
                    <div className="cards catalog__cards">
                      <OfferListMemo offers={paginatedProducts} />
                    </div>
                    <Pagination totalItems={filteredProducts.length} itemsPerPage={Setting.CardsCountOnCatalog} />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div >
    </>
  );
}

function MainPage() {
  return (
    <FilterSyncWrapper>
      <MainPageContent />
    </FilterSyncWrapper>
  );
}

export default MainPage;
