export const ButtonBuyConfig = {
  Buy: {
    buttonClass: ' btn--purple',
    buttonText: 'Купить',
    buttonIcon: '',
  },
  AddToCart: {
    buttonClass: ' btn--purple',
    buttonText: 'Добавить в корзину',
    buttonIcon: (
      <svg width="24" height="16" aria-hidden="true">
        <use xlinkHref="#icon-add-basket"> </use>
      </svg>
    ),
  },
  InCart: {
    buttonClass: ' btn--purple-border product-card__btn--in-cart',
    buttonText: 'В корзине',
    buttonIcon: (
      <svg width="24" height="16" aria-hidden="true">
        <use xlinkHref="#icon-basket"> </use>
      </svg>
    )
  }
};
