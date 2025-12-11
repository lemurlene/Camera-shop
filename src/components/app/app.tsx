import { useEffect, useState } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from '../layout';
import ErrorServer from '../error-server';
import MainPage from '../../pages/main-page';
import LoadingPage from '../../pages/loading-page';
import OfferPage from '../../pages/offer-page';
import NotFoundPage from '../../pages/not-found-page';
import DevelopmentPage from '../../pages/development-page';
import BasketPage from '../../pages/basket-page';
import { fetchOffers, fetchOffersPromo } from '../../store/api-action';
import { AppRoute } from '../../const/enum';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { setErrorConnectionOffers, selectErrorConnectionOffers } from '../../store/offers';
import { setErrorConnectionOffersPromo } from '../../store/offers-promo';
import { UrlProvider, CartProvider } from '../../contexts/';

function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const isServerError = useAppSelector(selectErrorConnectionOffers);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        await dispatch(fetchOffers()).unwrap();
        if (!isMounted) {
          return;
        }
        await dispatch(fetchOffersPromo()).unwrap();
        if (!isMounted) {
          return;
        }
        dispatch(setErrorConnectionOffers(false));
        dispatch(setErrorConnectionOffersPromo(false));

        setIsInitialized(true);

      } catch (error) {
        if (!isMounted) {
          return;
        }
        dispatch(setErrorConnectionOffers(true));
        dispatch(setErrorConnectionOffersPromo(true));
        setIsInitialized(true);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <UrlProvider>
          <CartProvider>
            {isServerError ? (
              <ErrorServer mainPage />
            ) : (
              <Routes>
                <Route path={AppRoute.Root} element={<Layout />}>
                  {!isInitialized ? (
                    <Route index element={<LoadingPage />} />
                  ) : (
                    <>
                      <Route index element={<MainPage />} />
                      <Route
                        path={AppRoute.Catalog}
                        element={<MainPage />}
                      />
                      <Route
                        path={AppRoute.Offer}
                        element={<OfferPage />}
                      />
                      <Route
                        path={AppRoute.Error404}
                        element={<NotFoundPage />}
                      />
                      <Route
                        path={AppRoute.Guarantees}
                        element={<DevelopmentPage />}
                      />
                      <Route
                        path={AppRoute.Delivery}
                        element={<DevelopmentPage />}
                      />
                      <Route
                        path={AppRoute.Basket}
                        element={<BasketPage />}
                      />
                    </>
                  )}
                </Route>
              </Routes>
            )}
          </CartProvider>
        </UrlProvider>
      </BrowserRouter>
    </HelmetProvider >
  );
}

export default App;
