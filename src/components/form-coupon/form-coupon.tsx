import { memo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  resetCoupon,
  selectCoupon,
  selectCouponStatus,
  selectCouponError
} from '../../store/coupon';
import { checkCoupon } from '../../store/api-action';
import { LoadingStatus } from '../../const/enum';

function FormCoupon() {
  const dispatch = useAppDispatch();

  const coupon = useAppSelector(selectCoupon);
  const status = useAppSelector(selectCouponStatus);
  const error = useAppSelector(selectCouponError);

  const [value, setValue] = useState<string>(coupon ?? '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (status === LoadingStatus.Loading) {
      setLocalError(null);
      setLocalSuccess(null);
    }

    if (status === LoadingStatus.Success) {
      setLocalError(null);
      setLocalSuccess('Промокод принят!');
    }

    if (status === LoadingStatus.Error) {
      setLocalSuccess(null);
      setLocalError(error ?? 'Неверный промокод');
    }
  }, [status, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value.replace(/\s/g, '');
    setValue(nextValue);

    if (status !== LoadingStatus.Idle) {
      dispatch(resetCoupon());
    }

    setLocalError(null);
    setLocalSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!value.trim()) {
      setLocalError('Введите промокод');
      return;
    }

    dispatch(checkCoupon(value));
  };

  const isLoading = status === LoadingStatus.Loading;

  return (
    <div className="basket__promo">
      <p className="title title--h4">
        Если у вас есть промокод на скидку, примените его в этом поле
      </p>

      <div className="basket-form">
        <form onSubmit={handleSubmit}>
          <div
            className={`custom-input
              ${localSuccess ? 'is-valid' : ''}
              ${localError ? 'is-invalid' : ''}`}
          >
            <label>
              <span className="custom-input__label">Промокод</span>
              <input
                type="text"
                value={value}
                onChange={handleInputChange}
                placeholder="Введите промокод"
                disabled={isLoading}
              />
            </label>

            {localError && (
              <p className="custom-input__error">{localError}</p>
            )}

            {localSuccess && (
              <p className="custom-input__success">{localSuccess}</p>
            )}
          </div>

          <button
            className="btn"
            type="submit"
            disabled={isLoading || !value.trim()}
          >
            {isLoading ? 'Проверка...' : 'Применить'}
          </button>
        </form>
      </div>
    </div>
  );
}

export const FormCouponMemo = memo(FormCoupon);
