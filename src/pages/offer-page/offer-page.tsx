import { useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { TabSyncWrapper } from '../../components/wrappers/tab-sync-wrapper';
import { selectOffer, selectOfferLoading, selectErrorConnection } from '../../store/offer/offer.selector';
import { selectOffersSimilar, selectOffersSimilarLoading } from '../../store/offers-similar/offers-similar.selector';
import { Offer, OffersSimilar } from '../../components/offer';
import Breadcrumbs from '../../components/breadcrumbs';
import { getOfferInfoById, fetchOffersSimilar } from '../../store/api-action';
import { setErrorConnectionStatusOffer } from '../../store/offer/offer.slice';
import LoadingPage from '../loading-page/loading-page';
import NotFoundPage from '../not-found-page/not-found-page';
import ErrorServer from '../../components/error-server';
import { useId } from '../../utils';

function OfferPageContent() {
  const dispatch = useAppDispatch();
  const offerId = useId();

  const [offer, isOfferLoading, errorConnectionStatus] = useAppSelector((state) => [
    selectOffer(state),
    selectOfferLoading(state),
    selectErrorConnection(state)
  ]);

  const [offersSimilar, isLoadingOffersSimilar] = useAppSelector((state) => [
    selectOffersSimilar(state),
    selectOffersSimilarLoading(state)
  ]);

  const loadOfferData = useCallback(async () => {
    if (!offerId) {
      return;
    }

    try {
      await dispatch(getOfferInfoById(offerId)).unwrap();
      await Promise.all([
        dispatch(fetchOffersSimilar(offerId))
      ]);
    } catch {
      dispatch(setErrorConnectionStatusOffer(true));
    }
  }, [dispatch, offerId]);

  useEffect(() => {
    loadOfferData();
    return () => {
      dispatch(setErrorConnectionStatusOffer(false));
    };
  }, [loadOfferData, dispatch]);

  if (errorConnectionStatus && offer) {
    return <ErrorServer />;
  }

  if (isOfferLoading || isLoadingOffersSimilar) {
    return <LoadingPage />;
  }

  if (!offer) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>Camera-shop: offer</title>
      </Helmet>
      <main>
        <div className="page-content">
          <Breadcrumbs productName={offer.name} />
          <div className="page-content__section">
            <Offer offer={offer} />
          </div>
          <div className="page-content__section">
            <OffersSimilar offersSimilar={offersSimilar} />
          </div>
        </div>
      </main>
    </>
  );
}

function OfferPage() {
  return (
    <TabSyncWrapper paramName="tab" defaultTab="description">
      <OfferPageContent />
    </TabSyncWrapper>
  );
}

export default OfferPage;
