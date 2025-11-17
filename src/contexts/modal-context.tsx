import React, { createContext, useContext, useState, useCallback } from 'react';
import { FullOfferType } from '../const/type';
import { ModalType } from '../components/modals/type';

interface ModalState {
  type: ModalType;
  productData?: FullOfferType;
}

interface ModalContextType {
  openModal: (type: ModalType, product?: FullOfferType) => void;
  closeModal: () => void;
  modalState: ModalState | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const openModal = useCallback((type: ModalType, product?: FullOfferType) => {
    setModalState({
      type,
      productData: product
    });
    document.body.classList.add('scroll-lock');
  }, []);

  const closeModal = useCallback(() => {
    setModalState(null);
    document.body.classList.remove('scroll-lock');
  }, []);

  const contextValue: ModalContextType = {
    openModal,
    closeModal,
    modalState
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
