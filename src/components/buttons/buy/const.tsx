export const ButtonBuyConfig = {
  Card: {
    buttonClass: ' product-card__btn',
    buttonText: 'Купить',
    buttonIcon: '',
  },
  Offer: {
    buttonClass: '',
    buttonText: 'Добавить в корзину',
    buttonIcon: (
      <svg width="24" height="16" aria-hidden="true">
        <use xlinkHref="#icon-add-basket"> </use>
      </svg>
    )
  }
};
