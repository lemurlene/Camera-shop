import React from 'react';
import { Modal } from './modal';
import { BasketCardMemo } from '../card';
import { useModal } from '../../contexts';
import { ButtonDeleteFromBasketMemo } from '../buttons';
import { FullOfferType } from '../../const/type';

interface DeleteFromCartModalProps {
  productData: FullOfferType;
}

export const DeleteFromCartModal: React.FC<DeleteFromCartModalProps> = ({ productData }) => {
  const { closeModal } = useModal();

  return (
    <Modal onClose={closeModal}>
      <p className="title title--h4">Удалить этот товар?</p>
      <div className="basket-item basket-item--short">
        <BasketCardMemo card={productData} isModal />
      </div>
      <div className="modal__buttons">
        <ButtonDeleteFromBasketMemo productId={productData.id} />
      </div>
    </Modal>
  );
};
