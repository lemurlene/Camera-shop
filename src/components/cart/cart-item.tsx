import React, { useState } from 'react';
import { useModal, useCart } from '../../contexts';
import BasketCardMemo from '../card/basket-card';
import { CartItem as CartItemType } from './types';
import { Setting } from '../../const/const';

type CartItemProps = {
  item: CartItemType;
};

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { openModal } = useModal();
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= Setting.MaxProductQuantity) {
      setQuantity(newQuantity);
      updateQuantity(item.id, newQuantity);
    }
  };

  const increment = () => handleQuantityChange(quantity + 1);
  const decrement = () => handleQuantityChange(quantity - 1);
  const disabledIncrement = (quantity >= Setting.MaxProductQuantity);
  const disabledDecrement = (quantity <= 1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      handleQuantityChange(value);
    }
  };

  const handleRemove = () => {
    openModal('delete-from-cart');
  };

  return (
    <li className="basket-item">
      <BasketCardMemo card={item.data} />

      <div className="quantity">
        <button
          onClick={decrement}
          className="btn-icon btn-icon--prev"
          disabled={disabledDecrement}
          aria-label="Уменьшить количество"
        >
          <svg width="7" height="12" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>

        <label className="visually-hidden" htmlFor={`counter-${item.id}`}>
          Количество товара
        </label>
        <input
          type="number"
          id={`counter-${item.id}`}
          value={quantity}
          onChange={handleInputChange}
          min="1"
          max={Setting.MaxProductQuantity}
          className="quantity__input"
        />

        <button
          onClick={increment}
          className="btn-icon btn-icon--next"
          disabled={disabledIncrement}
          aria-label="Увеличить количество"
        >
          <svg width="7" height="12" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>
      </div>

      <div className="basket-item__total-price">
        <span className="visually-hidden">Общая цена:</span>
        {(item.data.price * quantity).toLocaleString()}&nbsp;&#8381;
      </div>

      <button
        onClick={handleRemove}
        className="cross-btn"
        type="button"
        aria-label="Удалить товар"
      >
        <svg width="10" height="10" aria-hidden="true">
          <use xlinkHref="#icon-close"></use>
        </svg>
      </button>
    </li>
  );
};
