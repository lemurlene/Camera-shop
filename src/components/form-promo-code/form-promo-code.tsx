import { memo, useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  resetCoupon,
  selectCoupon,
  selectDiscount,
  selectCouponStatus,
  selectCouponError
} from '../../store/promo-code';
import { checkCoupon } from '../../store/api-action';

function FormPromoCode() {
  const dispatch = useAppDispatch();
  const coupon = useAppSelector(selectCoupon);
  const discount = useAppSelector(selectDiscount);
  const status = useAppSelector(selectCouponStatus);
  const error = useAppSelector(selectCouponError);

  const [promoCode, setPromoCode] = useState(coupon || '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (status === 'loading') {
      setLocalError(null);
      setLocalSuccess(null);
    } else if (status === 'succeeded') {
      setLocalError(null);
      setLocalSuccess('Промокод принят!');
    } else if (status === 'failed') {
      setLocalError(error || 'Неверный промокод');
      setLocalSuccess(null);
    }
  }, [status, discount, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    setPromoCode(value);

    if (coupon || discount > 0 || localError || localSuccess) {
      dispatch(resetCoupon());
    }

    setLocalError(null);
    setLocalSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPromoCode = promoCode.trim().replace(/\s/g, '');

    if (!cleanedPromoCode) {
      setLocalError('Введите промокод');
      return;
    }

    dispatch(checkCoupon(cleanedPromoCode));
  };

  const isLoading = status === 'loading';

  return (
    <div className="basket__promo">
      <p className="title title--h4">
        Если у вас есть промокод на скидку, примените его в этом поле
      </p>
      <div className="basket-form">
        <form action="#" onSubmit={handleSubmit}>
          <div className={`custom-input ${localSuccess ? 'is-valid' : ''} ${localError ? 'is-invalid' : ''}`}>
            <label>
              <span className="custom-input__label">Промокод</span>
              <input
                type="text"
                name="promo"
                placeholder="Введите промокод"
                value={promoCode}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </label>
            {localError && (
              <p className="custom-input__error">
                {localError}
              </p>
            )}
            {localSuccess && (
              <p className="custom-input__success">
                {localSuccess}
              </p>
            )}
          </div>
          <button
            className="btn"
            type="submit"
            disabled={isLoading || !promoCode.trim()}
          >
            {isLoading ? 'Проверка...' : 'Применить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export const FormPromoCodeMemo = memo(FormPromoCode);
