import React from 'react';
import { useModal } from '../../contexts';
import { AddToCartModal } from './add-to-cart-modal';
import { SuccessAddCartModal } from './success-add-cart-modal';

export const ModalContainer: React.FC = () => {
  const { modalState } = useModal();

  if (!modalState) {
    return null;
  }

  switch (modalState.type) {
    case 'add-to-cart':
      return <AddToCartModal productData={modalState.productData!} />;
    case 'success-add-cart':
      return <SuccessAddCartModal />;
    default:
      return null;
  }
};
