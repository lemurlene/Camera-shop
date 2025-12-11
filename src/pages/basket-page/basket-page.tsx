import Breadcrumbs from '../../components/breadcrumbs';
import { CartItem } from '../../components/cart';
import FormPromoCodeMemo from '../../components/form-promo-code';
import { useCart } from '../../contexts';

function BasketPage(): JSX.Element {
  const { cartItems, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <div className="page-content" data-testid="basket-page">
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
            <FormPromoCodeMemo />
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
                  {totalPrice.toLocaleString()}&nbsp;&#8381;
                </span>
              </p>
              <p className="basket__summary-item">
                <span className="basket__summary-text basket__summary-text--total">К оплате:</span>
                <span className="basket__summary-value basket__summary-value--total">
                  {totalPrice.toLocaleString()}&nbsp;&#8381;
                </span>
              </p>
              <button className="btn btn--purple" type="submit">Оформить заказ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BasketPage;
