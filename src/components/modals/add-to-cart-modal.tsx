import React from 'react';
import { Modal } from './modal';
import { BasketCardMemo } from '../offer';
import { useModal } from '../../contexts';
import ButtonAddBasketMemo from '../buttons/add-basket';
import { FullOfferType } from '../../const/type';

interface AddToCartModalProps {
  productData: FullOfferType;
}

export const AddToCartModal: React.FC<AddToCartModalProps> = ({ productData }) => {
  const { closeModal } = useModal();

  return (
    <Modal onClose={closeModal}>
      <p className="title title--h4">Добавить товар в корзину</p>
      <div className="basket-item basket-item--short">
        <BasketCardMemo card={productData} isModal />
      </div>
      <div className="modal__buttons">
        <ButtonAddBasketMemo isModal />
      </div>
    </Modal>
  );
};
