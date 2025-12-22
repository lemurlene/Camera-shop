import React, { useCallback, useEffect } from 'react';
import { useModalFocus } from '../../hooks';
import { getFocusableElements } from './utils';

interface ModalProps {
  children: React.ReactNode;
  narrow?: boolean;
  onClose: () => void;
  isActive?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  narrow = false,
  onClose,
  isActive = true
}) => {
  const modalRef = useModalFocus(isActive);

  const handleButtonEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleTabKey = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return;
    }
    if (!modalRef.current) {
      return;
    }
    const focusableElements = getFocusableElements(modalRef.current);
    if (focusableElements.length === 0) {
      return;
    }
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }, [modalRef]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleButtonEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.classList.add('scroll-lock');
      return () => {
        document.removeEventListener('keydown', handleButtonEscape);
        document.removeEventListener('keydown', handleTabKey);
        document.body.classList.remove('scroll-lock');
      };
    }
  }, [isActive, handleButtonEscape, handleTabKey]);

  if (!isActive) {
    return null;
  }

  const modalClass = `modal is-active ${narrow ? 'modal--narrow' : ''}`;

  return (
    <div className={modalClass} ref={modalRef}>
      <div className="modal__wrapper">
        <div className="modal__overlay" onClick={handleOverlayClick}></div>
        <div className="modal__content">
          <button
            className="cross-btn"
            type="button"
            aria-label="Закрыть попап"
            onClick={onClose}
          >
            <svg width="10" height="10" aria-hidden="true">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};
