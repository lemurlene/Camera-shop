import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { TabSyncWrapper } from '../../components/wrappers';
import { selectOffer, selectOfferLoading, selectErrorConnection, setErrorConnectionStatusOffer } from '../../store/offer';
import { selectOffersSimilar, selectOffersSimilarLoading } from '../../store/offers-similar';
import { selectCommentsOffersStatus, selectOffersComments } from '../../store/reviews';
import { Offer } from '../../components/offer';
import { OffersSimilar } from '../../components/offers-similar';
import Breadcrumbs from '../../components/breadcrumbs';
import Reviews from '../../components/reviews';
import { getOfferInfoById, fetchOffersSimilar, fetchOfferComments } from '../../store/api-action';
import LoadingPage from '../loading-page';
import NotFoundPage from '../not-found-page';
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

  const [comments, isOffersCommentsLoading] = useAppSelector((state) => [
    selectOffersComments(state),
    selectCommentsOffersStatus(state)
  ]);

  const loadOfferData = useCallback(async () => {
    if (!offerId) {
      return;
    }

    try {
      await dispatch(getOfferInfoById(offerId)).unwrap();
      await Promise.all([
        dispatch(fetchOffersSimilar(offerId)),
        dispatch(fetchOfferComments(offerId))
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

  if (isOfferLoading || isLoadingOffersSimilar || isOffersCommentsLoading) {
    return <LoadingPage />;
  }

  if (!offer) {
    return <NotFoundPage />;
  }

  const isEmptyOffersSimilar = offersSimilar.length === 0;

  return (
    <div className="page-content">
      <Breadcrumbs productName={offer.name} />
      <div className="page-content__section">
        <Offer offer={offer} />
      </div>
      {!isEmptyOffersSimilar && <OffersSimilar offersSimilar={offersSimilar} />}
      <div className="page-content__section">
        <Reviews comments={comments} />
      </div>
    </div>
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
