import { useEffect } from 'react';
import { useAppSelector, useAppDispatch, } from '../../hooks';
import Breadcrumbs from '../../components/breadcrumbs';
import { CartItem } from '../../components/cart';
import LoaderOverlay from '../../components/loader-overlay';
import FormCouponMemo from '../../components/form-promo-code';
import { useCart, useModal } from '../../contexts';
import {
  selectCoupon,
  selectDiscount,
  setDiscount, setCoupon,
  resetCoupon,
  selectIsCouponLoading
} from '../../store/promo-code';
import {
  selectOrderError,
  selectIsOrderLoading,
  selectIsOrderSucceeded,
  selectIsOrderFailed,
  resetOrder
} from '../../store/order';
import { sendOrder } from '../../store/api-action';


function BasketPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { openModal } = useModal();

  const discountPercent = useAppSelector(selectDiscount) || 0;
  const coupon = useAppSelector(selectCoupon);

  const orderError = useAppSelector(selectOrderError);
  const isOrderLoading = useAppSelector(selectIsOrderLoading);
  const isOrderSucceeded = useAppSelector(selectIsOrderSucceeded);
  const isOrderFailed = useAppSelector(selectIsOrderFailed);

  const totalPrice = getTotalPrice();
  const discountAmount = Math.max(0, Math.round(totalPrice * discountPercent / 100));
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const isBasketEmpty = cartItems.length === 0;

  const isCouponLoading = useAppSelector(selectIsCouponLoading);
  const isLoading = isOrderLoading || isCouponLoading;


  useEffect(() => {
    if (isLoading) {
      document.body.classList.add('scroll-lock');
    } return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, [isLoading]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem('appliedCoupon', coupon);
      localStorage.setItem('couponDiscount', discountPercent.toString());
    }
  }, [coupon, discountPercent]);

  useEffect(() => {
    const savedCoupon = localStorage.getItem('appliedCoupon');
    const savedDiscount = localStorage.getItem('couponDiscount');

    if (savedCoupon && savedDiscount) {
      dispatch(setCoupon(savedCoupon));
      dispatch(setDiscount(Number(savedDiscount)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (coupon && discountPercent > 0) {
      localStorage.setItem('appliedCoupon', coupon);
      localStorage.setItem('couponDiscount', discountPercent.toString());
    } else {
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('couponDiscount');
    }
  }, [coupon, discountPercent]);

  useEffect(() => {
    if (!isOrderSucceeded) {
      return;
    }

    clearCart();
    dispatch(resetCoupon());
    openModal('success-order');
    dispatch(resetOrder());
  }, [isOrderSucceeded, clearCart, openModal, dispatch]);

  useEffect(() => {
    if (isOrderFailed && orderError) {
      openModal('error-order', orderError);
    }
  }, [isOrderFailed, orderError, openModal]);

  const handleOrderSubmit = () => {
    if (isBasketEmpty) {
      return;
    }

    const camerasIds = cartItems.flatMap((item) =>
      Array.from({ length: item.quantity }, () => item.id)
    );

    const orderData = {
      camerasIds,
      coupon: coupon || null,
    };

    dispatch(sendOrder(orderData));
  };

  return (
    <div className="page-content" data-testid="basket-page">
      {isLoading && <LoaderOverlay />}
      <Breadcrumbs />
      <section className="basket">
        <div className="container">
          <h1 className="title title--h2">Корзина</h1>
          <ul className="basket__list">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
          <div className="basket__summary">
            <FormCouponMemo />
            <div className="basket__summary-order">
              <p className="basket__summary-item">
                <span className="basket__summary-text">Всего:</span>
                <span className="basket__summary-value">
                  {totalPrice.toLocaleString()}&nbsp;&#8381;
                </span>
              </p>
              <p className="basket__summary-item">
                <span className="basket__summary-text">Скидка:</span>
                <span className="basket__summary-value basket__summary-value--bonus">
                  {discountAmount.toLocaleString()}&nbsp;&#8381;
                </span>
              </p>
              <p className="basket__summary-item">
                <span className="basket__summary-text basket__summary-text--total">К оплате:</span>
                <span className="basket__summary-value basket__summary-value--total">
                  {finalPrice.toLocaleString()}&nbsp;&#8381;
                </span>
              </p>
              <button
                className="btn btn--purple"
                type="submit"
                onClick={handleOrderSubmit}
                disabled={isBasketEmpty}
              >
                Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BasketPage;
