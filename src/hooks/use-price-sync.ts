import { useEffect } from 'react';
import { useAppSelector } from './';
import { useUrl } from '../contexts';
import { selectMinPrice, selectMaxPrice } from '../store/filters';

export const usePriceSync = () => {
  const { setParam } = useUrl();
  const currentMinPrice = useAppSelector(selectMinPrice);
  const currentMaxPrice = useAppSelector(selectMaxPrice);

  useEffect(() => {
    if (currentMinPrice !== null) {
      setParam('price_min', currentMinPrice.toString());
    } else {
      setParam('price_min', null);
    }
  }, [currentMinPrice, setParam]);

  useEffect(() => {
    if (currentMaxPrice !== null) {
      setParam('price_max', currentMaxPrice.toString());
    } else {
      setParam('price_max', null);
    }
  }, [currentMaxPrice, setParam]);
};
